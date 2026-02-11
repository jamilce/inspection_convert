function getInfo() {
    return "mailbox";
}
var totalItem = 0;
var mailboxType;
var selectedVal;
var isTeamPlayer = false;
var isAudit = 0;
var currentPage_inbox = 1;
var currentPage_sent = 1;
var ButtonValue = {
    CompleteIt: "CompleteIt",
    SendIt: "SendIt",
    ReturnIt: "ReturnIt",
    ApproveIt: "ApproveIt",
    FreezeEstablishment: "FreezeEstablishment"
};
function onLoad() {
    //debugger;
    $.get(routes.mailbox, function (data) {

        $('#mainSection').html(data);

        $('.totalItem_inbox').html(" - " + Global.InboxCount);

        if (lsUser.RoleID != EmployeeRole.Directors && lsUser.RoleID != EmployeeRole.Admin) {
            getMailbox('inbox', currentPage_inbox);
            // getMailboxCount();
        } else {
            $('#inboxOnClick').hide();
            $('#_inboxText').removeClass('active in');
            $('#_sentItem').addClass('active in');
            $('#sentOnClick').addClass('active');
            //app.LoadEmployee('dd_EmployeeList', config.getEmployee, {}, Util.getTrans('_employees'));
            //app.LoadDropdown('dd_EstablishmentTypeID', config.getEstablishmentType + selectedVal + "/" + isAudit, null, true, Util.getTrans('_establishment'));
        }
        //$("#inboxClick").one("click", function () {
        //    getMailbox('inbox');
        //});
        $("#sentOnClick").one("click", function () {
            getMailbox('sent', currentPage_sent);
        });
        //$("#pendingOnClick").one("click", function () {
        //    getMailbox('pending');
        //});
        //$("#completedOnClick").one("click", function () {
        //    getMailbox('completed');
        //}); 
        Util.updateFromToDates();
        SearchPop.InitSearch();
        pleaseWait(false);
    });
}
function Add2LocalStore(mailbox, data, currPage) {

    if (currPage > 1) {
        var d = JSON.parse(ss[mailbox]);
        data.forEach(function (v) {
            d.push(v);
        });
        ss.setItem(mailbox, JSON.stringify(d));
    }
    else {
        ss.setItem(mailbox, JSON.stringify(data));
    }
}
function getImages(mailbox) {
    getControl('imageControl', 'ImageControl' + mailbox, function (script, textStatus) {
        $('#ImageControl_' + mailbox).html(script);
        setTimeout(function () {
            trans();
        }, 50);
    });
}

function getMailbox(mailbox, curPage) {
    // debugger;
    var url = config.GetAuditDetailsMailbox;
    var data = JSON.stringify({
        mailbox: mailbox,
        employeeID: lsUser.UserID,
        currentPage: curPage,
        lang: lsUser.inslang,
        DepartmentID: lsUser.DeptID
    });

    FetchService('post', url, data, true, function (r) {
        //debugger;
        var res_ = r.ResponseData;
        console.log(res_);

        Inbox_Markup(res_, mailbox, r.TotalItems);
    });
}

function GeteEstabType(res) {
    if (res.MarketTypeID != '2') {
        return res.MarketTypeID == MarketType.FishMarket ? Util.getTrans('_fishMarket') :
            res.MarketTypeID == MarketType.FishBoat ? Util.getTrans('_fishBoats') : '';
    }
    return lsUser.inslang === 'ar' ? res.EstablishmentType_NameAr : res.EstablishmentType_NameEn;;
}

function Inbox_Markup(res_, mailbox, totalPages) {
    var h = '';
    totalItem += res_.length;
    var cp = mailbox == "inbox" ? currentPage_inbox : currentPage_sent;
    Add2LocalStore(mailbox, res_, cp);

    if (res_.length == 0) {
        $('div.list-group.' + mailbox).html(h);
        return false;
    }
    else if (currentPage_inbox == 1) {
        $('div.list-group.' + mailbox).html(h);
    }
    $.each(res_, function (_i, res) {
        h = '';
        var bgRed = MarkLateAudits(res);
        var audityTypeColor = res.AuditType_ID == AuditType.inspection ? "bg-orange" : res.AuditType_ID == AuditType.taqeem ? 'bg-light-blue' : 'bg-light-green'
        //console.log(daycal);
        var estbType = GeteEstabType(res);
        var est = lsUser.inslang === 'ar' ? res.Establishment_NameAr : res.Establishment_NameEn;
        var v = res.Audit_Workflow[res.Audit_Workflow.length - 1];

        var status = lsUser.inslang === 'ar' ? v.StatusNameAr : v.StatusNameEn;

        if (lsUser.DeptID == Departments.Environmental_Audit_Section && mailbox != "inbox" && res.AuditType_ID == AuditType.audit) {
            h += '';
        } else { 
            var unreadColor = !v.isRead && mailbox === 'inbox' ? 'unreadInbox' : '';
            h += '<a href="javascript:void(0);" style=""  class="list-group-item ' + unreadColor + '" data-id="' + res.ID + '"  data-mailbox="' + mailbox +
                '" onclick="GetInpsectionForm(this)">\
                     <h6 class="list-group-item-heading" style="color: rgba(0, 0, 0, 0.68);">' + est + '</h6>\
                     <h6 class="list-group-item-heading" style="color: rgba(0, 0, 0, 0.68);">' + estbType + ' &#183 ' + res.EmirateName + '</h6>\
                     <p class="label bg-grey">' + res.Ref_No + ' </p>\
                     <p style="font-size: 7px;" class="label ' + v.StatusColor + '">' + status + '</p>';

            if (res.Audit_TeamPlayer.length > 0) {
                h += ' <p class="label bg-green"> <span data-tran="TeamMember"> </span> </p>';
            }
            h += '\
                     <p class="label '+ bgRed + '">  ' + Util.getDateForTextbox(res.ExpectedDateTime_Start) + '  </p>\
                     <p style="font-size: 7px;" class="label ' + audityTypeColor + '">' + res.InspectionTypeAr + '</p>\
                    </a>';
        }

        $('div.list-group.' + mailbox).append(h);

        trans();
        pleaseWait(false);
    });
    $('.totalItem_' + mailbox).html(" - " + totalItem);
    //ItemCountDashboard.ShowHideBadge('.mailboxNumberClass', count);


    if (totalPages > 1) {
        $('.LoadMore_' + mailbox).show();
    }
    if (totalPages == currentPage_inbox) {
        $('.LoadMore_' + mailbox).hide();
    }

}
function LoadMoreInbox(mailbox) {
    pleaseWait(true);
    if (mailbox == "inbox") {
        currentPage_inbox = currentPage_inbox + 1;
        getMailbox(mailbox, currentPage_inbox);
    } else {
        currentPage_sent = currentPage_sent + 1;
        getMailbox(mailbox, currentPage_sent);
    }
}
function MarkLateAudits(res) {
    var daycal = Util.CalcBusinessDays(new Date(Date.parse(res.ExpectedDateTime_Start)), new Date());
    if (daycal > 10 && res.DeptID != Departments.Environmental_Audit_Section && res.Inspector_ID === null) {
        return 'bg-red';
    }
    else if (daycal > 1 && res.DeptID == Departments.Environmental_Audit_Section && res.Inspector_ID === null) {
        return 'bg-red';
    }
    return 'bg-grey';
}

function ReadMailboxItem(WorkflowID) {
    FetchService('post', config.ReadMailbox, JSON.stringify({ ID: WorkflowID }), true, function () {
        $('.list-group-item.active').removeClass('unreadInbox');
    });
}

function GetParent_Service(ServiceID) {
    FetchService('post', config.GetAuditService, JSON.stringify({ ID: ServiceID }), true, function (r) {
        console.log(r);
        var data = r.ResponseData[0];
        $('#PreviousReport').html('&nbsp;&nbsp;&nbsp;\
                <a href="javascript:void(0)"  data-deptid="'+ data.DeptID + '" data-establismenttypeid="' + data.EstablishmentType_ID + '" data-isfishmarket="' + data.MarketTypeID + '" data-audittypeid="' + data.AuditType_ID + '" data-id="' + data.ID + '" \
                 data-isauditformdisable="true" data-inspectorid="' + data.Inspector_ID + '" onclick="getPopUp_InspectionData(this)"><i style="vertical-align: middle;" class="material-icons">chrome_reader_mode</i> <b><span >' + Util.getTrans('_previousReport') + '</span></b></a>');
    });
}

function GetInpsectionForm(e) {
    Util.ScrollTopAnimated();
    debugger;
    var mailbox = e.dataset.mailbox;
    var ID = e.dataset.id;
    $('.list-group-item').removeClass('active');
    $(e).addClass('active');
    $('div[id^=divInsForm]').html('');
    var divPage = $('#divInsForm_' + mailbox);
    var data = JSON.parse(ss.getItem(mailbox));
    data = Util.findInJSONObject(data, { ID: ID })[0];
    var auditType = lsUser.inslang === "ar" ? data.InspectionTypeAr : data.InspectionTypeEn;
    var pageHTML = AuditDetailAndWorkflow(ID, mailbox, data);

    Global.EstablishmentTypeID = data.EstablishmentType_ID;
    var assignStatus = [1, 2, 9]; //assign,pending,returned;
    var IsAssginToMe = data.Audit_Workflow[0].Report_To_ID == lsUser.UserID ||
        assignStatus.indexOf(data.Audit_Workflow[data.Audit_Workflow.length - 1].Status_TypeID) > -1 ? data.Audit_Workflow[data.Audit_Workflow.length - 1].Report_To_ID == lsUser.UserID : false;

    pageHTML += ' <div id="ImageControl_' + mailbox + '" class="card"></div>';

    if (mailbox == 'inbox' && !data.Audit_Workflow[data.Audit_Workflow.length - 1].isRead) {
        ReadMailboxItem(data.Audit_Workflow[data.Audit_Workflow.length - 1].ID);
    }
    if (data.PreviousAuditServiceID != null) {
        setTimeout(function () {
            GetParent_Service(data.PreviousAuditServiceID);
        }, 1000);
    }
    if (lsUser.RoleID != EmployeeRole.Department_Staff && mailbox == 'inbox') {
        pageHTML += '<div class="">\
                        <div class="card">\
                            <div class="body">\
                                <div class="row clearfix">\
                                    <div class="col-md-12">\
                                        <div class="input-group">\
                                            <span class="input-group-addon">\
                                                <i class="material-icons">person</i><span class="pl-red"> *</span>\
                                            </span>\
                                            <div class="form-line">\
                                                <select onchange="onChange_dd_EmployeeList_inbox(this)" id="dd_EmployeeList_' + mailbox + '" name="ToID" class="form-control chzn-select"></select>\
                                            </div>\
                                        </div>\
                                    </div>\
                                </div>\
                            </div>\
                        </div>\
                     </div>';
        setTimeout(function () {
            app.LoadEmployee('dd_EmployeeList_' + mailbox, config.getEmployee, null, Util.getTrans('_employees'));
        }, 200);
    }
    pageHTML += '<div class="" id="btnGroups_' + mailbox + '">\
    <div class="card">\
        <div class="body">\
            <div class="row clearfix">';


    if (mailbox == 'inbox' && (!isHelper(data) || lsUser.RoleID != EmployeeRole.Department_Staff)) {
        pageHTML += '<div class="col-md-12">\
                    <div class="input-group">\
                        <span class="input-group-addon">\
                            <i class="material-icons">comment</i>\
                        </span>';
        //if (lsUser.RoleID == EmployeeRole.Department_Staff || (data.Audit_Workflow.filter(x => x.Status_TypeID === 3).length > 0)) {
        pageHTML += ' <div class="form-group">\
                            <label for="chkbox_FreezeCompany" data-mailbox="' + mailbox + '"  onclick="onChange_chkbox_FreezeCompany(this)">' + Util.getTrans('_freezeCompany') + '</label>\
                            <input type="checkbox"  name="chkbox_FreezeCompany" style="position: unset !important;opacity:unset" id="chkbox_FreezeCompany" class="filled-in chk-col-brown">\
                        </div>';
        // }
        pageHTML += '<div class="form-line">\
                            <textarea id="commentsID_' + mailbox + '" name="Comments" class="form-control no-resize" rows="4" data-tran="_comment"></textarea>\
                        </div>\
                        <span id="error_comment" style="color:red"></span>\
                    </div>\
                </div>\
                <div class="col-md-12 col-sm-12">\
                    <div class="input-group">\
                        <div class="">';
        if (lsUser.RoleID != EmployeeRole.Department_Staff) {
            pageHTML += '<button class="btn bg-orange waves-effect" style="display:none" id="SendByDeptHead" data-mailbox="' + mailbox + '"  data-id="' + data.ID + '" type="button" name="SendIt" value="SendIt" onclick="SubmitFollowUp(this)">\
                                <span data-tran="_sendIt"></span>\
                            </button>&nbsp;';
            if (data.Inspector_Name != null && data.Inspector_Name != '') {
                pageHTML += '<button class="btn bg-light-green waves-effect" data-mailbox="' + mailbox + '" data-id="' + data.ID + '"  type="button" name="ApproveIt" value="ApproveIt" onclick="SubmitFollowUp(this)">\
                                <span data-tran="_approved"></span>\
                            </button>&nbsp;';
            }
            if (data.AuditType_ID != AuditType.inspection && data.Audit_Workflow[data.Audit_Workflow.length - 1].Report_From_ID != 41) {
                //hide return button for HOD in-case of inspection from e-services or ds.
                pageHTML += '<button class="btn bg-orange waves-effect" id="ReturnByDeptHead" data-mailbox="' + mailbox + '" data-id="' + data.ID + '"  type="button" name="ReturnIt" value="ReturnIt" id="ReturnIt" onclick="SubmitFollowUp(this)">\
                        <span data-tran="_return"></span>\
                    </button>&nbsp;';
            }
            if (data.ProcedureInstanceID == null || data.ProcedureInstanceID == 0)
                pageHTML += '<button class="btn bg-red waves-effect" data-mailbox="' + mailbox + '" data-id="' + data.ID + '"  type="button" name="DeleteIt" value="DeleteIt" id="DeleteIt" onclick="DeleteFollowUp(this)">\
                            <i class="material-icons" style="font-size: 15px;">close</i> <span data-tran="_delete"></span> \
                        </button>&nbsp;';
        }
        if (lsUser.RoleID == EmployeeRole.Department_Staff) {
            pageHTML += '<button class="btn bg-green waves-effect" data-mailbox="' + mailbox + '" data-id="' + data.ID + '"  type="button" name="CompleteIt" value="CompleteIt" id="CompleteIt" onclick="SubmitFollowUp(this)">\
                            <span data-tran="_completeIt"></span>\
                        </button>&nbsp;';
            if (data.Audit_Workflow[data.Audit_Workflow.length - 1].Report_From_ID != lsUser.UserID) {
                pageHTML += '<button class="btn bg-red waves-effect" id="ReturnByDeptHead" data-mailbox="' + mailbox + '" data-id="' + data.ID + '"  type="button" name="ReturnIt" value="ReturnIt" id="ReturnIt" onclick="SubmitFollowUp(this)">\
                        <span data-tran="_return"></span>\
                    </button>&nbsp;';
            }
            if ((data.PreviousAuditServiceID == null && data.ProcedureInstanceID == 0) && data.Audit_Workflow.length == 1 && data.Audit_Workflow[data.Audit_Workflow.length - 1].Report_From_ID == lsUser.UserID) {
                pageHTML += '<button class="btn bg-red waves-effect" data-mailbox="' + mailbox + '" data-id="' + data.ID + '"  type="button" name="DeleteIt" value="DeleteIt" id="DeleteIt" onclick="DeleteFollowUp(this)">\
                       <i class= "material-icons" style="font-size: 15px;">close</i> <span data-tran="_delete"></span> \
                    </button>&nbsp;';
            }
        }
        pageHTML += '<button class="btn bg-red waves-effect" style="display:none" id="closeEstablishmentBtn" data-mailbox="' + mailbox + '"  data-id="' + data.ID + '" type="button" name="CloseEstablishment" value="FreezeEstablishment" onclick="SubmitFollowUp(this)">\
                                <span data-tran="_close"></span>\
                            </button>&nbsp;';
        pageHTML += '<button class="btn bg-blue-grey waves-effect" type="button" name="inspectionList" id="inspectionListBtn" value="inspectionList"\
                    data-isassigntome="'+ IsAssginToMe + '" data-deptid = "' + data.DeptID + '" data-establismentid="' + data.Establishment_ID + '" data-establismenttypeid="' + data.EstablishmentType_ID + '" \
                    data-isfishmarket="'+ data.MarketTypeID + '"  data-TeamLeader="' + data.Audit_Workflow[0].Report_To_ID + '" data-AuditTypeID="' + data.AuditType_ID + '" data-id="' + data.ID + '" data-inspectorid="' + data.Inspector_ID + '"  onclick="getPopUp_InspectionData(this)">\
                     <span data-tran="_viewForm"></span>\
                </button>\
            </div>\
            </div>\
            </div>\
        </div>';
    }
    else {
        if (lsUser.RoleID != EmployeeRole.Department_Staff) {
            if (data.Audit_Workflow[data.Audit_Workflow.length - 1].Status_TypeID != 4 && (data.ProcedureInstanceID == null || data.ProcedureInstanceID == 0))//completed by HOD and this request is inspection and assigned form eservices.
                pageHTML += '<button class="btn bg-red waves-effect" data-mailbox="' + mailbox + '" data-id="' + data.ID + '"  type="button" name="DeleteIt" value="DeleteIt" id="DeleteIt" onclick="DeleteFollowUp(this)">\
                        <i class="material-icons">close</i> <span data-tran="_delete"></span> \
                    </button>&nbsp;';
        }
        pageHTML += '<button class="btn bg-blue-grey waves-effect" type="button" name="inspectionList" id="inspectionListBtn" value="inspectionList"\
                    data-isassigntome="'+ IsAssginToMe + '" data-deptid = "' + data.DeptID + '" data-establismentid="' + data.Establishment_ID + '"  data-establismenttypeid="' + data.EstablishmentType_ID + '" \
                    data-isfishmarket="'+ data.MarketTypeID + '"  data-TeamLeader="' + data.Audit_Workflow[0].Report_To_ID + '" data-AuditTypeID="' + data.AuditType_ID + '"  data-id="' + data.ID + '" data-inspectorid="' + data.Inspector_ID + '"  onclick="getPopUp_InspectionData(this)">\
                     <span data-tran="_viewForm"></span>\
                    </button>';
    }
    pageHTML += '</div>\
        </div>\
</div>';

    divPage.html(pageHTML);
    if (data.Audit_TeamPlayer.length > 0) {
        data.Audit_TeamPlayer.forEach(function (v) {
            if (v.EmployeeID == lsUser.UserID) {
                //$('#btnGroups_' + mailbox).remove();
                isTeamPlayer = true;
                return;
            }
        });
    }

    if (!Global.isAuditFormDisable) {
        if (data.Inspector_ID == lsUser.UserID) {
            Global.isAuditFormDisable = false;
        }
        else if (isTeamPlayer && data.MarketTypeID == 1) {
            Global.isAuditFormDisable = false;
        }
        else if (isTeamPlayer && data.MarketTypeID != 1) {
            Global.isAuditFormDisable = true;
        }
        else if (!IsAssginToMe) {
            Global.isAuditFormDisable = true;
        }
    }
    $('[data-toggle="tooltip"]').tooltip({ container: 'body' });

    if (data.Audit_Attachment.length > 0) {
        ss.ins_img = JSON.stringify(data.Audit_Attachment);
    }
    else {
        ss.removeItem('ins_img');
    }
    getImages(mailbox);

    trans();
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
function onChange_chkbox_FreezeCompany(e) {
    var mailbox = e.dataset.mailbox;
    var isCompanyFreeze = !$('#chkbox_FreezeCompany').prop('checked');

    if (isCompanyFreeze) {
        $('#inspectionListBtn').hide();
        $('#commentsID_' + mailbox).val(Util.getTrans('_freezeCompany'));
        if (lsUser.RoleID == EmployeeRole.Department_Head) {
            $('#closeEstablishmentBtn').show();
        }
    }
    else {
        $('#inspectionListBtn').show();
        $('#closeEstablishmentBtn').hide();
        $('#commentsID_' + mailbox).val('');
    }
}


function isHelper(data) {
    if (data.Audit_TeamPlayer.length > 0) {
        return Util.findInJSONObject(data.Audit_TeamPlayer, { "EmployeeID": lsUser.UserID }).length > 0;
    }
    return false;
}

function SubmitFollowUp(e) {
    debugger;
    var error = $('#error_comment');
    error.html('');
    var mailbox = e.dataset.mailbox;
    var btnValue = e.value;
    var AuditServiceID = e.dataset.id;
    var comments = $('#commentsID_' + mailbox).val();
    var isCompanyFreeze = $('#chkbox_FreezeCompany').prop('checked');

    //if (comments == "") {
    //    error.html(Util.getTrans('_finalComments')); return false;
    //    //swal('', Util.getTrans('_finalComments'), 'warning'); return false;
    //}

    if (btnValue == ButtonValue.SendIt) {
        if ($('#dd_EmployeeList_' + mailbox).val() === "0") {
            swal('', Util.getTrans('_requiredField'), 'warning');
            return false;
        }
    }
    else if (btnValue == ButtonValue.FreezeEstablishment) {
        if (!isCompanyFreeze && lsUser.RoleID != EmployeeRole.Department_Head) {
            return false;
        }
    }
    else if (btnValue == ButtonValue.ApproveIt) {
        if (lsUser.DeptID == Departments.Environmental_Audit_Section && lsUser.RoleID == EmployeeRole.Department_Head) {
            FetchService('post', config.ServiceEnableDisable, JSON.stringify({ ID: AuditServiceID, isEnable: true }), true, function (e) {
                if (e.IsSuccess) {
                    console.log('activated');
                }
            });
        }
    }
    else if (btnValue == ButtonValue.CompleteIt) {
        swal({
            title: Util.getTrans('_sendIt'),
            text: Util.getTrans('_areYouSureToSend'),
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: Util.getTrans('_yes'),
            cancelButtonText: Util.getTrans('_no'),
            closeOnConfirm: true,
            closeOnCancel: true
        }, function (isConfirm) {
            if (isConfirm) {
                MoveWorkFlow(AuditServiceID, btnValue, mailbox, comments);
                Util.ScrollTopAnimated();
            }
            else {
                return false;
            }
        });

        //FetchService('post', config.IsFormSubmitted, JSON.stringify({ AuditServiceID: AuditServiceID }), true, function (r) {
        //    if (r.IsSuccess) {
        //        MoveWorkFlow(AuditServiceID, btnValue, mailbox, comments);
        //    } else {
        //        swal(Util.getTrans('_completeFromToContinue'), Util.getTrans('_error'), 'error');
        //        return false;
        //    }
        //}, true);
        return false;
    }

    MoveWorkFlow(AuditServiceID, btnValue, mailbox, comments);
}

function DeleteFollowUp(e) {
    //debugger;
    var error = $('#error_comment');
    error.html('');
    var mailbox = e.dataset.mailbox;
    var btnValue = e.value;
    var AuditServiceID = e.dataset.id;
    var comments = $('#commentsID_' + mailbox).val();
    if (comments == "") {
        error.html(Util.getTrans('_finalComments')); return false;
        //swal('', Util.getTrans('_finalComments'), 'warning'); return false;
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
            MoveWorkFlow(AuditServiceID, btnValue, mailbox, comments);
            Util.ScrollTopAnimated();
        }
        else {
            return false;
        }
    });
}

function MoveWorkFlow(AuditServiceID, btnValue, mailbox, comments) {
    var data = JSON.stringify({
        AuditServiceID: AuditServiceID,
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
            $('div[id^=divInsForm]').html('');
            $('.list-group-item.active').hide();
            $('.totalItem_inbox').html('');
            swal(Util.getTrans('_success'), Util.getTrans('_successDone'), 'success');
        } else {
            swal(Util.getTrans('_error'), Util.getTrans('_errorMsg'), 'error');
            return false;
        }
    }, true);
}

function ShowMapPopUp2(e) {
    estbID = e.dataset.id;
    $('#ubody').html('');
    var html = '<div class="">\
                    <input id="pac-input" class="control" type="text" placeholder="Search Box">\
                    <div id="mapCanvas" class="gmap2 animated fadeInTop">\
                    </div>\
                </div>';
    $('#ubody').html(html);

    LoadMap();
    // getLocation();
    //  $('#model_showDeatil').modal('show');
    ShowModal('#model_showDeatil');
    $('.btnUpdateGPS').show();
    $('.btnUpdateGPS').attr('data-id', estbID);
}

function UpdateGPSEstablistment(e) {
    var id = e.dataset.id;
    if (parseInt(final_lat) == 0) {
        Util.Notification("Could not get location. Please make sure your browser GPS is enabled.");
    }
    var data = JSON.stringify({ ID: id, Lat_X: final_lat, Lng_Y: final_lng });
    FetchService('post', config.UpdateEstablishmentGPS, data, true, function (r) {
        if (r.IsSuccess) {
            console.log("update gps");
            $('.IconToUpdateGPS').hide();
            CloseModal('#model_showDeatil');

            swal(Util.getTrans('_success'), Util.getTrans('_GpsUpdated'), 'success');
        } else {
            swal(Util.getTrans('_error'), Util.getTrans('_errorMsg'), 'error');
        }
    });
}



function OpenPopupSearchInbox(mailbox) {
    mailboxType = mailbox;
    // $('#mdModalInboxSearch').modal('show');
    ShowModal('#mdModalInboxSearch');
}

var SearchPop = {
    InitSearch: function () {
        isAudit = lsUser.DeptID == Departments.Environmental_Audit_Section ? AuditType.taqeem : AuditType.audit;
        app.LoadDropdown('ddInspectionType', config.GetAuditType, null, true, Util.getTrans('_type'));
        // $('#ddInspectionType').val(isAudit);
        if (lsUser.DeptID != Departments.Environmental_Audit_Section) {
            $("#ddInspectionType option[value='3']").remove();
        }
        Util.updateDropDown('ddInspectionType');
        app.LoadDropdown('dd_EstablishmentTypeID', config.getEstablishmentType + lsUser.DeptID + "/" + isAudit, null, true, Util.getTrans('_establishment'));

        if (lsUser.RoleID == EmployeeRole.Department_Staff) {
            $('.ddEmployee').hide();
            $('.ddDepartment').hide();
        }
        else {
            app.LoadDropdown_Departments('ddDepartment', Util.getTrans('selectText'), Util.getTrans('_department'));
            app.LoadEmployee('ddEmployee', config.getEmployee, { DeptID: lsUser.DeptID }, Util.getTrans('_employees'));
        }
    },
    ChangeAuditOrInspection: function (e) {
        isAudit = e.selectedOptions["0"].value;

        setTimeout(function () {
            app.LoadDropdown('dd_EstablishmentTypeID', config.getEstablishmentType + lsUser.DeptID + "/" + isAudit, null, true, Util.getTrans('_establishment'));
        }, 50);
    },
    onchange_ddDepartment: function (e) {
        selectedVal = e.selectedOptions["0"].value;
        if (parseInt(selectedVal) > 0) {
            app.LoadDropdown('dd_EstablishmentTypeID', config.getEstablishmentType + selectedVal + "/" + isAudit, null, true, Util.getTrans('_establishment'));
            app.LoadEmployee('ddEmployee', config.getEmployee, { DeptID: selectedVal }, Util.getTrans('_employees'));
        }
    },
    MailBoxSearch: function () {
        debugger;
        var filter = {
            DeptID: jQuery("#ddDepartment option:selected").val() === undefined ? lsUser.DeptID : jQuery("#ddDepartment option:selected").val(),
            EstablishmentType_ID: jQuery("#dd_EstablishmentTypeID option:selected").val(),
            AuditType_ID: $('#ddInspectionType').val(),
            RefNo: $('#RefNo').val(),
            AuditType: $('#ddInspectionType').val(),
            EmployeeId: $('#ddEmployee').val()
        };

        var data = JSON.parse(ss.getItem(mailboxType));
        var data_filter = data.filter(function (r) {
            return (r.AuditType_ID == filter.AuditType || r.EstablishmentType_ID == filter.EstablishmentType_ID || r.Ref_No == filter.RefNo
                || r.Audit_Workflow[r.Audit_Workflow.length - 1].Report_From_ID == filter.EmployeeId
                || r.Audit_Workflow[r.Audit_Workflow.length - 1].Report_To_ID == filter.EmployeeId);
        });

        Inbox_Markup(data_filter, mailboxType);
        $('.resetSearch_' + mailboxType).show();

        CloseModal('#mdModalInboxSearch', true);

    },
    ResetSearch: function (mailbox) {
        var data = JSON.parse(ss.getItem(mailbox));
        Inbox_Markup(data, mailbox);
        $('.resetSearch_' + mailbox).hide();
    }
};


