function getInfo() {
    return "employeelist";
}
var selectedVal;
function onLoad() {
    $.get(routes.employeelist, function (data) {

        $('#mainSection').html(data);
        ShowEmployeeList();
        ss.employeeId = null;
        pleaseWait(false);

    });
}

function ShowEmployeeList() {
    var row = [];
    pleaseWait(true);
    var deptId = [];
    if (isDualDepartmentHead()) {
        deptId = [2, 4];
    }
    else if (lsUser.RoleID != EmployeeRole.Admin && lsUser.RoleID != EmployeeRole.Directors) {
        deptId = [parseInt(lsUser.DeptID)];
    }
    var data = { DeptIDList: deptId }
    // var column = [Util.getTrans('_Name'), Util.getTrans('_email'), Util.getTrans('_department'), Util.getTrans('_role'),
    // Util.getTrans('_lastLoginDate'), Util.getTrans('_previliges')];
    var column = [
        { "name": "name", "title": Util.getTrans('_Name'), "breakpoints": "xs sm", "style": { "maxWidth": 230 } },
        { "name": "email", "title": Util.getTrans('_email')    },
        { "name": "dept", "title": Util.getTrans('_department') },
        { "name": "role", "title": Util.getTrans('_role'), "filterable": false },
        { "name": "LD", "title": Util.getTrans('_lastLoginDate'), "breakpoints": "xs sm md" },
        { "name": "pre", "title": Util.getTrans('_previliges'), "breakpoints": "xs sm md" },
        { "name": "action", "title": Util.getTrans('_action'), "breakpoints": "xs sm md" },
    ];
    FetchService('post', config.getEmployee, JSON.stringify(data), true, function (res) {
        if (res.IsSuccess && res.ResponseData.length > 0) {             
            var result = res.ResponseData;
            result = result.filter(function (x) {
                return lsUser.RoleID == EmployeeRole.Department_Head ? x.ManagerID != 0 : x;
            });
            $.each(result, function (i, v) {
                var dept = lsUser.inslang === "ar" ? v.DeptNameAr : v.DeptNameEn;
                row.push(
                    {
                        "name": v.FullName + " - " + v.UserName,
                        "email": v.Email,
                        "dept": dept,
                        "role": v.RoleName,
                        "LD": Util.getDateSQL(v.LastLoginDate),
                        "pre": '<a hre="javascript:void(0)" onclick="GetPrivliges(this)" data-name= "' + v.FullName + '" data-id="' + v.UserID + '">' + Util.getTrans('_previliges') + '</a>',
                        "action": '<a hre="javascript:void(0)" onclick="UpdateEmployee(this)"  data-id="' + v.UserID + '">' + Util.getTrans('_update') + '</a>'
                    });
            });
            $('.table').footable({
                "paging": {
                    "enabled": true
                },
                "filtering": {
                    "enabled": true,
                    "position": "center"
                },
                "sorting": {
                    "enabled": true
                },

                "columns": column,
                "rows": row,
                "empty": Util.getTrans('_noResultFound'),
            });
            FooTable.get('.table').pageSize(20);
            $(".footable-filtering-search input[type=text]").attr("placeholder", Util.getTrans('_search'));
            //var html = TableProp.MakeTable(column, row);
            //$('.table').html(html);
        }

    }, true);

}

function UpdateEmployee(e) {
    var EmpID = e.dataset.id;
    console.log(EmpID);
    ss.employeeId = EmpID;
    pleaseWait(true);
    window.location.href = "#views/admin/AddNewEmployee";
}


function GetPrivliges(e) {
    try {
        $('#mdModalChangePreviliges').modal('show');
        $('input:checkbox').removeAttr('checked');
        pleaseWait(true);
        var EmpID = e.dataset.id;
        var name = e.dataset.name;
        FetchService('post', config.GetEmployeePrivilege,
            JSON.stringify({ EmployeeID: EmpID }), true, function (res) {
                console.log(res);
                if (res.IsSuccess) {
                    console.log(res);
                    var data = res.ResponseData;
                    $('#chk_IsCreateAudits').prop('checked', data.IsCreateAudits);
                    $('#chk_IsCreateEstablisment').prop('checked', data.IsCreateEstablisment);
                    $('#chk_IsCreateGroupInspection').prop('checked', data.IsCreateGroupInspection);
                    $('#chk_IsCreateIncident').prop('checked', data.IsCreateIncident);
                    $('#chk_IsShowIncident').prop('checked', data.IsShowIncident);
                    $('#chk_IsShowReports').prop('checked', data.IsShowReports);
                    $('#chk_IsShowNotification').prop('checked', data.IsShowNotification);
                    $('#chk_IsShowInbox').prop('checked', data.IsShowInbox);
                    $('#chk_IsShowEmployeeList').prop('checked', data.IsShowEmployeeList);
                    $('#chk_IsUpdateInspectionForm').prop('checked', data.IsUpdateInspectionForm);
                    $('#chk_IsDashboard').prop('checked', data.IsDashboard);
                    $('.btnUpdatePrivliges').attr('data-id', EmpID);
                    $('#username').html(name);
                    pleaseWait(false);
                }
            });
    }
    catch (e) {
        console.log(e);
        pleaseWait(false);
    }
}

function UpdatePrivliges(e) {    
    var ID = e.dataset.id;
    var datatoSave = {
        EmployeeID: ID,
        IsCreateAudits: $('#chk_IsCreateAudits').prop('checked'),
        IsCreateEstablisment: $('#chk_IsCreateEstablisment').prop('checked'),
        IsCreateGroupInspection: $('#chk_IsCreateGroupInspection').prop('checked'),
        IsCreateIncident: $('#chk_IsCreateIncident').prop('checked'),
        IsShowIncident: $('#chk_IsShowIncident').prop('checked'),
        IsShowReports: $('#chk_IsShowReports').prop('checked'),
        IsShowNotification: $('#chk_IsShowNotification').prop('checked'),
        IsShowInbox: $('#chk_IsShowInbox').prop('checked'),
        IsShowEmployeeList: $('#chk_IsShowEmployeeList').prop('checked'),
        IsUpdateInspectionForm: $('#chk_IsUpdateInspectionForm').prop('checked'),
        IsDashboard: $('#chk_IsDashboard').prop('checked')
    };
    FetchService('post', config.SetEmployeePrivilege,
        JSON.stringify(datatoSave), true, function (res) {
            console.log(res);
            if (res.IsSuccess) {
                console.log(res);
                swal(Util.getTrans('_success'), Util.getTrans('_successDone'), 'success');
                CloseModal('#mdModalChangePreviliges');
            }
            else {
                swal(Util.getTrans('_error'), Util.getTrans('_errorMsg'), 'error');
            }
        }); 
}