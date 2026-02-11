function getInfo() {
    return "incidentmail";
}

function onLoad() {
    debugger;
    $.get(routes.incidentmail, function (data) {
        $('#mainSection').html(data);

        $('.totalItem_inbox_incident').html(" - " + Global.Incident.inbox);
        $('.totalItem_sent_incident').html(" - " + Global.Incident.sent);

        if (lsUser.RoleID == EmployeeRole.CustomerService) {
            $('.btnAddIncident').show();
        }
        debugger;
        var DefaultTab = '';
        if (typeof (params) == "string") {
            DefaultTab = 'inbox_incident';
        }
        else if (typeof (params) == "object" && lsUser.RoleID == EmployeeRole.Department_Staff)
            DefaultTab = 'inbox_incident';
        else {
            DefaultTab = 'sent_incident';
        }

        getMailbox(DefaultTab);

        var switchTab = DefaultTab == 'sent_incident' ? '_sentItem' : '_inboxText';
        $('.nav-tabs a[href="#' + switchTab + '"]').tab('show');
        //$("#inboxClick").one("click", function () {
        //    getMailbox('inbox');
        //});
        $("#sentOnClick").one("click", function () {
            getMailbox('sent_incident');
        });

        //getMailboxCount();
        trans();
        if (lsUser.RoleID == EmployeeRole.Department_Staff) {
            getRiskLevel();
            getReplyOption();
        }
        pleaseWait(false);
    });
}



function getMailbox(mailbox) {
    var url = config.GetIncidentDetailsMailbox;
    var data = JSON.stringify({
        mailbox: mailbox,
        employeeID: lsUser.UserID,
        currentPage: 1,
        lang: lsUser.inslang
    });

    FetchService('post', url, data, true, function (r) {
        debugger;
        var h = '';
        var res_ = r.ResponseData;
        console.log(res_);
        // sentItem = ss.JSON.stringify(res_);totalItem_inbox
        ss.setItem(mailbox, JSON.stringify(res_));
        $('.totalItem_' + mailbox).html(" - " + res_.length);

        if (res_.length === 0) {
            $('div.list-group.' + mailbox).html(h);
        } else {
            $.each(res_, function (i, res) {
                var bgRed = Util.CalcBusinessDays(new Date(Date.parse(res.IncidentDate)), new Date()) > 5 ? 'bg-red' : 'bg-grey';
                var v = res.Audit_Workflow[res.Audit_Workflow.length - 1];

                var status = lsUser.inslang === 'ar' ? v.StatusNameAr : v.StatusNameEn;

                h += '<a href="javascript:void(0);" class="list-group-item " data-id="' + res.ID + '"  data-mailbox="' + mailbox + '" onclick="GetIncidentForm(this)">\
                     <h6 class="list-group-item-heading" style="color: rgba(0, 0, 0, 0.68);">' + v.Report_From_Name + '</h6>\
                     <h6 class="list-group-item-heading" style="color: rgba(0, 0, 0, 0.68);">' + res.IncidentNo + ' &#183 ' + res.IncidentTitle + '</h6>\
                     <p class="list-group-item-text">\
                     <p class="label ' + v.StatusColor + '">' + status + '</p>';

                h += '<span class="label ' + bgRed + '">  ' + Util.getDateForTextbox(res.IncidentDate) + '  </span>\
                </a>';
                // })
                $('div.list-group.' + mailbox).html(h);
                trans();
            });
        }
        if (typeof params == "object") {
            if (lsUser.RoleID == InspectorRoles.DepartmentStaff) {
                GetIncidentForm({ dataset: { id: params.id, mailbox: 'inbox_incident' } });
            } else {
                GetIncidentForm({ dataset: { id: params.id, mailbox: 'sent_incident' } });
            }
        }
    });
}
function getRiskLevel() {
    FetchService("get", config.getRiskLevel + "?id=0", null, false, function (r, xhr) {
        lsUser.getRiskLevel = JSON.stringify(r);
    });
}
function getReplyOption() {
    FetchService("get", config.getReplyOption + "?id=0", null, false, function (r, xhr) {
        lsUser.getReplyOption = JSON.stringify(r);
    });
}
function GetIncidentForm(e) {
    Util.ScrollTopAnimated();
    debugger;
    var mailbox = e.dataset.mailbox;
    $('.list-group-item').removeClass('active');
    $(e).addClass('active');
    $('div[id^=divInsForm]').html('');
    var divPage = $('#divInsForm_' + mailbox);
    var ID = e.dataset.id;
    $('a[data-id="' + ID + '"]').addClass('active');
    var data = JSON.parse(ss.getItem(mailbox));
    data = Util.findInJSONObject(data, { ID: ID })[0];
    GetDetail_Incidents(divPage, ID, mailbox, data);
    // var inspectorName = data.Inspector_Name === null ? "" : data.Inspector_Name; 

}
function onChange_dd_EmployeeList_inbox(e) {
    var selEst = e.selectedOptions["0"].value;
    if (selEst != "0") {
        $('#SendByDeptHead').show();
        $('#ReturnByDeptHead').hide();
    }
    else {
        $('#SendByDeptHead').hide();
        $('#ReturnByDeptHead').show();
    }
}


function DeleteFollowUp(e) {
    debugger;
    var mailbox = e.dataset.mailbox;
    var btnValue = e.value;
    var comments = $('#commentsID_' + mailbox).val();
    var IncidentID = e.dataset.id;
    if (comments === "") {
        swal('', Util.getTrans('_finalComments'), 'warning'); return false;
    }
    swal({
        title: Util.getTrans('_delete'),
        text: Util.getTrans('_areYouSureDelete'),
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#DD6B55",
        confirmButtonText: Util.getTrans('_yes'),
        cancelButtonText: Util.getTrans('_no'),
        closeOnConfirm: true,
        closeOnCancel: true
    }, function (isConfirm) {
        if (isConfirm) {
            MoveWorklfow(IncidentID, btnValue, comments, mailbox);
            Util.ScrollTopAnimated();
        }
        else {
            return false;
        }
    });
}

function SubmitFollowUp(e) {
    debugger;
    var mailbox = e.dataset.mailbox;
    var btnValue = e.value;
    var comments = $('#commentsID_' + mailbox).val();
    var IncidentID = e.dataset.id;
    if (comments === "") {
        swal('', Util.getTrans('_finalComments'), 'warning'); return false;
    }
    if (btnValue === "SendIt"  ) {
        if ($('#dd_EmployeeList_' + mailbox).val() === "0") {
            swal('', Util.getTrans('_requiredField'), 'warning'); return false;
        }
    }

    if ((lsUser.RoleID == EmployeeRole.Department_Staff && btnValue == "CompleteIt")
        || (lsUser.RoleID == EmployeeRole.Department_Head && btnValue == "ApproveIt")) {
        var isvalidate = false;
        if ($('#Reason').val() == '' || $('#ResponseToCustomer').val() == '' || $('#ObservationAfterStudy').val() == ''
            || $('#ddRiskLevel').val() == '0' || $('#ddReplyOption').val() == '0') {
            isvalidate = true;
        }
        if (lsUser.DeptID == Departments.Environmental_Audit_Section) {
            if (!Envrionment_Data.CommSubject.Validate() || !Envrionment_Data.CommFrequency.Validate() ||
                !Envrionment_Data.CommTime.Validate() || !Envrionment_Data.AuthorContacted.Validate()) {
                isvalidate = true;
            }
        } else if (lsUser.DeptID == Departments.Fisheries_Audit_Section) {
            if (!Fisheries_Data.Validate()) {
                isvalidate = true;
            }
        }
        if (isvalidate) {
            swal('', Util.getTrans('_requiredField'), 'warning'); return false;
        }
        SubmitInspectorResponse(IncidentID, btnValue, comments, mailbox);
    }
    else {
        MoveWorklfow(IncidentID, btnValue, comments, mailbox);
    }

}

function MoveWorklfow(IncidentID, btnValue, comments, mailbox) {
    var data = JSON.stringify({
        AuditServiceID: 0,
        IncidentID: IncidentID,
        ButtonAction: btnValue,
        Report_To_ID: $('#dd_EmployeeList_' + mailbox).css('display') !== undefined ? $('#dd_EmployeeList_' + mailbox).val() : 0,
        Comments: comments,
        user: {
            UserID: lsUser.UserID,
            RoleID: lsUser.RoleID
        }
    });

    FetchService('post', config.AddAuditsWorkFlow, data, true, function (r) {
        if (r.IsSuccess) {
            swal(Util.getTrans('_success'), Util.getTrans('_successDone'), 'success');
            $('div[id^=divInsForm]').html('');
            $('.list-group-item.active').hide();
        } else {
            swal(Util.getTrans('_error'), Util.getTrans('_errorMsg'), 'error');
            return false;
        }

    }, true);
}

function SubmitInspectorResponse(IncidentID, btnValue, comments, mailbox) {

    var d = JSON.stringify({
        ID: IncidentID,
        InspectorID: lsUser.UserID,
        Reason: $('#Reason').val(),
        ObservationAfterStudy: $('#ObservationAfterStudy').val(),
        ResponseToCustomer: $('#ResponseToCustomer').val(),
        RiskLevelID: $('#ddRiskLevel').val(),
        ReplyOptionID: $('#ddReplyOption').val(),
        EnvBalagh: Envrionment_Data.GetEnvBalaghData(),
        IsEnvBalagh: Object.keys(envBalaghData).length > 0 && envBalaghData.constructor === Object,
        IsFishBalagh: Object.keys(fishBalaghData).length > 0 && fishBalaghData.constructor === Object,
        FishBalagh: Fisheries_Data.GetFishBalaghData(),
        GPSPoints: lat + "," + lng,
    });
    FetchService('post', config.UpdateIncidentInpectorResponse, d, false, function (r) {
        if (r.IsSuccess) {
            MoveWorklfow(IncidentID, btnValue, comments, mailbox);
            // swal(Util.getTrans('_success'), Util.getTrans('_successDone'), 'success');
        } else {
            swal(Util.getTrans('_error'), Util.getTrans('_errorMsg'), 'error');
        }
    }, true);
}

