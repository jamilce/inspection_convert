function getInfo() {
    return "main";
}

function onLoad() {
    $.get(routes.main, function (data) {
        $('#mainSection').html(data);
        AccessFeature();
        trans();

        //if (lsUser.RoleID == EmployeeRole.Department_Staff) {
            ItemCountDashboard.getEmployee();
       // }

    });
}

//var GetNotificaiton = {
//    getMailboxCount: function () {
//        FetchService('post', config.GetMailCount, JSON.stringify({ employeeID: lsUser.UserID }), true, function (r) {
//            if (r.IsSuccess) {
//                console.log(r);
//                var data = r.ResponseData;
//                Global.InboxCount = data.inboxCount;
//                //debugger;
//                $('.mailboxNumberClass').html("");
//                $('.mailboxNumberClass').hide();
//                if (data.inboxCount > 0 && data.inboxCount < 99) {
//                    $('.mailboxNumberClass').addClass('notificationClass');
//                    $('.mailboxNumberClass').html(data.inboxCount > 0 && data.inboxCount < 99 ? data.inboxCount : "99+");
//                    $('.mailboxNumberClass').show();
//                }

//                //$('.totalItem_sent').html(" - " + data.sentCount);
//                //$('.totalItem_pending').html(" - " + data.pendingCount);
//                //$('.totalItem_completed').html(" - " + data.completedCount);
//                //  data.NotificationCount 
//            }
//        }, false);
//    },
//    getIncidentCount: function () {
//        FetchService('post', config.GetMailCount_Incident, JSON.stringify({ employeeID: lsUser.UserID }), true, function (r) {
//            if (r.IsSuccess) {
//                console.log(r);
//                var data = r.ResponseData;
//                Global.Incident.inbox = data.inboxCount;
//                Global.Incident.sent = data.sentCount;

//                $('.incidentNumberClass').html("");
//                $('.incidentNumberClass').hide();
//                if (data.inboxCount > 0 && data.inboxCount < 99) {
//                    $('.incidentNumberClass').addClass('notificationClass');
//                    $('.incidentNumberClass').html(data.inboxCount > 0 && data.inboxCount < 99 ? data.inboxCount : "99+");
//                    $('.incidentNumberClass').show();
//                }

//            }
//        }, false);
//    },
//    FetchNotificationCount: function () { //disable it... is for next plan to enable it.
//        setTimeout(function () {
//            FetchService('post', config.GetUnReadNotificationCount, JSON.stringify({ employeeID: lsUser.UserID }), true, function (r) {
//                if (r.IsSuccess) {
//                    console.log(r);
//                    var data = r.ResponseData;
//                    var total = Global.NotificationCount = data.NotificationCount;
//                    //debugger;
//                    $('.notificationNumber').hide();
//                    if (total > 0 && total < 99) {
//                        $('.notificationNumber').addClass('notificationClass');
//                        $('.notificationNumber').html("   " + total);
//                        $('.notificationNumber').show();
//                    }
//                    else if (total > 99) {
//                        $('.notificationNumber').addClass('notificationClass');
//                        $('.notificationNumber').html("99+");
//                        $('.notificationNumber').show();
//                    }

//                    //  data.NotificationCount 
//                }
//            }, false);
//        }, 1000);
//    }
//};

