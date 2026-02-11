function getInfo() {
    return "groupInspection";
}
var update_id = 0;
var currentPage = 1;
function onLoad() {
    $.get("views/groupInspection.html", function (data) {
        $('#mainSection').html(data);
        var data1 = { DeptID: 0 };
        app.LoadDropdown_Emirates('ddEmirate', Util.getTrans('selectText'), Util.getTrans('_emirate'));
        app.LoadDropdown_Departments('ddDepartment', Util.getTrans('selectText'), Util.getTrans('_department'));
        app.LoadEmployee('dd_EmployeeList_general_team', config.getEmployee, data1, Util.getTrans('_employees'));
        setTimeout(SearchReport(), 1000);
        Util.updateFromToDates();
        pleaseWait(false);
    });
}
function AddGroupInspection() {
    var nameAr = $('#txtGroupInspectionName_Ar').val();
    var nameEn = $('#txtGroupInspectionName_En').val();
    var DeptID = parseInt(jQuery("#ddDepartment option:selected").val());
    var emirateID = parseInt(jQuery("#ddEmirate option:selected").val());
    var InspDate = $('#FromDateTime_gi').val();
    var EmployeeList = $('#dd_EmployeeList_general_team').val();
    var comments = $('#comments_ID').val();

    if (DeptID === 0 || nameAr === "" || emirateID === 0 || InspDate === "" || EmployeeList === null || comments === "") {
        swal('', Util.getTrans('_requiredField'), 'warning');
        return false;
    }
    var data = {
        NameAr: nameAr,
        NameEn: nameEn,
        EmirateID: emirateID,
        DeptID: DeptID,
        InspectionDate: InspDate,
        EmployeeList: EmployeeList,
        Comments: comments,
        ID: update_id
    };
    FetchService('post', config.SetGroupInspections, JSON.stringify(data), true, AddGroupInspectionSuccess, true);
}


function AddGroupInspectionSuccess(res) {
    console.log(res);
    if (res.IsSuccess && res.ResponseData === "OK") {
        swal(Util.getTrans('_success'), Util.getTrans('_successDone'), 'success');
        SearchReport();
        update_id = 0; //reset form.
    }
}
function getData(pg) {
    return {
       // EmiratesID: jQuery("#ddEmirate option:selected").val() === undefined ? null : jQuery("#ddDepartment option:selected").val(),
        //DeptID: lsUser.DeptID == 4 || lsUser.DeptID == 2 ? [2,4] : [lsUser.DeptID],
        //ExpectedDateTime_Start: $('#FromDateTime_gi').val(),
        //ExpectedDateTime_End: $('#ToDateTime_gi').val(),
        currentPage: pg,
    };
}
function SearchReport() {
    var data = getData(1);
    MakeReport(data);
}
function LoadMore() {
    currentPage = currentPage + 1;
    var data = getData(currentPage);
    MakeReport(data);
}
function MakeReport(data) {

    pleaseWait(true);

    FetchService('post', config.GetGroupInspections, JSON.stringify(data), true, ReportSuccess, true);
}
function ReportSuccess(res) {
    debugger;
    var row = [];
    var column = [{ data: Util.getTrans('_Name'), style: "" },
    { data: Util.getTrans('_emirate'), style: "" },
    { data: Util.getTrans('_team'), style: "" },
    { data: Util.getTrans('_detial'), style: "" },
    { data: Util.getTrans('_date'), style: "" },
    { data: Util.getTrans('_action'), style: "" }
    ];

    if (res.IsSuccess && res.ResponseData.length > 0) {
        res.totalPages > 1 ? $('.LoadMore').show() : $('.LoadMore').hide();
        console.log(res.ResponseData);
        $.each(res.ResponseData, function (i, v) {
            var employeeTeam = '';
            $.each(v.groupInspectionUserModel, function (i, v) {
                employeeTeam += v.InspectorName + ", ";
            });
            var comm = v.Comments === null ? '' : v.Comments.substr(0, 20);
            row.push(
                [
                    v.NameAr,
                    v.EmirateName,
                    employeeTeam,
                    '<span data-toggle="tooltip" data-placement="top" data-original-title="' + v.Comments + '" >' + comm + '</span>',
                    Util.getDateOnlySQL(v.InspectionDate),
                    '<a hre="javascript:void(0)" onclick="UpdateGroupInspection(this)" data-id="' + v.ID + '">' + Util.getTrans('_update') + '</a>',
                    //v.IsCompleted ? Util.getTrans('_status'):
                ]);
        });
        var html = res.CurrentPage === 1 ? TableProp.MakeTable(column, row) : TableProp.Rows(row);
        res.CurrentPage === 1 ? $('.table').html(html) : $('.tbody').append(html);

        $('[data-toggle="tooltip"]').tooltip({ container: '#mainSection', html: true });
    } else {
        $('.LoadMore').hide();
    }

}
function UpdateGroupInspection(e) {
    console.log(e.dataset.id);

    var data = { ID: e.dataset.id, currentPage: 1 };
    FetchService('post', config.GetGroupInspections, JSON.stringify(data), true, UpdateGroupInspectionSuccess, true);
    $('.btnCancelUpdate').show();
}
function CancelUpdate() {
    update_id = 0;
    $('#txtGroupInspectionName_Ar').val('');
    $('#txtGroupInspectionName_En').val('');
    $("#ddEmirate").val('0');
    $('#FromDateTime_gi').val('');
    $("#dd_EmployeeList_general_team").val('').trigger("chosen:updated");
    $('#comments_ID').val('');
    Util.updateDropDown('ddEmirate');
    $('.btnCancelUpdate').hide();
}

function UpdateGroupInspectionSuccess(res_) {
    var res = res_.ResponseData[0];
    var result = res.groupInspectionUserModel.map(function (val) {
        return val.InspectorID;
    }).join(',');
    var str_array = result.split(',');
    $("#dd_EmployeeList_general_team").val(str_array).trigger("chosen:updated");

    $('#txtGroupInspectionName_Ar').val(res.NameAr);
    $('#txtGroupInspectionName_En').val(res.NameEn);
    $('#FromDateTime_gi').val(Util.getDateForTextbox(res.InspectionDate));
    $('#comments_ID').val(res.Comments);
    $("#ddEmirate").val(res.EmirateID);
    Util.updateDropDown('ddEmirate');
    update_id = res.ID;
}