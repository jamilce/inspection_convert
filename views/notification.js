function getInfo() {
    return "notification.html";
}
var mailbox = 'notification';
function onLoad() {
    $.get(routes.notification, function (data) {
        $('#mainSection').html(data);


        getMailbox();

        pleaseWait(false);
    });
}
function MarkAsRead() {
    var data1 = JSON.parse(ss[mailbox]);
    var data2 = JSON.parse(ss[mailbox + "_incident"]);
    var listID = [];
    data1.forEach(function (v) {
        if (!v.Seen)
            listID.push(v.NotificationID);
    });
    data2.forEach(function (v) {
        if (!v.Seen)
            listID.push(v.NotificationID);
    });
    if (listID.length > 0) {
        FetchService('POST', config.MarkNotificationAsRead, JSON.stringify({ IDListForReadMark: listID }), false, function (r) {
            window.location.reload(true);
        }, true);
    }
}
function getMailbox() {
    // debugger;
    var url1 = config.GetNotification_Audit;
    var url2 = config.GetNotification_Incident;
    var totalCount = 0;
    var data = JSON.stringify({
        employeeID: lsUser.UserID,
        currentPage: 1,
        lang: lsUser.inslang
    });
    //$('.totalItem_' + mailbox).html(" - " + "0");
    FetchService('post', url1, data, true, function (r) {
       
        var h = '';
        var res_ = r.ResponseData;
        console.log(res_);
        ss.setItem(mailbox, JSON.stringify(res_));
        totalCount += r.ResponseData.length;
        $('.totalItem_' + mailbox).html(" - " + totalCount > 0 ? totalCount : "");
        if (res_.length === 0) {
            $('div.list-group.' + mailbox).html(h);
        } else {
            $.each(res_, function (i, res) {
                var bg = !res.Seen ? 'background-color: beige;' : '';
                h += '<a href="javascript:void(0);" class="list-group-item " style="' + bg + '" data-id="' + res.NotificationID + '"  data-mailbox="' + mailbox + '" onclick="GetNotificationDetail(this)">\
                     <h6 class="list-group-item-heading" style="color: rgba(0, 0, 0, 0.68);">' + res.estNam + '</h6>';
                h += '<span class="label bg-grey">  ' + Util.getDateSQL(res.CreatedDate) + '  </span></a>';

            });
            $('div.list-group.' + mailbox).html(h);
            $('#markread').show();

            FetchService('post', url2, data, true, function (r) {
                debugger;
                var h = '';
                var res_ = r.ResponseData;
                console.log(res_);
                ss.setItem(mailbox + "_incident", JSON.stringify(res_));
                totalCount += r.ResponseData.length;
                $('.totalItem_' + mailbox).html(" - " + totalCount > 0 ? totalCount : "");
                if (res_.length === 0) {
                    //  $('div.list-group.' + mailbox).html(h);
                } else {
                    $.each(res_, function (i, res) {
                        var bg = !res.Seen ? 'background-color: beige;' : '';
                        h += '<a href="javascript:void(0);" class="list-group-item " style="' + bg + '" data-id="' + res.NotificationID + '"  data-mailbox="' + mailbox + '" onclick="GetNotificationIncidentDetail(this)">\
                     <h6 class="list-group-item-heading" style="color: rgba(0, 0, 0, 0.68);">' + res.title + '</h6>';
                        h += '<span class="label bg-grey">  ' + Util.getDateSQL(res.CreatedDate) + '  </span></a>';

                        $('div.list-group.' + mailbox).append(h);
                        $('#markread').show();
                    });
                }
            });

            trans();
        }
    });
    //Fetch all incident notification

}
function GetNotificationDetail(e) {
    debugger;
    var data = JSON.parse(ss.getItem(mailbox));
    $('.list-group-item').removeClass('active');
    $(e).addClass('active');
    $('div[id^=divInsForm]').html('');
    var divPage = $('#divInsForm_' + mailbox);
    var ID = e.dataset.id;
    data = Util.findInJSONObject(data, { NotificationID: ID })[0];

    var pageHTML = '<div class="animated fadeIn">\
    <div class="card">\
        <div class="body">\
            <div class="row clearfix">\
                <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">\
                    <ul class="list-group followupDetail">\
                         <li class="list-group-item">\
                            <span data-tran="_comment"></span>  <span class="badge animated slideInDown ">\
                           ' + data.template + '\
                            </span>\
                        </li>\
                        <li class="list-group-item">\
                            <span data-tran="_establishmentType"></span>\
                            <span class="badge animated slideInDown">' + data.estType + '</span>\
                        </li>\
                        <li class="list-group-item">\
                            <span data-tran="_establishment"></span>\
                            <span class="badge animated slideInDown">' + data.estNam + '</span>\
                        </li>\
                        <li class="list-group-item">\
                            <span data-tran="_emirate"></span>\
                            <span class="badge animated slideInDown">' + data.Emirate + '</span>\
                        </li>\
                        <li class="list-group-item">\
                            <span data-tran="_type"></span>  <span class="badge animated slideInDown ">\
                           ' + data.IsAudit + '\
                            </span>\
                        </li>\
                        <li class="list-group-item">\
                            <span data-tran="_from"></span>\
                            <span class="badge animated slideInDown">' + data.From + '</span>\
                        </li>\
                        <li class="list-group-item">\
                            <span data-tran="_to"></span>\
                            <span class="badge animated slideInDown">' + data.To + '</span>\
                        </li>\
                        <li class="list-group-item">\
                            <span data-tran="_status"></span>  <span class="badge animated slideInDown ">\
                           ' + data.Status + '\
                            </span>\
                        </li>\
                        <li class="list-group-item">\
                            <span data-tran="_date"></span>\
                            <span class="badge animated slideInDown">' + Util.getDateSQL(data.CreatedDate) + '</span>\
                        </li>\
                    </ul>\
                </div>\
            </div>\
          </div>\
    </div>';
    divPage.html(pageHTML);
    trans();

    setTimeout(function () {
        ReadNotification(ID);
    }, 1000);
}

function GetNotificationIncidentDetail(e) {
    debugger;
    var data = JSON.parse(ss.getItem(mailbox + "_incident"));
    $('.list-group-item').removeClass('active');
    $(e).addClass('active');
    $('div[id^=divInsForm]').html('');
    var divPage = $('#divInsForm_' + mailbox);
    var ID = e.dataset.id;
    data = Util.findInJSONObject(data, { NotificationID: ID })[0];

    var pageHTML = '<div class="animated fadeIn">\
    <div class="card">\
        <div class="body">\
            <div class="row clearfix">\
                <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">\
                    <ul class="list-group followupDetail">\
                        <li class="list-group-item">\
                            <span data-tran="_comment"></span>  <span class="badge animated slideInDown ">\
                           ' + data.template + '\
                            </span>\
                        </li>\
                        <li class="list-group-item">\
                            <span data-tran="_incidentTitle"></span>\
                            <span class="badge animated slideInDown">' + data.title + '</span>\
                        </li>\
                        <li class="list-group-item">\
                            <span data-tran="_incidentNo"></span>\
                            <span class="badge animated slideInDown">' + data.TitleNo + '</span>\
                        </li>\
                        <li class="list-group-item">\
                            <span data-tran="_from"></span>\
                            <span class="badge animated slideInDown">' + data.From + '</span>\
                        </li>\
                        <li class="list-group-item">\
                            <span data-tran="_to"></span>\
                            <span class="badge animated slideInDown">' + data.To + '</span>\
                        </li>\
                        <li class="list-group-item">\
                            <span data-tran="_status"></span>  <span class="badge animated slideInDown ">\
                           ' + data.Status + '\
                            </span>\
                        </li>\
                        <li class="list-group-item">\
                            <span data-tran="_date"></span>\
                            <span class="badge animated slideInDown">' + Util.getDateSQL(data.CreatedDate) + '</span>\
                        </li>\
                    </ul>\
                </div>\
            </div>\
          </div>\
    </div>';
    divPage.html(pageHTML);
    trans();

    setTimeout(function () {
        ReadNotification(ID);
    }, 1000);
}

function ReadNotification(id) {
    var data = JSON.stringify({
        Id: id
    });
    FetchService('post', config.ReadNotification, data, true, function (r) {
    });
}