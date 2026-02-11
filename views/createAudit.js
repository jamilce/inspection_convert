
function getInfo() {
    return "createAudit.html";
}
var selectedVal;
var isAudit = 0;
var commingInspection = null;
var EstabTypeID_fish = 0;

function onLoad() {
    $.get(routes.createAudit, function (data) {
        isAudit = lsUser.DeptID == Departments.Environmental_Audit_Section ? AuditType.taqeem : AuditType.audit;
        pleaseWait(true);
        $('#mainSection').html(data);
        setTimeout(function () {
            AfterOnLoad();
            trans();
            pleaseWait(false);
        }, 10);
    });
}

function AfterOnLoad() {
    $('#team_ID_general').hide();
    $('.establish_local').hide();
    $('.ddGroupInspection').hide();
    $(".chzn-select").attr('data-placeholder', lsUser.inslang === "ar" ? 'أختر' : 'Select an option');

    app.LoadDropdown('ddInspectionType', config.GetAuditType, null, true, Util.getTrans('_type'));
    //if (lsUser.DeptID == Departments.Fisheries_Audit_Section || lsUser.DeptID == Departments.Environmental_Audit_Section) {
    $('.ddEmirate').show();
    app.LoadDropdown_Emirates('ddEmirate', Util.getTrans('selectText'), Util.getTrans('_emirate'));
    // }
    $('#ddInspectionType').val(isAudit);
    if (lsUser.DeptID != Departments.Environmental_Audit_Section) {
        $("#ddInspectionType option[value='3']").remove();
    }
    Util.updateDropDown('ddInspectionType');

    if (lsUser.DeptID == Departments.Fisheries_Audit_Section) {
        app.LoadDropdown_EstabType_fishiers('ddEstablishmentType', config.getEstablishmentType + lsUser.DeptID + "/" + isAudit, null, true, Util.getTrans('_establishmentType'));
    } else {
        app.LoadDropdown('ddEstablishmentType', config.getEstablishmentType + lsUser.DeptID + "/" + isAudit, null, true, Util.getTrans('_establishmentType'));
    }
    if (lsUser.RoleID == EmployeeRole.Department_Staff) {
        $('.ddEmployee').hide();
        $('.ddDepartment').hide();
    }
    else {
        app.LoadDropdown_Departments('ddDepartment', Util.getTrans('selectText'), Util.getTrans('_department'));
        app.LoadEmployee('ddEmployee', config.getEmployee, { DeptID: lsUser.DeptID }, Util.getTrans('_employees'));
    }
    LoadDropDown_Select("dd_establish_ID");
    Util.updateFromToDates();
    hideShowDropdown();
    LoadMaps();
    $('#chkTeamRequired_general').on('change', function () {
        //debugger;
        selectedVal = selectedVal === undefined ? lsUser.DeptID : selectedVal;
        if ($(this).prop('checked')) {
            $('#team_ID_general').show();
            app.LoadEmployee('dd_EmployeeList_general_team', config.getEmployee, { DeptID: selectedVal }, Util.getTrans('_employees'),
                function () {
                    var empID = parseInt($('#ddEmployee').val()) > 0 ? $('#ddEmployee').val() : lsUser.UserID;
                    $("#dd_EmployeeList_general_team option[value='" + empID + "']").remove();
                    Util.updateDropDown('dd_EmployeeList_general_team');
                });
        }
        else {
            $('#team_ID_general').hide();
        }
    });
    $('#chkGroupInspection').on('change', function () {
        if ($(this).prop('checked')) {
            $('.ddGroupInspection').show();
            app.LoadDropdown('ddGroupInspection', config.GetGroupInspectionsLookup + "/" + lsUser.UserID, {}, true, Util.getTrans('_groupInspection'));
        }
        else {
            $('.ddGroupInspection').hide();
        }
    });
    $('#dd_establish_local_ID').on('change', function () {
        if (lsUser.DeptID == Departments.Fisheries_Audit_Section)
            EstabTypeID_fish = ($(this).children('option:selected').data('esttypeid'));
    });
}
function ChangeAuditOrInspection(e) {
    isAudit = e.selectedOptions["0"].value;
    var typeId = isAudit;
    if (typeId == 4 || (lsUser.DeptID == Departments.Environmental_Audit_Section && typeId == 2)) {
        typeId = 1;
    }
    if (typeId != AuditType.inspection) {  //inspection
        $('.TeamRequired').show();
    }
    else {
        $('.TeamRequired').hide();
    }

    setTimeout(function () {
        app.LoadDropdown('ddEstablishmentType', config.getEstablishmentType + lsUser.DeptID + "/" + typeId, null, true, Util.getTrans('_establishment'));
    }, 50);
}

function CreateNewAudit() {
    if (!form_validation()) {
        swal('', Util.getTrans('_requiredField'), 'warning');
        return false;
    }
    //debugger;
    if (lsUser.DeptID == Departments.Environmental_Audit_Section && isAudit == AuditType.taqeem) {
        //add taqeem only for dec and june
        var dt = new Date($('#FromDateTime_gi').val());
        if ((dt.getMonth() + 1) != 12 && (dt.getMonth() + 1) != 6) {
            swal(Util.getTrans('_error'), "Assesment/Taqeem Creation is only for Month of December and June", 'error');
            return false;
        }
    }
    var data = {
        DeptID: jQuery("#ddDepartment option:selected").val() === undefined ? lsUser.DeptID : jQuery("#ddDepartment option:selected").val(),
        FromEmp_ID: lsUser.UserID,
        ToEmp_ID: jQuery("#ddEmployee option:selected").val() === undefined ? lsUser.UserID : jQuery("#ddEmployee option:selected").val(),
        To_TeamID: $('#dd_EmployeeList_general_team').val(),
        Comments: $('#comments_ID_create').val(),
        Establishment_ID: getEstablishmentID(),
        EstablishmentType_ID: GetEstablihsmentType_ID(), //jQuery("#ddEstablishmentType option:selected").val(),
        ExpectedDateTime_Start: $('#FromDateTime_gi').val(),
        //ExpectedDateTime_End: $('#ToDateTime_gi').val(),
        AuditType_ID: $('#ddInspectionType').val(),
        GroupInspectionID: getGroupInspectionID(),
        isActive: true,
    };
    if (data.Establishment_ID != null && data.Establishment_ID != "") {
        FetchService('post', config.SetAuditsService, JSON.stringify(data), true, function (res) {
            console.log(res);
            if (res.IsSuccess) {
                Util.ResetForm('fromCreateAudit');
                AfterOnLoad();
                swal(Util.getTrans('_success'), Util.getTrans('_successDone'), 'success');
            }
            else if (!res.IsSuccess && res.ResponseData === "Already Exsit") {
                swal(Util.getTrans('_error'), Util.getTrans('_auditAlreadyExist'), 'error');
            }
            else {
                swal(Util.getTrans('_error'), Util.getTrans('_errorMsg'), 'error');
            }
        });
    } else {
        swal(Util.getTrans('_error'), Util.getTrans('_errorMsg'), 'error');
    }
    return false;
}

function onchange_ddDepartment(e) {
    selectedVal = e.selectedOptions["0"].value;
    if (parseInt(selectedVal) > 0) {
        app.LoadDropdown('ddEstablishmentType', config.getEstablishmentType + selectedVal + "/" + isAudit, null, true, Util.getTrans('_establishment'));
        app.LoadEmployee('ddEmployee', config.getEmployee, { DeptID: selectedVal }, Util.getTrans('_employees'));
        if ($('#chkTeamRequired_general').prop('checked')) {
            app.LoadEmployee('dd_EmployeeList_general_team', config.getEmployee, { DeptID: selectedVal }, Util.getTrans('_employees'), function () {
                var empID = parseInt($('#ddEmployee').val()) > 0 ? $('#ddEmployee').val() : lsUser.UserID;
                $("#dd_EmployeeList_general_team option[value='" + empID + "']").remove();
                Util.updateDropDown('dd_EmployeeList_general_team');
            });
        }
    }
    hideShowDropdown();
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
function onchange_ddEmirate(e) {
    var data;
    var emirateID = typeof (e) == "string" || e == null ? e : e.selectedOptions["0"].value;
    var ddEstTypeID = $('#ddEstablishmentType').val();
    if (emirateID != "0" && e != null) {
        if (selectedVal == Departments.Environmental_Audit_Section || selectedVal == Departments.Fisheries_Audit_Section) {
            data = { "EstablishmentTypeID": EnvTaqeemToAuditMapping(ddEstTypeID), EmirateId: emirateID };
            if (lsUser.DeptID == Departments.Fisheries_Audit_Section && parseInt(ddEstTypeID) < 0) {
                data = { MarketType: FishiersMarkets_Mapping(ddEstTypeID), EmirateId: emirateID }
                app.LoadEstablishment_Fisheries('dd_establish_local_ID', config.GetEstablishment_Fisheries, data, Util.getTrans('_establishment'));
            } else {
                app.LoadEstablishment('dd_establish_local_ID', config.GetEstablisment, data, Util.getTrans('_establishment'));
            }
        }
    }
}
function onchange_ddEstbType(e) {
    // pleaseWait(true);
    var selEst = e.selectedOptions["0"].value;
    //if (selectedVal == Departments.Environmental_Audit_Section) {
    selEst = EnvTaqeemToAuditMapping(selEst);
    //}
    onchange_ddEmirate($('#ddEmirate').val());
    // pleaseWait(false);
}
function onchange_dd_establish_local(e) {
    var selEst = e.selectedOptions["0"].value;
    GetUpcommingAudits_ByEstablishment(selEst);
}
function onChange_Employee(e) {
    var selEst = e.selectedOptions["0"].value;
    $("#dd_EmployeeList_general_team option[value='" + selEst + "']").remove();
    Util.updateDropDown('dd_EmployeeList_general_team');

}

function GetUpcommingAudits_ByEstablishment(estID) {
    FetchService('post', config.GetAuditDetailsMailbox,
        JSON.stringify({
            currentPage: 1,
            EstablishmentID: estID,
            EstablishmentTypeID: GetEstablihsmentType_ID(),//$('#ddEstablishmentType').val(),
            AuditTypeID: isAudit, DepartmentID: lsUser.DeptID,
            mailbox:"Upcomming"
        }),
        true, function (res) {
            console.log(res);
            if (res.IsSuccess) {
                commingInspection = res.ResponseData;
                var data = res.ResponseData;
                MakeListNextVisit(data);
            }
        });
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

function MakeListNextVisit(r) {
    if (r.length == 0) {
        $('.EstbCatName').html($("#ddEstablishmentType option:selected").text());
        $('.NextVisitHistory').html('');
        return false;
    }
    $('.EstbCatName').html($("#ddEstablishmentType option:selected").text() + ' - ' + Util.Localize(r[0].Establishment_NameAr, r[0].Establishment_NameEn));
    var html = '<table class="table table-responsive">';
    r.forEach(function (v) {
        var toName = v.Audit_Workflow.length == 0 ? '' : v.Audit_Workflow[v.Audit_Workflow.length - 1].Report_To_Name;
        var finalDate = v.Inspector_Name == "" ? v.ExpectedDateTime_Start : v.SubmissionDate;
        var changeDate = lsUser.RoleID == EmployeeRole.Department_Head ? "<a  class='changeDate' href='javascript:void(0)' data-id= " + v.ID + " onclick='getChangeDate(this)' ><i style='font-size: 16px!important' class='material-icons'>date_range</i>" + Util.getTrans('_changeDates') + "</a>" : "";
        var isTaskDone = v.Inspector_ID === null ? '<i ' + Util.ToolTipLabel('_inProgress') + ' class="material-icons" style="color: orange;">hourglass_empty</i>' : '<i ' + Util.ToolTipLabel('_completedTask') + ' class="material-icons" style="color: green;">done_all</i>';
        var showReport = v.Inspector_ID != null ? ' | <a href="javascript:void(0)"  data-deptid="' + v.DeptID + '" data-establismenttypeid="' + v.EstablishmentType_ID + '" data-isfishmarket="' + v.MarketTypeID + '" data-audittypeid="' + v.AuditType_ID + '" data-id="' + v.ID + '" \
                 data-isauditformdisable="true" data-inspectorid="' + v.Inspector_ID + '" onclick="getPopUp_InspectionData(this)"><i style="vertical-align: middle;" class="material-icons">chrome_reader_mode</i> </a>' : '';
        html += '<tr>\
                    <td><span>' + v.Ref_No + '</a></span> • <span>' + toName + '<span> • <span>' + v.EmirateName + '</span>\
                    </td>\
                     <td>'+ isTaskDone + '' + showReport + '</td>\
                    <td><span class="list-group-item-text " style="vertical-align: super;padding: 2px 8px;"><span class="change_date_'+ v.ID + '">' + Util.getDateForTextbox(finalDate) + '\
                         </span> <span style="vertical-align: middle;" class="change_date_days_'+ v.ID + '"></span>' + changeDate + '\
                    </td>\
                 </tr>';
        //html += '<div class="list-group-item  ">\
        //           <div class="">'+ v.Ref_No + '</div> \
        //            <h3 class="list-group-item-heading color-app">\
        //                <p style="vertical-align: super;padding: 2px 8px;"><i class="material-icons">business</i>' + Util.Localize(v.Establishment_NameAr, v.Establishment_NameEn) +
        //    '</p><span style="vertical-align: super;border-left: 1px solid #cac7c7;padding: 2px 8px;"><i class="material-icons">location_on</i>' + v.EmirateName + ' &#183 ' + Util.Localize(v.InspectionTypeAr, v.InspectionTypeEn) + '</span>' +
        //    '<span style="vertical-align: super;padding: 2px 8px;"> <i class="material-icons">person</i>' + toName + '<span></h3>\
        //            <span class="list-group-item-text " style="vertical-align: super;padding: 2px 8px;"><i class="material-icons">date_range</i><span class="change_date_'+ v.ID + '">' + Util.getDateForTextbox(v.ExpectedDateTime_Start) + '\
        //            </span> &#183 <span style="vertical-align: middle;" class="change_date_days_'+ v.ID + '">' + Util.DaysLeft(v.ExpectedDateTime_Start) + '</span>' + changeDate + '</div> ';


    });
    html += '</table>';
    $('.NextVisitHistory').html(html);
    $('[data-toggle="tooltip"]').tooltip({ container: '#mainSection', html: true });
}
function getChangeDate(e) {
    var ID = e.dataset.id;
    var data = Util.findInJSONObject(commingInspection, { ID: ID })[0];
    // $('#ubody_AuditDetail').html('');
    ShowModal('#mdModalChangeDates');
    $('#start_ChangeDate').val(Util.getDateForTextbox(data.ExpectedDateTime_Start));
    // $('#to_ChangeDate').val(Util.getDateForTextbox(data.ExpectedDateTime_End));
    $('.btnChangeDates').attr('data-id', ID);
}
function UpdateChangeDate(e) {
    var ID = e.dataset.id;
    FetchService('post', config.SetChangeDateAudit,
        JSON.stringify({
            ID: ID,
            ExpectedDateTime_Start: $('#start_ChangeDate').val(),
            //ExpectedDateTime_End: $('#to_ChangeDate').val()
        }), true, function (res) {
            console.log(res);
            if (res.IsSuccess) {
                console.log(res);
                $('.change_date_' + ID).html($('#start_ChangeDate').val());
                $('.change_date_days_' + ID).html(Util.DaysLeft($('#start_ChangeDate').val()));
            }
        });
}
//submit form
function GetEstablihsmentType_ID() {
    var val = $('#ddEstablishmentType').val();
    if (lsUser.DeptID == Departments.Fisheries_Audit_Section && val < 0) {
        return EstabTypeID_fish;
    }
    return val;
}
function getGroupInspectionID() {
    if ($(".ddGroupInspection").css('display') === "block") {
        return jQuery("#ddGroupInspection option:selected").val();
    } else {
        return null;
    }
}
function getEstablishmentID() {
    var estID = '';
    if ($(".establish_local").css('display') == "block") {
        return jQuery("#dd_establish_local_ID option:selected").val();
    }
    else {
        var d = JSON.parse(ls.est_data);
        if (parseInt(d.ID) > 0 && d.ID != null) {
            estID = d.ID;
        } else {
            d.EstablishmentTypeID = jQuery("#ddEstablishmentType option:selected").val();
            d.DeptID = MapDepts(selectedVal);
            FetchService("post", config.AddExternalEstablishment, JSON.stringify(d), false, function (r) {
                estID = r.ResponseData;
            });
        }
        return estID;
    }
    //return jQuery("#dd_establish_ID").val();
}

var form_validation = function () {
    if ($('#ddInspectionType').val() == "0") {
        return false;
    }
    if ($(".ddGroupInspection").css('display') == "block") {
        if (jQuery("#ddGroupInspection option:selected").val() == "0") {
            return false;
        }
    }
    if ($("#ddDepartment").css('display') == "block") {
        if (jQuery("#ddDepartment option:selected").val() == "0") {
            return false;
        }
    }
    if (jQuery("#ddEmployee option:selected").val() == "0") {
        return false;
    }
    if ($('#team_ID_general').css('display') == "block") {
        if (jQuery("#dd_EmployeeList_general_team").val() == "0") {
            return false;
        }
    }
    if (jQuery("#ddEstablishmentType").val() == "0") {
        return false;
    }
    //if (jQuery("#comments_ID_create").val().length <= 0) {
    //    return false;
    //}

    if ($(".establish_local").css('display') == "block") {
        if (jQuery("#dd_establish_local_ID").val() == "0") {
            return false;
        }
    }
    else if ($(".establish_eservice").css('display') == "block") {
        if (jQuery("#dd_establish_ID").val() == "" || jQuery("#dd_establish_ID").val() == "0") {
            return false;
        }
    }
    return true;
};
function GetInspectorLocationByList() {

    pleaseWait(true);
    ShowModal('#model_showDeatil');
    var url = '';
    $.get(url, function (data) {
        pleaseWait(false);
        config.ajaxloader = false;
        $('#ubody').html(data);
    });
}
function LoadMaps() {
    if (lsUser.RoleID == EmployeeRole.Department_Staff) {
        $('#gmap_markers').hide();
        return false;
    }
    var DeptID = (lsUser.RoleID == EmployeeRole.Admin || lsUser.RoleID == EmployeeRole.Directors) ? 0 : lsUser.DeptID;
    var map = new google.maps.Map(document.getElementById('gmap_markers'), {
        zoom: 10,
        center: new google.maps.LatLng(25.276987, 55.296249),
        //center: new google.maps.LatLng(getAvg_Xcord(resposelist), getAvg_Ycord(resposelist)),
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        mapId: googleMapId
    });

    var testUser = [7, 17, 19, 37];
    config.ajaxloader = true;
    FetchService('POST', config.GetInspectorLocation, JSON.stringify({ DeptID: DeptID }), true, function (resposelist) {

        resposelist = resposelist.ResponseData;
        resposelist = resposelist.filter(function (r) { return testUser.indexOf(r.employeeID) < 0; });
        ls.inspectorLocations = JSON.stringify(resposelist);
        var marker, i;

        if (resposelist.length > 0) {
            for (i = 0; i < resposelist.length; i++) {
                // console.log(_locations[i][0].xcord);
                var loc = resposelist[i];

                const icon = document.createElement('img');
                icon.src = 'images/persongps.png'; // Path to your icon image
                icon.width = 30; 
                icon.height = 30;  

                marker = new google.maps.marker.AdvancedMarkerElement({
                    position: new google.maps.LatLng(loc.cord_X, loc.cord_Y),
                   // center: new google.maps.LatLng(getAvg_Xcord(resposelist), getAvg_Ycord(resposelist)),
                    map: map,
                    content: icon 
                });

                var dept = lsUser.inslang === "ar" ? loc.DepartmentNameAr : loc.DepartmentNameEn;

                google.maps.event.addListener(marker, 'click', (function (marker, i) {
                    var infowindow = new google.maps.InfoWindow();
                    var html = '<table class="gmapTable table table-responsive">';
                    html += '<tr><td><strong>' + Util.getTrans('_Name') + '</strong></td>\
                    <td>' + loc.employeeName + '</td></tr>\
                    <tr><td><strong>' + Util.getTrans('_email') + '</strong></td>\
                    <td>' + loc.Email + '</td></tr>\
                    <tr><td><strong>' + Util.getTrans('_date') + '</strong></td>\
                    <td>' + Util.getDateSQL(loc.dateT) + '</td></tr>\
                     <tr><td><strong>' + Util.getTrans('_jobTitle') + '</strong></td>\
                    <td>' + loc.Jobtitle + '</td></tr>\
                     <tr><td><strong>' + Util.getTrans('_location') + '</strong></td>\
                    <td>' + loc.Location + '</td></tr>\
                    ';

                    //var html = '<div style="padding:15px"><strong style="color: #ad7d36;">' + loc.employeeName + '</strong><br>' +
                    //    '<strong>' + Util.getTrans('_department') + ': </strong>' + dept + '<br>' +
                    //    '<strong>' + Util.getTrans('_email') + ': </strong>' + loc.Email + '<br>' +
                    //    '<strong>' + Util.getTrans('_date') + ': </strong>' + Util.getDateSQL(loc.dateT) + '<br>' +
                    //    '<strong>' + Util.getTrans('_jobTitle') + ': </strong>' + loc.Jobtitle + '<br>' +
                    //    '<strong>' + Util.getTrans('_location') + ': </strong>' + loc.Location + '<br>' +
                    //    '</div>';
                    return function () {
                        infowindow.setContent(html);
                        infowindow.open(map, marker, html);
                        $('.gmapTable td').css({ 'padding': '2px 12px' });
                    };
                })(marker, i));
            }
        }
        else {
            //$('#gmap_markers').hide();
            // $('#gmap_markers').html(Util.getTrans('_noResultFound'));
        }

        config.ajaxloader = false;
        setTimeout(function () {
            GetUAEBounderies(map);
        }, 600);
    });


}
function getAvg_Xcord(elem) {

    var sum = 0.0;
    for (var i = 0; i < elem.length; i++) {
        sum += parseFloat(elem[i].cord_X, 10);
    }
    return sum / elem.length;
}
function getAvg_Ycord(elem) {

    var sum = 0.0;
    for (var i = 0; i < elem.length; i++) {
        sum += parseFloat(elem[i].cord_Y, 10);
    }
    return sum / elem.length;
}