function getInfo() {
    return "createIncident.html";
}
var updateID = 0;
var selectedVal;
function onLoad() {
    $.get(routes.createIncident, function (data) {
        $('#mainSection').html(data);

        if (lsUser.RoleID != EmployeeRole.Department_Staff) {
            app.LoadDropdown_Departments('ddDepartment', Util.getTrans('selectText'), Util.getTrans('_department'));

            if (lsUser.RoleID == EmployeeRole.Department_Head) {
                if (!isDualDepartmentHead()) {
                    app.LoadEmployee('ddEmployee', config.getEmployee, { DeptID: lsUser.DeptID }, Util.getTrans('_employees'));
                }
            } else {
                $('.ddEmployee').hide();
            }

        } else {
            $('.ddEmployee').hide();
            $('.ddDepartment').hide();
        }
        Util.updateFromToDates();
        pleaseWait(false);
    });
}

function AddNewIncident(e) {
    var To_EmpID = 0;
    //if (lsUser.RoleID != EmployeeRole.CustomerService && lsUser.RoleID != EmployeeRole.Department_Head) {
    //    swal(Util.getTrans('_error'), Util.getTrans('_notAuthorizedPage'), 'error');
    //    return false;
    //}
    if ($('#txtReporterName').val() === "" || $('#txtMobileNo').val() === "" || $('#txtEmail').val() === "" || $('#txtReportSite').val() === ""
        || $('#ddDepartment').val() === "0" || $('#IncidentDate').val() === "" || $('#txtIncidentTitle').val() === ""
        || $('#txtIncidentNo').val() === "" ||   $('#comments_IncidentDescription').val() === "") {
        Util.Notification(Util.getTrans('_requiredField'), 'warning');
        return false;
    }
    if (lsUser.RoleID == EmployeeRole.Department_Head) {
        if ($('.ddEmployee').css('display') == "block") {
            if ($('#ddEmployee').val() == "0") {
                Util.Notification(Util.getTrans('_requiredField'), 'warning');
                return false;
            } else {
                To_EmpID = $('#ddEmployee').val();
            }
        }
    }
    else if (lsUser.RoleID == EmployeeRole.Department_Staff) {
        To_EmpID = lsUser.UserID;
    }

    pleaseWait(true);
    var data = jQuery('#fromCreateAudit_incident').serializeArray();
    data.push({ name: "ID", value: updateID });
    data.push({ name: "UserID", value: lsUser.UserID });
    data.push({ name: "RoleID", value: lsUser.RoleID });
    data.push({ name: "To_EmpID", value: To_EmpID });
    if (lsUser.RoleID == EmployeeRole.Department_Staff) {
        data.push({ name: "DeptID", value: lsUser.DeptID });
    }
   
    var url = config.SetNewIncident;
    PostData(url, data, function (data) {
        pleaseWait(false); 
        if (data.IsSuccess) {
            Util.ResetForm('fromCreateAudit_incident');
            window.location.href = '#views/incidentmail?id=' + data.ResponseData;
            // swal(Util.getTrans('_success'), Util.getTrans('_successDone'), 'success');
        } else {
            swal(Util.getTrans('_error'), Util.getTrans('_errorMsg'), 'error');
            return false;
        }
    });
}
function onchange_ddDepartment(e) {
    if (lsUser.RoleID == EmployeeRole.Department_Head) {
        selectedVal = e.selectedOptions["0"].value;
        if (parseInt(selectedVal) > 0) {
            app.LoadEmployee('ddEmployee', config.getEmployee, { DeptID: selectedVal }, Util.getTrans('_employees'));

        }
    }

}