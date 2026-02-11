function getInfo() {
    return "profile";
}
function onLoad() {
    $.get(routes.profile, function (data) {
        $('#mainSection').html(data);
        LoadData();
        pleaseWait(false);
    });
}

function LoadData() {
    var data = ''; var pre = '';
    FetchService('post', config.getEmployee, JSON.stringify({ UserID: 99999 }), true,
        function (r) {
            if (r.IsSuccess) {
                data = r.ResponseData[0];
                //console.log(data);
                var html = '<div class="row clearfix">\
                                <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">\
                                    <ul class="list-group followupDetail">\
                                        <li class="list-group-item">\
                                            <span data-tran="_Name"></span>  <span class="badge animated slideInDown ">\
                                           ' + data.FullName + '\
                                            </span>\
                                        </li>\
                                        <li class="list-group-item">\
                                            <span data-tran="_username"></span>\
                                            <span class="badge animated slideInDown ">\
                                                '+ data.UserName + ' \
                                            </span>\
                                        </li>\
                                        <li class="list-group-item">\
                                            <span data-tran="_email"></span>\
                                            <span class="badge animated slideInDown">' + data.Email + '</span>\
                                        </li>\
                                         <li class="list-group-item">\
                                            <span data-tran="_role"></span>\
                                            <span class="badge animated slideInDown">' + data.RoleName + '</span>\
                                        </li>\
                                        <li class="list-group-item">\
                                            <span data-tran="_department"></span>\
                                            <span class="badge animated slideInDown">' + data.DeptNameAr + '</span>\
                                        </li>\
                                        <li class="list-group-item">\
                                            <span data-tran="_jobTitle"></span>\
                                            <span class="badge animated slideInDown">' + data.JobTitle + '</span>\
                                        </li>\
                                        <li class="list-group-item">\
                                            <span data-tran="_lastLoginDate"></span>\
                                            <span class="badge animated slideInDown">' + Util.getDateSQL(data.LastLoginDate) + '</span>\
                                        </li>\
                                    </ul>\
                              </div>  </div>';
                $('#loadData').html(html);
                trans();
            }
        }
    );
    //FetchService('post', config.GetEmployeePrivilege, JSON.stringify({ EmployeeID: ls.UserID }), true,
    //    function (r) {
    //        if (r.IsSuccess) {
    //            pre = r.ResponseData;
    //            console.log(pre);
    //        }
    //    }
    //);
     
}