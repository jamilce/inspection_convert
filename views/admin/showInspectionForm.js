function getInfo() {
    return "showInspectionForm";
}
var EstabTypeID_fish = 0;
var selectedVal = 1;
var isAudit = 1;
function onLoad() {
    $.get(routes.showInspectionForm, function (data) {
        $('#mainSection').html(data);

        app.LoadDropdown_Departments('ddDepartment', Util.getTrans('selectText'), Util.getTrans('_department'));

        pleaseWait(false);
    });
}

function ChangeAuditOrInspection(e) {
    setTimeout(function () {
        isAudit = e.checked ? 1 : 2;
        if (e.checked) {
            $('.TeamRequired').show();
        }
        else { //inspection
            $('.TeamRequired').hide();

        }
        $('.inspBtn').html('');
        if (selectedVal == Departments.Fisheries_Audit_Section) {
            app.LoadDropdown_EstabType_fishiers('ddEstablishmentType', config.getEstablishmentType + selectedVal + "/" + isAudit, null, true, Util.getTrans('_establishmentType'));
        } else {
            app.LoadDropdown('ddEstablishmentType', config.getEstablishmentType + "/" + selectedVal + "/" + isAudit, null, true, Util.getTrans('_establishment'));
        }
    }, 200);
}

function onchange_ddEstbType(e) {
    var selEst = e.selectedOptions["0"].value;
    var text = isAudit === 1 ? Util.getTrans("_audit") : Util.getTrans("_inspection");
    btnHtml = '<button class="btn bg-blue-grey waves-effect" type="button" name="inspectionList" value="inspectionList"\
                    data-deptid = "'+ selectedVal + '" data-establismenttypeid="' + GetEstablihsmentType_ID() + '" \
                    data-isauditformdisable="true"  data-isfishmarket="'+ GetFishMarket_Type() + '"  data-AuditTypeID="' + isAudit + '"  data-id="0"  \
                    data-inspectorid="0"  onclick="getPopUp_InspectionData(this)">\
                     <span data-tran="_view"></span> <span >'+ text + '</span>\
                </button>';
    $('.inspBtn').html(btnHtml);
    trans();

}
function onchange_ddDepartment(e) {
    debugger;
    selectedVal = parseInt(e.selectedOptions["0"].value);
    if (selectedVal == Departments.Fisheries_Audit_Section) {
        app.LoadDropdown_EstabType_fishiers('ddEstablishmentType', config.getEstablishmentType + selectedVal + "/" + isAudit, null, true, Util.getTrans('_establishmentType'));
    } else {
        app.LoadDropdown('ddEstablishmentType', config.getEstablishmentType + "/" + selectedVal + "/" + isAudit, null, true, Util.getTrans('_establishment'));
    }

    // app.LoadDropdown('ddEstablishmentType', config.getEstablishmentType + selectedVal + "/" + isAudit, null, true, Util.getTrans('_establishment'));
    //app.LoadEmployee('ddEmployee', config.getEmployee, { DeptID: selectedVal }, Util.getTrans('_employees'));
    if ($('#chkTeamRequired_general').prop('checked')) {
        app.LoadEmployee('dd_EmployeeList_general_team', config.getEmployee, { DeptID: selectedVal }, Util.getTrans('_employees'));
    }

    if (selectedVal === Departments.Fisheries_Audit_Section) {
        $(".establish_eservice").hide();
        $('#dd_establish_ID').hide();
        $('.establish_local').show();
    }
    else {
        $(".establish_eservice").show();
        $('#dd_establish_ID').show();
        $('.establish_local').hide();
    }
    $('.inspBtn').html('');
}
function GetFishMarket_Type() {
    var val = $('#ddEstablishmentType').val();
    if (val < 0 && selectedVal == Departments.Fisheries_Audit_Section) {
        return FishiersMarkets_Mapping(val);
    }
    return 0;
}
function GetEstablihsmentType_ID() {
    var val = parseInt($('#ddEstablishmentType').val());
    if (selectedVal == Departments.Fisheries_Audit_Section && val < 0) {
        return EstabTypeID_fish;
    }
    return val;
}