function getInfo() {
    return "AddNewEmployee.html";
}
var userID = 0;
var selectedVal;

function onLoad() {
    $.get(routes.AddNewEmployee, function (data) {
        $('#mainSection').html(data);

        app.LoadDropdown_Departments('DeptID', Util.getTrans('selectText'), Util.getTrans('_department'));
        app.LoadDropdown('RoleID', config.GetRole, {}, true, Util.getTrans('_role'));

        if (ss.employeeId != null && ss.employeeId !== "null") {
            FetchService('post', config.getEmployee, JSON.stringify({ UserID: ss.employeeId }), false, function (r) {
                debugger;
                if (r.IsSuccess) {
                    var res = r.ResponseData[0];
                    if (res.RoleID == EmployeeRole.Department_Staff && isDualDepartmentHead()) {
                        //$('.ManagerID').show();
                        $('.DeptID').show();
                        //app.LoadDropdown('ManagerID', config.GetManagers + '/' + res.DeptID, {}, true, Util.getTrans('_reportingManager'), function () {
                        //    $('#ManagerID').val(res.ManagerID);
                        //    Util.updateDropDown('ManagerID');
                        //    console.log(res.ManagerID);
                        //}); 
                    }
                    if (res.RoleID == EmployeeRole.Department_Head) {
                        $('.DeptID').show();
                        //$('.ManagerID').hide();

                    }
                    $('#DeptID').val(res.DeptID);
                    $('#RoleID').val(res.RoleID);
                    $('#FullName').val(res.FullName);
                    $('#UserName').val(res.UserName);
                    $('#UserName').prop('disabled', true);
                    $('#JobTitle').val(res.JobTitle);
                    Util.updateDropDown('DeptID');
                    Util.updateDropDown('RoleID');
                    userID = res.UserID;
                    $('.btnAdd').html(Util.getTrans('_update'));

                } else {
                    swal(Util.getTrans('_error'), Util.getTrans('_errorMsg'), 'error');
                }
            }, true);
        }
        else if (isDualDepartmentHead() || lsUser.RoleID == EmployeeRole.Admin || lsUser.RoleID == EmployeeRole.Directors) {
            $('.DeptID').show();
        }

        if (lsUser.RoleID == EmployeeRole.Department_Head) {
            $('#RoleID').val(4);
            $('#RoleID').prop('disabled', true);
            Util.updateDropDown('RoleID');
        }
        pleaseWait(false);
    });
}
function onchange_RoleID(e) {
    var res = e.selectedOptions["0"].value;
    if (res == EmployeeRole.Department_Staff) {
        // $('.ManagerID').show();
        $('.DeptID').show();
    }
    else if (res == EmployeeRole.Department_Head) {
        $('.DeptID').show();
        // $('.ManagerID').hide();
    } else {
        // $('.ManagerID').hide();
        $('.DeptID').hide();
    }
}
function onchange_ddDepartment(e) {
    selectedVal = e.selectedOptions["0"].value;
    // app.LoadDropdown('ManagerID', config.GetManagers + '/' + selectedVal, {}, true, Util.getTrans('_reportingManager'));
    //  app.LoadEmployee('ddEmployee', config.getEmployee, { DeptID: selectedVal }, Util.getTrans('_employees'));
}

function Validate() {
    var ret = true;
    if ($('#DeptID').css('display') != "none") {
        if ($('#DeptID').val() === "0") {
            ret = false;
        }
    }
    //else if ($('#DeptID').css('display') != "none") {
    //    if ($('#ManagerID').val() === "0") {
    //        ret = false;
    //    }
    //}
    else if ($('#RoleID').val() === "0" || $('#FullName').val() == '' || $('#UserName').val() == '' || $('#JobTitle').val() == '') {
        ret = false;
    }
    if (!ret) {
        swal('', Util.getTrans('_requiredField'), 'warning');
        return false;
    }
    return true;
}

function AddNewEmployee() {
    var data = jQuery('#fromNewEmployee').serializeArray();
    data.push({ name: "UserID", value: userID });

    if (Validate()) {
        PostData(config.AddNewEmployee, data, PostSuccess);
    }
}

function PostSuccess(data) {
    pleaseWait(false);
    console.log(JSON.stringify(data));
    if (data.IsSuccess) {
        Util.ResetForm('fromNewEmployee');
        swal(Util.getTrans('_success'), Util.getTrans('_successDone'), 'success');
        window.location.href = '#views/admin/employeelist';
    } else {
        swal(Util.getTrans('_error'), Util.getTrans('_errorMsg'), 'error');
        return false;
    }
}