function getInfo() {
    return "report.html";
}
var EstabTypeID_fish = 0;
var selectedVal;
var isAudit = 0;
var currentPage_inbox = 1;
var numbering = 0;
var pageSize = 20;
function onLoad() {

    $.get(routes.report, function (data) {
        pleaseWait(true);
        $('#mainSection').html(data);
        setTimeout(function () {
            AfterOnLoad();
            pleaseWait(false);
            trans();
        }, 10);
    });
}

function AfterOnLoad() {
    $('#team_ID_general').hide();
    $('.establish_local').hide();

    app.LoadDropdown('ddInspectionType', config.GetAuditType, null, true, Util.getTrans('_type'));
    app.LoadDropdown('ddStatus_Workflow', config.GetStatus_Workflow, null, true, Util.getTrans('_status'));
    $('#ddInspectionType').val(isAudit);
    $('#ddInspectionType').append($('<option></option>').val(10).html(Util.getTrans('_incident')));
    //$('#ddInspectionType').append($('<option></option>').val(11).html(Util.getTrans('_groupInspectionCampaign')));

    if (lsUser.DeptID != Departments.Environmental_Audit_Section) {
        if (lsUser.RoleID != InspectorRoles.Administrator && lsUser.RoleID != InspectorRoles.UnderSecretary) {
            $("#ddInspectionType option[value='3']").remove();
        }
    }
    Util.updateDropDown('ddInspectionType');

    //if (lsUser.DeptID == Departments.Fisheries_Audit_Section || lsUser.DeptID == Departments.Environmental_Audit_Section) {
    $('.ddEmirate').show();
    app.LoadDropdown_Emirates('ddEmirate', Util.getTrans('selectText'), Util.getTrans('_emirate'));
    //}
    if (lsUser.RoleID == EmployeeRole.Department_Staff) {
        //$('.ddEmployee').hide();
        $('.ddDepartment').hide();
        app.LoadEmployee('ddEmployee', config.getEmployee, { DeptID: lsUser.DeptID }, Util.getTrans('_employees'));
    }
    else {
        //$('.ddDepartment').hide();
        app.LoadDropdown_Departments('ddDepartment', Util.getTrans('selectText'), Util.getTrans('_department'));
        app.LoadEmployee('ddEmployee', config.getEmployee, { DeptID: lsUser.DeptID }, Util.getTrans('_employees'));
    }
    if (lsUser.DeptID == Departments.Fisheries_Audit_Section) {
        app.LoadDropdown_EstabType_fishiers('ddEstablishmentType', config.getEstablishmentType + lsUser.DeptID + "/" + isAudit, null, true, Util.getTrans('_establishmentType'));
    } else {
        app.LoadDropdown('ddEstablishmentType', config.getEstablishmentType + "/" + lsUser.DeptID + "/" + isAudit, null, true, Util.getTrans('_establishment'));
    }

    LoadDropDown_Select_Internal("dd_establish_ID");
    Util.updateFromToDates();
    hideShowDropdown();
    $('#chkTeamRequired_general').on('change', function () {
        //debugger;
        if ($(this).prop('checked')) {
            $('#team_ID_general').show();
            app.LoadEmployee('dd_EmployeeList_general_team', config.getEmployee, { DeptID: selectedVal }, Util.getTrans('_employees'));
            $("#dd_EmployeeList_general_team option[value='" + $('#ddEmployee').val() + "']").remove();
        }
        else {
            $('#team_ID_general').hide();
        }
    });
    app.LoadDropdown('ddRiskLevel', config.getRiskLevel + "?id=0", null, true, Util.getTrans('_riskLevel'));

    $('#dd_establish_local_ID').on('change', function () {
        var val = parseInt($('#ddEstablishmentType').val());
        if ((lsUser.DeptID == Departments.Fisheries_Audit_Section || selectedVal == Departments.Fisheries_Audit_Section) && val < 0)
            EstabTypeID_fish = ($(this).children('option:selected').data('esttypeid'));
    });
}
function ChangeAuditOrInspection(e) {
    isAudit = e.selectedOptions["0"].value;
    setTimeout(function () {
        if (!isBalaghReport(isAudit)) {
            if (lsUser.DeptID == Departments.Fisheries_Audit_Section) {
                app.LoadDropdown_EstabType_fishiers('ddEstablishmentType', config.getEstablishmentType + lsUser.DeptID + "/" + isAudit, null, true, Util.getTrans('_establishmentType'));
            } else {
                var typeId = isAudit;
                if (typeId == 4 || (lsUser.DeptID == Departments.Environmental_Audit_Section && typeId == 2)) {
                    typeId = 1;
                }
                app.LoadDropdown('ddEstablishmentType', config.getEstablishmentType + lsUser.DeptID + "/" + typeId, null, true, Util.getTrans('_establishment'));
            }
        }
    }, 20);
}
function isBalaghReport(id) {
    if (id == 10 ) // balagh
    {        
        $('.ddEstablishmentType').hide();
        $('.dd_establish_local_ID').hide();
        $('#txtRefno').attr('placeholder', 'e.g:123456');
        $('.txtIncidentTitle').show();
        return true;
    }
    else
    {
        $('.ddEstablishmentType').show();
        $('.dd_establish_local_ID').show();
        $('.txtIncidentTitle').hide();
        $('#txtRefno').attr('placeholder', 'e.g:EAS-2007102');
        return false;
    }
}
function onchange_ddEmirate(e) {
    var emirateID = typeof (e) == "string" || e == null ? e : e.selectedOptions["0"].value;
    var ddEstTypeID = $('#ddEstablishmentType').val();
    if (emirateID != "0" && e != null) {
        if (selectedVal == Departments.Environmental_Audit_Section || selectedVal == Departments.Fisheries_Audit_Section) {
            var data = { "EstablishmentTypeID": ddEstTypeID, EmirateId: emirateID };
            if (selectedVal == Departments.Environmental_Audit_Section) {
                data.EstablishmentTypeID = EnvTaqeemToAuditMapping(ddEstTypeID);
            }

            if (lsUser.DeptID == Departments.Fisheries_Audit_Section && parseInt(ddEstTypeID) < 0) {
                data = { MarketType: FishiersMarkets_Mapping(ddEstTypeID), EmirateId: emirateID }
                app.LoadEstablishment_Fisheries('dd_establish_local_ID', config.GetEstablishment_Fisheries, data, Util.getTrans('_establishment'));
            } else {
                app.LoadEstablishment('dd_establish_local_ID', config.GetEstablisment, data, Util.getTrans('_establishment'));
            }
        }
    }
}
function onchange_ddDepartment(e) {
    pleaseWait(true);
    selectedVal = e.selectedOptions["0"].value;
    app.LoadDropdown('ddEstablishmentType', config.getEstablishmentType + selectedVal + "/" + isAudit, null, true, Util.getTrans('_establishment'));
    app.LoadEmployee('ddEmployee', config.getEmployee, { DeptID: selectedVal }, Util.getTrans('_employees'));
    if ($('#chkTeamRequired_general').prop('checked')) {
        app.LoadEmployee('dd_EmployeeList_general_team', config.getEmployee, { DeptID: selectedVal }, Util.getTrans('_employees'));
    }
    if (selectedVal == Departments.Fisheries_Audit_Section || selectedVal == Departments.Environmental_Audit_Section) {
        $(".establish_eservice").hide();
        $('#dd_establish_ID').hide();
        $('.establish_local').show();
    }
    else {
        $(".establish_eservice").show();
        $('#dd_establish_ID').show();
        $('.establish_local').hide();
    }
    pleaseWait(false);
}
function hideShowDropdown() {
    selectedVal = selectedVal === undefined ? lsUser.DeptID : selectedVal;
    if ((selectedVal == Departments.Fisheries_Audit_Section || selectedVal == Departments.Environmental_Audit_Section)
        || (lsUser.DeptID == Departments.Fisheries_Audit_Section || lsUser.DeptID == Departments.Environmental_Audit_Section && lsUser.RoleID === EmployeeRole.Department_Staff)) {
        $(".establish_eservice").hide();
        $('#dd_establish_ID').hide();
        $('.establish_local').show();
    }
    else {
        $(".establish_eservice").show();
        $('#dd_establish_ID').show();
        $('.establish_local').hide();
    }
}
function onchange_ddEstbType(e) {
    var selEst = e.selectedOptions["0"].value;
    var EmirateID = $('#ddEmirate').val();
    if (EmirateID != "0") {
        onchange_ddEmirate($('#ddEmirate').val());
    }
}
function GetFishMarket_Type() {
    var val = $('#ddEstablishmentType').val();
    if (val < 0 && lsUser.DeptID == Departments.Fisheries_Audit_Section) {
        return FishiersMarkets_Mapping(val);
    }
    return 0;
}
function EnvTaqeemToAuditMapping(EstablimentTypeID) {
    EstablimentTypeID = parseInt(EstablimentTypeID);
    // convert taqeem to audits.
    var arr_1 = [11, 12]; //Taqeem
    var arr_2 = [63, 64]; //Audits 
    if (arr_2.indexOf(EstablimentTypeID) > -1) {
        return arr_1[arr_2.indexOf(EstablimentTypeID)];
    }
    return EstablimentTypeID;
}

//audits Reports
function getData(pg, pageSize) {
    var deptID = [];
    if (jQuery("#ddDepartment option:selected").val() === undefined || jQuery("#ddDepartment option:selected").val() == "0") {
        if (lsUser.RoleID == EmployeeRole.Department_Staff) {
            deptID = [parseInt(lsUser.DeptID)];
        }
        else if (isDualDepartmentHead()) {
            deptID = [2, 4];
        }
        else if (lsUser.RoleID == EmployeeRole.Directors) {
            deptID = [1, 2, 3, 4];
        }
        else {
            deptID = [parseInt(lsUser.DeptID)];
        }
    }
    else {
        deptID = [parseInt(jQuery("#ddDepartment option:selected").val())];
    }
    return {
        DeptID: deptID,
        employeeID: jQuery("#ddEmployee option:selected").val() === undefined ? 0 : jQuery("#ddEmployee option:selected").val(),
        EstablishmentID: $(".establish_local").css('display') == "block" ? $("#dd_establish_local_ID").val() : $('#dd_establish_ID').val(),
        EstablishmentTypeID: jQuery("#ddEstablishmentType option:selected").val() === undefined ? 0 : GetEstablihsmentType_ID(),//jQuery("#ddEstablishmentType option:selected").val(),
        ExpectedDateTime_Start: $('#FromDateTime_gi').val(),
        ExpectedDateTime_End: $('#ToDateTime_gi').val(),
        currentPage: pg,
        pageSize: pageSize,
        Refno: $('#txtRefno').val(),
        AuditTypeID: isAudit,
        RiskLevel: jQuery("#ddRiskLevel option:selected").val() === undefined ? 0 : jQuery("#ddRiskLevel option:selected").val(),
        Status_wf: $('#ddStatus_Workflow').val(),
        MarketType: GetFishMarket_Type(),
        EmiratesID: $('#ddEmirate').val(),
    };
}
function SearchReport() {
    $('.table').html('');
    numbering = 0;
    if (parseInt($('#ddInspectionType').val()) != 10) {
        ss.removeItem('reports');
        var data = getData(1, pageSize);
        MakeReport(data);
    }
    else {
        ss.removeItem('reports_Incidents');
        SearchReport_Incident();
    }
}
function LoadMore() {
    currentPage_inbox = currentPage_inbox + 1;
    var data = getData(currentPage_inbox, pageSize);
    MakeReport(data);
}
function MakeReport(data) {
    debugger;
    pleaseWait(true);
    FetchService('post', config.SearchReport, JSON.stringify(data), true, ReportSuccess, true);
}
function ReportSuccess(res) {
    $('.totalRows').show();
    $('#totalRows').html(res.TotalItems);
    var prevStore = ss.reports != null ? JSON.parse(ss.reports).concat(res.ResponseData) : res.ResponseData;
    ss.reports = JSON.stringify(prevStore);
    var row = [];
    var column = [
        { data: '#', style: "" },
        { data: Util.getTrans('_inspector'), style: "" },
        { data: Util.getTrans('_establishment'), style: "" },
        { data: Util.getTrans('_establishmentType'), style: "" },
        { data: Util.getTrans('_status'), style: "" },
        { data: Util.getTrans('_riskLevel'), style: "width:12%" },
        { data: Util.getTrans('_requestDate'), style: "width:10%" },
        { data: Util.getTrans('_issueDate'), style: "width:10%" },
        { data: Util.getTrans('_headApprovalDate'), style: "width:8%" },
        { data: Util.getTrans('_detial'), style: "width:8%" }
    ];

    if (res.IsSuccess && res.ResponseData.length > 0) {
        $('.LoadMore').show();
        console.log(res.ResponseData);
        $.each(res.ResponseData, function (i, v) {

            var teamplayer = v.Audit_TeamPlayer.length > 0 ? "(" + Util.getTrans('TeamMember') + ")" : "";
            var AssignInspector = v.Audit_Workflow.length == 0 ? '' : v.Audit_Workflow[v.Audit_Workflow.length - 1].Report_To_Name;
            var InspectorName = v.Inspector_ID === null ? AssignInspector : v.Inspector_Name;
            var ShowPendingIcon = v.Inspector_ID === null ? '<i ' + Util.ToolTipLabel('_inProgress') + ' class="material-icons" style="color: orange;vertical-align: middle;">hourglass_empty</i> ' : "";
            var ShowCompletedIcon = v.Inspector_ID !== null ? '<i ' + Util.ToolTipLabel('_completedTask') + ' class="material-icons" style="color: green;vertical-align: middle;">done_all</i> ' : "";

            var daycal = Util.CalcBusinessDays(new Date(Date.parse(v.ExpectedDateTime_Start)), new Date());
            var bgRed = daycal > 10 && v.Inspector_ID === null ? 'bkg-red' : '';
            var status = v.Audit_Workflow.length > 0 ? Util.Localize(v.Audit_Workflow[v.Audit_Workflow.length - 1].StatusNameAr, v.Audit_Workflow[v.Audit_Workflow.length - 1].StatusNameEn) : "";
            var statusColor = v.Audit_Workflow.length > 0 ? v.Audit_Workflow[v.Audit_Workflow.length - 1].StatusColor : "";
            var ShowReport = '<a href="javascript:void(0)" ' + Util.ToolTip(v.InspectionTypeAr) + ' data-deptid = "' + v.DeptID + '" data-establismenttypeid="' + v.EstablishmentType_ID + '" \
                             data-establishmentname="'+ v.Establishment_NameAr + '"  data-isfishmarket="' + v.MarketTypeID + '" data-audittypeid="' + v.AuditType_ID + '" data-id="' + v.ID + '" data-isauditformdisable="' + true + '" data-inspectorid="' + v.Inspector_ID + '" onclick="getPopUp_InspectionData(this)"><i class="material-icons">chrome_reader_mode</i> </a>';
            row.push(
                [
                    ++numbering,
                    InspectorName + teamplayer,
                    '<span class="badge " >' + v.Ref_No + '</span>' + "  <span class='labelBlock'><a href='javascript: void (0)' onclick='getEstablimentData(" + v.Establishment_ID + ")'>" + v.Establishment_NameAr + '</a></span>',

                    `<span class="labelBlock">${v.EstablishmentType_NameAr}</span>   <span class=' '>${v.InspectionTypeAr}</span> - <span class=''>${v.EmirateName}</span>
                         - <span class=''><a target="_blank" href="https://www.google.com/maps?daddr=${v.Establishment_GPS}"> 
                            <img src="images/google-maps.png" width="12" />\
                                     </a >  </span>`,

                    '<span class="label ' + statusColor + ' " >' + status + '</span>',


                    getRiskLevel(v),
                    '<span class="' + bgRed + '" ' + Util.ToolTipLabel(bgRed == '' ? '' : '_delayed10Days') + '>' + Util.getDateForTextbox(v.ExpectedDateTime_Start) + '</span>' + ShowPendingIcon,
                    v.Inspector_ID !== null ? '<span class="' + bgRed + '"  ' + Util.ToolTip(Util.getDateForTextbox(v.SubmissionDate)) + '>' + Util.getDateForTextbox(v.SubmissionDate) + '</span>' + ShowCompletedIcon : "",
                    v.Audit_Workflow.find(x => x.Status_TypeID === 4) !== null ? "" : '<span>' + Util.getDateForTextbox(v.CreatedDate) + '</span>',

                    //'<span class="' + bgRed + '" ' + Util.ToolTip(Util.getDateForTextbox(v.ExpectedDateTime_Start)) + '>' + Util.DaysLeft(v.ExpectedDateTime_Start) + '</span>'
                    //: '<span class="' + bgRed + '"  ' + Util.ToolTip(Util.getDateForTextbox(v.SubmissionDate)) + '>' + Util.timeAgo(v.SubmissionDate) + '</span>',

                    '' + ShowReport + '\
                    <a href="javascript:void(0)" ' + Util.ToolTipLabel('_detial') + ' data-id="' + v.ID + '" onclick="ShowAuditDetail(this)"><i class="material-icons">remove_from_queue</i> </a>   '

                ]);
        });
        var html = res.CurrentPage === 1 ? TableProp.MakeTable(column, row) : TableProp.Rows(row);
        res.CurrentPage === 1 ? $('.table').html(html) : $('.tbody').append(html);
        if (res.TotalPages == 1) {
            $('.LoadMore').hide();
        }
        $('[data-toggle="tooltip"]').tooltip({ container: '#mainSection', html: true });
    } else {
        $('.LoadMore').hide();
    }

}

function getRiskLevel(v) {
    var RisklevelName = RisklevelStatus_name(v);
    var riskcolor = v.RiskColor == null ? '#d0a870' : v.RiskColor;
    var ifTaqeem = v.AuditType_ID == AuditType.taqeem && v.Rating != null ? 'padding: 5px;font-size: 8px;color:white !important;background-color:' + Util.GetGradeColor(v.Rating.trim()) : 'background:' + riskcolor + ';padding: 5px;color: white;font-size: 8px;';
    var Rating = v.AuditType_ID == AuditType.taqeem && v.Rating != null ? v.Rating : '';
    var comments_auto = v.Auto_Remarks == null ? "" : '<div>' + v.Auto_Remarks + '</div>';

    return '<span  ' + Util.ToolTip(comments_auto) + '  style="' + ifTaqeem + '">' + RisklevelName + ' - ' + Rating + '</span>'

}
//end audits Reports


//Incident Reports
function getData_Incidents(pg, pageSize) {
    var deptID = [];
    if (jQuery("#ddDepartment option:selected").val() === undefined || jQuery("#ddDepartment option:selected").val() == "0") {
        if (lsUser.RoleID == EmployeeRole.Department_Staff) {
            deptID = [parseInt(lsUser.DeptID)];
        }
        else if (isDualDepartmentHead()) {
            deptID = [2, 4];
        }
        else if (lsUser.RoleID == EmployeeRole.Directors) {
            deptID = [1, 2, 3, 4];
        }
        else {
            deptID = [parseInt(lsUser.DeptID)];
        }
    }
    else {
        deptID = [parseInt(jQuery("#ddDepartment option:selected").val())];
    }
    return {
        DeptID: deptID,
        employeeID: jQuery("#ddEmployee option:selected").val() === undefined ? 0 : jQuery("#ddEmployee option:selected").val(),
        ExpectedDateTime_Start: $('#FromDateTime_gi').val(),
        ExpectedDateTime_End: $('#ToDateTime_gi').val(),
        currentPage: pg,
        pageSize: pageSize,
        Refno: $('#txtRefno').val(),
        AuditTypeID: isAudit,
        RiskLevel: jQuery("#ddRiskLevel option:selected").val() === undefined ? 0 : jQuery("#ddRiskLevel option:selected").val(),
        Status_wf: $('#ddStatus_Workflow').val(),
        EmiratesID: $('#ddEmirate').val(),
        title: $('#txtIncidentTitle').val()
    };
}
function SearchReport_Incident() {
    var data = getData_Incidents(1, pageSize);
    MakeReport_Incident(data);
}
function LoadMore_Incident() {
    currentPage_inbox = currentPage_inbox + 1;
    var data = getData_Incidents(currentPage_inbox, pageSize);
    MakeReport(data);
}
function MakeReport_Incident(data) {
    debugger;
    pleaseWait(true);
    FetchService('post', config.SearchReport_Incidents, JSON.stringify(data), true, ReportSuccess_Incident, true);
}
function ReportSuccess_Incident(res) {
    $('.totalRows').show();
    $('#totalRows').html(res.TotalItems);
    var prevStore = ss.reports_Incidents != null ? JSON.parse(ss.reports_Incidents).concat(res.ResponseData) : res.ResponseData;
    ss.reports_Incidents = JSON.stringify(prevStore);
    var row = [];
    var column = [
        { data: '#', style: "" },
        { data: Util.getTrans('_inspector'), style: "" },
        { data: Util.getTrans('_incidentTitle'), style: "" },
        { data: Util.getTrans('_location'), style: "" },
        { data: Util.getTrans('_status'), style: "" },
        { data: Util.getTrans('_riskLevel'), style: "width:12%" },
        { data: Util.getTrans('_date'), style: "width:15%" },
        { data: Util.getTrans('_detial'), style: "width:8%" }
    ];

    if (res.IsSuccess && res.ResponseData.length > 0) {
        $('.LoadMore').show();
        console.log(res.ResponseData);
        $.each(res.ResponseData, function (i, v) {

            var RisklevelName = v.RiskLevelName;
            var AssignInspector = v.Audit_Workflow.length == 0 ? '' : v.Audit_Workflow[v.Audit_Workflow.length - 1].Report_To_Name;
            var InspectorName = v.InspectorID === null ? AssignInspector : v.Inspector_Name;
            var ShowPendingIcon = v.InspectorID === null ? '<i ' + Util.ToolTipLabel('_inProgress') + ' class="material-icons" style="color: orange;vertical-align: middle;">hourglass_empty</i> ' : '<i ' + Util.ToolTipLabel('_completedTask') + ' class="material-icons" style="color: green;vertical-align: middle;">done_all</i> ';
            var daycal = Util.CalcBusinessDays(new Date(Date.parse(v.IncidentDate)), new Date());
            var bgRed = daycal > 10 && v.InspectorID === null ? 'bkg-red' : '';
            var comments_auto = v.ResponseToCustomer == null ? "" : '<div>' + v.ResponseToCustomer + '</div>';
            var status = v.Audit_Workflow.length > 0 ? Util.Localize(v.Audit_Workflow[v.Audit_Workflow.length - 1].StatusNameAr, v.Audit_Workflow[v.Audit_Workflow.length - 1].StatusNameEn) : "";
            var statusColor = v.Audit_Workflow.length > 0 ? v.Audit_Workflow[v.Audit_Workflow.length - 1].StatusColor : "";
            var riskcolor = v.RiskColor == null ? '#d0a870' : v.RiskColor;
            var ifTaqeem = 'background:' + riskcolor + ';padding: 5px;color: white;font-size: 8px;';

            var ShowReport = '';// '<a href="javascript:void(0)" onclick="getPopUp_IncidentReport(this)"><i class="material-icons">chrome_reader_mode</i> </a>';
            row.push(
                [
                    ++numbering,
                    InspectorName,
                    '<span class="badge " >' + v.IncidentNo + '</span>' + "   <span class='labelBlock'>" + v.IncidentTitle + '</span>',
                    '<span class="labelBlock">' + v.Location + "</span> ",
                    '<span class="label ' + statusColor + ' " >' + status + '</span>',
                    '<span  ' + Util.ToolTip(comments_auto) + 'style="' + ifTaqeem + '" >' + RisklevelName + '</span>',
                    v.ReplyDate === null ?
                        '<span class="' + bgRed + '" ' + Util.ToolTipLabel(bgRed == '' ? '' : '_delayed10Days') + '>' + Util.getDateForTextbox(v.IncidentDate) + '</span>' + ShowPendingIcon
                        : '<span class="' + bgRed + '"  ' + Util.ToolTip(Util.getDateForTextbox(v.SubmissionDate)) + '>' + Util.getDateForTextbox(v.ReplyDate) + '</span>' + ShowPendingIcon,

                    '' + ShowReport + '\
                    <a href="javascript:void(0)" ' + Util.ToolTipLabel('_detial') + ' data-id="' + v.ID + '" onclick="ShowIncidentDetail(this)"><i class="material-icons">remove_from_queue</i> </a>   '

                ]);
        });
        var html = res.CurrentPage === 1 ? TableProp.MakeTable(column, row) : TableProp.Rows(row);
        res.CurrentPage === 1 ? $('.table').html(html) : $('.tbody').append(html);
        if (res.TotalPages == 1) {
            $('.LoadMore').hide();
        }
        $('[data-toggle="tooltip"]').tooltip({ container: '#mainSection', html: true });
    } else {
        $('.LoadMore').hide();
    }

}
//end Incident Reports


function RisklevelStatus_name(v) {
    if (v.AuditType_ID == AuditType.inspection) {
        if (v.RiskLevel_ID == null)
            return "";
        return v.RiskLevel_ID == RiskLevelID.HighRisk ? Util.getTrans('_reject') : Util.getTrans('_aprove');
    } else {
        var rl = v.RiskLevel_NameAr === null ? "" : v.RiskLevel_NameAr;
        var pt = v.Total_Points === null ? "" : v.Total_Points;
        return rl + " - " + pt;
    }
}
function ShowAuditDetail(e) {
    var ID = e.dataset.id;
    var mailbox = 'reports';
    var data = JSON.parse(ss.getItem(mailbox));
    data = Util.findInJSONObject(data, { ID: ID })[0];
    var HtmlData = AuditDetailAndWorkflow(ID, mailbox, data);

    $('#body_AuditDetailList').html(HtmlData);
    trans();
    ShowModal('#mdModalAuditDetailList');
}
function ShowIncidentDetail(e) {
    var ID = e.dataset.id;
    var mailbox = 'reports';
    var data = JSON.parse(ss.reports_Incidents);
    data = Util.findInJSONObject(data, { ID: ID })[0];
    GetDetail_Incidents('#body_AuditDetailList', ID, mailbox, data);

    //  $('#body_AuditDetailList').html(HtmlData);
    trans();
    ShowModal('#mdModalAuditDetailList');

}


//excel and pdf reports management
function GetReportAllData(reportType) {
    var url = ''; var data;
    if (parseInt($('#ddInspectionType').val()) != 10) {
        url = config.SearchReport;
        data = getData(1, 0);
        GetReportDoc(reportType, false, url, data);
    }
    else {
        url = config.SearchReport_Incidents;
        data = getData_Incidents(1, 0);
        GetReportDoc(reportType, true, url, data);
    }
}
function GetReportDoc(reportType, isIncident, url, data) {

    FetchService('post', url, JSON.stringify(data), true, function (res) {
        if (res.IsSuccess && res.ResponseData.length > 0) {
            if (reportType == 'excel')
                if (isIncident) Export2ExcelSheet_incident(res.ResponseData);
                else Export2ExcelSheet(res.ResponseData);
            else if (reportType == 'pdf') {
                Export2Pdf(res.ResponseData);
            }
        }
    }, true);
}

function GetEstablihsmentType_ID() {
    var val = parseInt($('#ddEstablishmentType').val());
    if (lsUser.DeptID == Departments.Fisheries_Audit_Section && val < 0) {
        return EstabTypeID_fish;
    }
    return val;
}
function Export2ExcelSheet(xlsRows) {
    var data = [];
    /* XLS Head Columns */
    var xlsHeader = [Util.getTrans('_inspector'),
    Util.getTrans('_refNo'),
    Util.getTrans('_cordinates'),
    Util.getTrans('_establishment'),
    Util.getTrans('_establishmentType'),
    Util.getTrans('_type'),
    Util.getTrans('_emirate'),
    Util.getTrans('_status'),
    Util.getTrans('_riskLevel'),
    Util.getTrans('_issueDate'),
    Util.getTrans('_requestDate')];

    if (lsUser.DeptID == Departments.Environmental_Audit_Section)
        xlsHeader = [...xlsHeader.slice(0, 7), Util.getTrans('_detial'), ...xlsHeader.slice(7)];
    data.push(xlsHeader);
    $.each(xlsRows, function (index, value) {
        var innerRowData = [];
        var RisklevelName = RisklevelStatus_name(value);
        var AssignInspector = value.Audit_Workflow.length == 0 ? '' : value.Audit_Workflow[value.Audit_Workflow.length - 1].Report_To_Name;
        var InspectorName = value.Inspector_ID === null ? AssignInspector : value.Inspector_Name;
        var status = value.Audit_Workflow.length > 0 ? Util.Localize(value.Audit_Workflow[value.Audit_Workflow.length - 1].StatusNameAr, value.Audit_Workflow[value.Audit_Workflow.length - 1].StatusNameEn) : "";
        var date = value.SubmissionDate === null ? value.ExpectedDateTime_Start : value.SubmissionDate;
        var issueDate = value.ExpectedDateTime_End;
        var Rating = value.AuditType_ID == AuditType.taqeem && value.Rating != null ? ' - ' + value.Rating : '';
        var riskDetail = value?.Auto_Remarks?.replaceAll('<div>', '').replaceAll('</div>', ' - ');
        var val = [InspectorName,
            value.Ref_No,
            value.Establishment_NameAr.trim(),
            value.EstablishmentType_NameAr.trim(),
            value.InspectionTypeAr.trim(),
            value.EmirateName.trim(),
            status,
            RisklevelName + Rating,
            date,
            issueDate];

        if (lsUser.DeptID == Departments.Environmental_Audit_Section)
            val = [...val.slice(0, 7), riskDetail, ...val.slice(7)];


        $.each(val, function (ind, val) {
            innerRowData.push(val);
        });

        //innerRowData.push(val);
        data.push(innerRowData);
    });

    CreateExcelReport("Incident_Report", data);

}

function Export2ExcelSheet_incident(xlsRows) {

    var data = [];
    var xlsHeader = [Util.getTrans('_inspector'), Util.getTrans('_incidentTitle'),
        Util.getTrans('_location'), Util.getTrans('_status'), Util.getTrans('_riskLevel'), Util.getTrans('_date'), Util.getTrans('_studyResultText'),];
    if (lsUser.DeptID == Departments.Environmental_Audit_Section)
        xlsHeader = [...xlsHeader.slice(0, 5), Util.getTrans('_detial'), ...xlsHeader.slice(5)];

    data.push(xlsHeader);
    $.each(xlsRows, function (index, v) {
        var innerRowData = [];
        var RisklevelName = v.RiskLevelName;
        var AssignInspector = v.Audit_Workflow.length == 0 ? '' : v.Audit_Workflow[v.Audit_Workflow.length - 1].Report_To_Name;
        var InspectorName = v.InspectorID === null ? AssignInspector : v.Inspector_Name;
        var status = v.Audit_Workflow.length > 0 ? Util.Localize(v.Audit_Workflow[v.Audit_Workflow.length - 1].StatusNameAr, v.Audit_Workflow[v.Audit_Workflow.length - 1].StatusNameEn) : "";
        var date = v.ReplyDate == null ? Util.getDateForTextbox(v.IncidentDate) : Util.getDateForTextbox(v.ReplyDate)
        var riskDetail = v.Auto_Remarks != null ? v.Auto_Remarks.replaceAll('<div>', '').replaceAll('</div>', ' - ') : "";
        var val = [InspectorName, v.IncidentNo + '-' + v.IncidentTitle, v.Location, status, RisklevelName, date, v.ReplyOptionName];
        if (lsUser.DeptID == Departments.Environmental_Audit_Section)
            val = [...val.slice(0, 5), riskDetail, ...val.slice(5)];

        $.each(val, function (ind, val) {
            innerRowData.push(val);
        });
        data.push(innerRowData);
    });

    CreateExcelReport("Inspection_Report", data);

}

function CreateExcelReport(reportName, data) {
    console.log(data);
    if (typeof console !== 'undefined') console.log(new Date());
    var wb = XLSX.utils.book_new(),
        ws = XLSX.utils.aoa_to_sheet(data);
    XLSX.utils.book_append_sheet(wb, ws, reportName);

    if (typeof console !== 'undefined') console.log(new Date());
    XLSX.writeFile(wb, reportName + ".xlsx");
    if (typeof console !== 'undefined') console.log(new Date());
}


function Export2Pdf(xlsRows) {

    var customers = [];
    $.each(xlsRows, function (index, value) {
        var innerRowData = [];
        var RisklevelName = RisklevelStatus_name(value);
        var AssignInspector = value.Audit_Workflow.length == 0 ? '' : value.Audit_Workflow[value.Audit_Workflow.length - 1].Report_To_Name;
        var InspectorName = value.Inspector_ID === null ? AssignInspector : value.Inspector_Name;
        var status = value.Audit_Workflow.length > 0 ? Util.Localize(value.Audit_Workflow[value.Audit_Workflow.length - 1].StatusNameAr, value.Audit_Workflow[value.Audit_Workflow.length - 1].StatusNameEn) : "";
        var val = [InspectorName, value.Ref_No, value.Establishment_NameAr.trim(), value.EstablishmentType_NameAr.trim(),
            value.InspectionTypeAr.trim(), value.EmirateName.trim(), status, RisklevelName, value.ExpectedDateTime_Start];

        // innerRowData.push(val);
        //innerRowData.push(val);
        customers.push(val);
    });
    //Convert JSON to HTML Table.
    var table = document.createElement("TABLE");
    table.border = "1";
    table.Id = "tblInpsection";
    //Get the count of columns.
    var columnCount = customers[0].length;

    //Add the header row.
    var row = table.insertRow(-1);
    for (var i = 0; i < columnCount; i++) {
        var headerCell = document.createElement("TH");
        headerCell.innerHTML = customers[0][i];
        row.appendChild(headerCell);
    }
    //Add the data rows.
    for (var i = 1; i < customers.length; i++) {
        row = table.insertRow(-1);
        for (var j = 0; j < columnCount; j++) {
            var cell = row.insertCell(-1);
            cell.innerHTML = customers[i][j];
        }
    }
    //Append the Table to the HTML DIV.
    var dvTable = document.getElementById("dvTable");
    dvTable.innerHTML = "";
    dvTable.appendChild(table);

    //Convert Table to PDF.
    html2canvas(dvTable, {
        onrendered: function (canvas) {
            var data = canvas.toDataURL();
            var docDefinition = {
                content: [{
                    image: data,
                    width: 500
                }]
            };
            pdfMake.createPdf(docDefinition).download("Report.pdf");
            //Remove the Table.
            dvTable.innerHTML = "";
        }
    });
}
//end excel and pdf reports management


