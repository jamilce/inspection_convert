
var Main_Services_Api = {
    InspectionService: URL_MAIN + "api/Inspection/",
    AccountService: URL_MAIN + "Account/",
    EstablishmentService: URL_MAIN + "Establishment/",
    LookupService: URL_MAIN + "Lookup/",
    EmployeeService: URL_MAIN + "Employee/",
    AuditService: URL_MAIN + "AuditService/",
    DashboardService: URL_MAIN + "Dashboard/",
    JudicialSeizureService: URL_MAIN + "JudicialSeizure/",


    ex_audit_Username: "MOCCAEExternalAuditor",
    ex_audit_Passpword: "TTBDQ0BlMTYzNw==",

    ds_inspection_username: "GISDBAPI",
    ds_inspection_password: "R0lTREJfQVBJ",
};

var config = {
    InsertGPSLocationTime: 2 * 60 * 1000, // 2min
    ajaxloader: false,
    SentBackToDigitalService: true,
    devMode: true,
    Auth_eservices: "Basic " + btoa(Main_Services_Api.ex_audit_Username + ":" + Main_Services_Api.ex_audit_Passpword),
    Auth_DigitalService: "Basic " + btoa(Main_Services_Api.ds_inspection_username + ":" + Main_Services_Api.ds_inspection_password),

    isTokenValid: Main_Services_Api.AccountService + "isTokenValid",
    getToken: Main_Services_Api.AccountService + "getToken",

    GetEmployeeDashboard: Main_Services_Api.DashboardService + "GetEmployeeDashboard",
    GetServiceByAuditType: Main_Services_Api.DashboardService + "GetServiceByAuditType",
    GetServiceByRisklevel: Main_Services_Api.DashboardService + "GetServiceByRisklevel",
    GetInspectorsDetailCounts: Main_Services_Api.DashboardService + "GetInspectorsDetailCounts",
    GetEstablishmentVisitsInfo: Main_Services_Api.DashboardService + 'GetEstablishmentVisitsInfo',
    GetEstablishmentVisitsAndViolation: Main_Services_Api.DashboardService + "GetEstablishmentVisitsAndViolation",
    GetTotalItem_Dashboard: Main_Services_Api.DashboardService + "GetTotalItem_Dashboard",

    AddNewEstablisment: Main_Services_Api.EstablishmentService + "AddNewEstablisment",
    AddExternalEstablishment: Main_Services_Api.EstablishmentService + "AddExternalEstablishment",
    GetEstablisment: Main_Services_Api.EstablishmentService + "GetEstablisment",
    GetEstablisment_Eservices: Main_Services_Api.EstablishmentService + "GetEstablisment_Eservices",
    UpdateEstablishmentGPS: Main_Services_Api.EstablishmentService + "UpdateEstablishmentGPS",
    DeleteEstablisment: Main_Services_Api.EstablishmentService + "DeleteEstablisment",
    GetEstablishmentSearch: Main_Services_Api.EstablishmentService + "GetEstablishmentSearch",
    GetEstablishment_Fisheries: Main_Services_Api.EstablishmentService + "GetEstablishment_Fisheries",
    GetGoogleLocation: Main_Services_Api.EstablishmentService + "GetGoogleLocation",
    SubmitInspectionRequest_Eservice: Main_Services_Api.EstablishmentService + "SubmitInspectionRequest_Eservice",

    getEstablishmentType: Main_Services_Api.LookupService + "getEstablishmentType/",
    getDepartment: Main_Services_Api.LookupService + "getDepartment",
    getEmirate: Main_Services_Api.LookupService + "getEmirate",
    getRepeatVisit: Main_Services_Api.LookupService + "getRepeatVisit",
    getRiskLevel: Main_Services_Api.LookupService + "getRiskLevel",
    getReplyOption: Main_Services_Api.LookupService + "getReplyOption",
    GetRole: Main_Services_Api.LookupService + "GetRole",
    GetManagers: Main_Services_Api.LookupService + "GetManagers",
    GetAuditType: Main_Services_Api.LookupService + "GetAuditType",
    GetStatus_Workflow: Main_Services_Api.LookupService + "GetStatus_Workflow",
    InsertData_AuditDetail: Main_Services_Api.LookupService + "InsertData_AuditDetail",
    GetEstablishmentCordinate: Main_Services_Api.LookupService + "GetEstablishmentCordinate",
    //GetInspectionByDepartment: Main_Services_Api.LookupService + "GetInspectionByDepartment/",

    getEmployee: Main_Services_Api.EmployeeService + "GetEmployee",
    AddNewEmployee: Main_Services_Api.EmployeeService + "AddNewEmployee",
    SetEmployeePrivilege: Main_Services_Api.EmployeeService + "SetEmployeePrivilege",
    GetEmployeePrivilege: Main_Services_Api.EmployeeService + "GetEmployeePrivilege",
    SetInspectorLocation: Main_Services_Api.EmployeeService + "SetInspectorLocation",
    GetInspectorLocation: Main_Services_Api.EmployeeService + "GetInspectorLocation",

    test: Main_Services_Api.AuditService + "test",
    GetAuditHistory: Main_Services_Api.AuditService + "GetAuditHistory",
    GetAuditService: Main_Services_Api.AuditService + "GetAuditService",
    GetAuditsLookup: Main_Services_Api.AuditService + "GetAuditsLookup",
    SetAuditsService: Main_Services_Api.AuditService + "SetAuditsService",
    UpdateAuditsService: Main_Services_Api.AuditService + "UpdateAuditsService",
    UpdateAuditsService_FishMarket: Main_Services_Api.AuditService + "UpdateAuditsService_FishMarket",
    GetAuditDetailsMailbox: Main_Services_Api.AuditService + "GetAuditDetailsMailbox",
    GetNotification_Audit: Main_Services_Api.AuditService + "GetNotification_Audit",
    GetNotification_Incident: Main_Services_Api.AuditService + "GetNotification_Incident",
    ReadNotification: Main_Services_Api.AuditService + "ReadNotification",
    PostAuditDetailsForm: Main_Services_Api.AuditService + "PostAuditDetailsForm",
    PostAuditDetailsForm_forFishMarket: Main_Services_Api.AuditService + "PostAuditDetailsForm_forFishMarket",
    GetAuditDetailsForm: Main_Services_Api.AuditService + "GetAuditDetailsForm",
    AddAuditsWorkFlow: Main_Services_Api.AuditService + "AddAuditsWorkFlow",
    IsFormSubmitted: Main_Services_Api.AuditService + "IsFormSubmitted",
    GetMailCount: Main_Services_Api.AuditService + "GetMailCount",
    GetUnReadNotificationCount: Main_Services_Api.AuditService + "GetUnReadNotificationCount",
    PostInspectionImage: Main_Services_Api.AuditService + "PostInspectionImage/",
    SearchReport: Main_Services_Api.AuditService + "SearchReport",
    SearchReport_Incidents: Main_Services_Api.AuditService + "SearchReport_Incidents",
    GetGroupInspections: Main_Services_Api.AuditService + "GetGroupInspections",
    SetGroupInspections: Main_Services_Api.AuditService + "SetGroupInspections",
    GetGroupInspectionsLookup: Main_Services_Api.AuditService + "GetGroupInspectionsLookup",
    GetInspectionQuestion: Main_Services_Api.AuditService + "GetInspectionQuestion/",
    UpdateInspectionService: Main_Services_Api.AuditService + "UpdateInspectionService",
    PostInspectionDetailsForm: Main_Services_Api.AuditService + "PostInspectionDetailsForm",
    GetInspectionDetailsForm: Main_Services_Api.AuditService + "GetInspectionDetailsForm",
    GetFishMarketAuditData: Main_Services_Api.AuditService + "GetFishMarketAuditData",
    SetFishMarketAuditData: Main_Services_Api.AuditService + "SetFishMarketAuditData",
    SetChangeDateAudit: Main_Services_Api.AuditService + "SetChangeDateAudit",
    SetNewIncident: Main_Services_Api.AuditService + "SetNewIncident",
    GetIncidentDetailsMailbox: Main_Services_Api.AuditService + "GetIncidentDetailsMailbox",
    GetMailCount_Incident: Main_Services_Api.AuditService + "GetMailCount_Incident",
    UpdateIncidentInpectorResponse: Main_Services_Api.AuditService + "UpdateIncidentInpectorResponse",
    ReadMailbox: Main_Services_Api.AuditService + "ReadMailbox",
    MarkNotificationAsRead: Main_Services_Api.AuditService + "MarkNotificationAsRead",
    GetEnviornmentBalagh: Main_Services_Api.AuditService + "GetEnviornmentBalagh",
    GetFisheriesBalagh: Main_Services_Api.AuditService + "GetFisheriesBalagh",
    DeleteFile: Main_Services_Api.AuditService + "DeleteFile",
    ServiceEnableDisable: Main_Services_Api.AuditService + "ServiceEnableDisable",
    IsEstablishmentHasAudits: Main_Services_Api.AuditService + "IsEstablishmentHasAudits",
    IsFreezeCompany: Main_Services_Api.AuditService + "IsFreezeCompany",
    UpdateAuditEstType: Main_Services_Api.AuditService + "UpdateAuditEstType",
    GetAuditByRefNo: Main_Services_Api.AuditService + "GetAuditByRefNo",

    GetEstablishmentByType: Exernal_Audit + "GetEstablishmentByType",
    GetEstablishmentByName: Exernal_Audit + "GetEstablishmentByName",
    GetEstablishmentByID: Exernal_Audit + "GetEstablishmentByID",
    SubmitInspectionRequest: Exernal_Audit + "SubmitInspectionRequest",
    GetEstablishmenCertificates: Exernal_Audit + "GetEstablishmenCertificates",

    SendBackToDigitaService: DigitalService_Inspection + "SendBackToDigitaService",

    CreateJSR: Main_Services_Api.JudicialSeizureService + "Create",
    GetByIdJSR: Main_Services_Api.JudicialSeizureService + "GetById",
    GetAttachmentType: Main_Services_Api.JudicialSeizureService + "GetAttachmentType",
    SearchReportJSR: Main_Services_Api.JudicialSeizureService + "SearchReport",
    PostAttachment: Main_Services_Api.JudicialSeizureService + "PostAttachment",

};
var ls = localStorage; var ss = sessionStorage;
var t = new Date().getTime();
var routes = {
    createAudit: "views/createAudit.html?v=" + t,
    createEstablishment: "views/createEstablishment.html?v=" + t,
    createIncident: "views/createIncident.html?v=" + t,
    dashboard: "views/dashboard.html?v=" + t,
    groupInspection: "views/groupInspection.html?v=" + t,
    incidentmail: "views/incidentmail.html?v=" + t,
    mailbox: "views/mailbox.html?v=" + t,
    main: "views/main.html?v=" + t,
    notification: "views/notification.html?v=" + t,
    report: "views/report.html?v=" + t,
    employeelist: "views/admin/employeelist.html?v=" + t,
    showInspectionForm: "views/admin/showInspectionForm.html?v=" + t,
    editForm: "views/admin/editform.html?v=" + t,
    p404: "views/p404.html?v=" + t,
    AddNewEmployee: "views/admin/AddNewEmployee.html?v=" + t,
    profile: "views/admin/profile.html?v=" + t,
    createJSR: "views/JudicialSeizure/createJSR.html?v=" + t,
    reportJSR: "views/JudicialSeizure/reportJSR.html?v=" + t,
    updateAudit: "views/admin/updateaudit.html?v=" + t,

};

var DepartmentName = [
    { ID: "1", NameAr: "قسم البيئي", NameEn: "Environmental Section " },
    { ID: "2", NameAr: "قسم الزراعي", NameEn: "Agricultural Section" },
    { ID: "3", NameAr: "قسم  السمكي", NameEn: "Fisheries Section" },
    { ID: "4", NameAr: "قسم الحيواني", NameEn: "Animal Section" }
];

var MarketType = {
    FishMarket: 1,
    Others: 2,
    FishBoat: 3
};

var EmployeeRole = {
    Directors: 1,
    Department_Head: 3,
    Department_Staff: 4,
    SystemManager: 5,
    Admin: 6,
    CustomerService: 7
};
var Departments = {
    Environmental_Audit_Section: 1,
    Agricultural_Audit_Section: 2,
    Fisheries_Audit_Section: 3,
    Animal_Inspection_Section: 4
};
var InspectorRoles =
{
    UnderSecretary: 1,
    SecretaryOfUnderSecretary: 2,
    DepartmentHead: 3,
    DepartmentStaff: 4,
    SystemManager: 5,
    Administrator: 6,
};
var popupType = {
    warning: 'warning',
    success: "success",
    error: "error",
    info: "info",
};
var color = {
    red: '#ec3b3b',
    yellow: '#daad24',
    blue: '#3b8cd2',
    green: '#38a73c',
};
var AuditType = {
    audit: 1,
    inspection: 2,
    taqeem: 3,
    audit_other: 4,
};
var RiskLevelID = {
    HighRisk: 1,
    AverageRisk: 2,
    LowRisk: 3
};
var RiskLevel = {
    HighRisk: {
        id: 1, NameAr: 'عالية الخطورة', NameEn: "High Risk", color: "#e23b3b",
    },
    AverageRisk: {
        id: 1, NameAr: 'متوسط الخطورة', NameEn: "Average Risk", color: "#f3a027",
    },
    LowRisk: {
        id: 1, NameAr: 'منخفضة الخطورة', NameEn: "Low Risk", color: "#59c715",
    }
};
var Eserives_DeptID = {
    All: 0,
    Vet: 1,
    Agr: 2,
    Fish: 3,
    Env: 4
};

var lsUser = {
    FullName: ls.SmartAudit === undefined ? "" : JSON.parse(ls.SmartAudit).FullName,
    UserName: ls.SmartAudit === undefined ? "" : JSON.parse(ls.SmartAudit).UserName,
    token: ls.SmartAudit === undefined ? "" : JSON.parse(ls.SmartAudit).AccessToken,
    RoleName: ls.SmartAudit === undefined ? "" : JSON.parse(ls.SmartAudit).RoleName,
    privilege: ls.SmartAudit === undefined ? "" : JSON.parse(ls.SmartAudit).employeePrivligesModel,
    TokenType: ls.SmartAudit === undefined ? "" : JSON.parse(ls.SmartAudit).TokenType,
    inslang: ls.SmartAudit === undefined ? "" : JSON.parse(ls.SmartAudit).inslang,
    RoleID: ls.SmartAudit === undefined ? "" : JSON.parse(ls.SmartAudit).RoleID,
    UserID: ls.SmartAudit === undefined ? "" : JSON.parse(ls.SmartAudit).UserID,
    JobTitle: ls.SmartAudit === undefined ? "" : JSON.parse(ls.SmartAudit).JobTitle,
    DeptID: ls.SmartAudit === undefined ? "" : JSON.parse(ls.SmartAudit).DeptID,
    DeptNameAr: ls.SmartAudit === undefined ? "" : JSON.parse(ls.SmartAudit).DeptNameAr,
    DeptNameEn: ls.SmartAudit === undefined ? "" : JSON.parse(ls.SmartAudit).DeptNameEn,
    Email: ls.SmartAudit === undefined ? "" : JSON.parse(ls.SmartAudit).Email,
    isSMS: ls.SmartAudit === undefined ? "" : JSON.parse(ls.SmartAudit).isSMS,
    isPushNotification: ls.SmartAudit === undefined ? "" : JSON.parse(ls.SmartAudit).isPushNotification,
    isEmail: ls.SmartAudit === undefined ? "" : JSON.parse(ls.SmartAudit).isEmail,
};
var Global = {
    EstablishmentName: '',
    EstablishmentID: 0,
    EstablishmentTypeID: 0,
    AuditServiceID: 0,
    FormSubmissionInspectorID: 0,
    currentPage: 1,
    isAuditFormDisable: false,
    TeamLeaderID: 0,
    ExtRepot: false,
    IncidentID: 0,
    ProcedureInstanceID: 0,
    IsFishMarket: false,
    IsAssignToMe: false,
    InboxCount: 0,
    Incident: {
        inbox: 0,
        sent: 0
    },
    NotificationCount: 0,
    isGPS: 1
};
$(function () {
    //$(document).ajaxStart(function () {
    //    if (config.ajaxloader) {
    //        pleaseWait(true);
    //    }
    //});
    //$(document).ajaxStop(function () {
    //    if (config.ajaxloader)
    //        pleaseWait(false);
    //});
});

function AjaxJson(type, url, data, SuccessCallBack, ErrorCallBack, isLoad) {
    isLoad = isLoad || false;
    $.ajax({
        type: type,
        url: url,
        dataType: 'json',
        data: data,
        contentType: 'application/json; charset=utf-8',
        beforeSend: function (xhr) {
            pleaseWait(isLoad);
        },
        success: SuccessCallBack,
        error: ErrorCallBack
    });
}
function AjaxExternalAudit(URL, param, isASync, SuccessCallBack, ErrorCallBack) {
    config.ajaxloader = true;
    console.log(param.ID);
    var settings = {
        "async": isASync,
        "crossDomain": true,
        "url": URL,
        "method": "POST",
        "headers": {
            "content-type": "application/json",
            'Authorization': config.Auth_eservices
        },
        "processData": false,
        beforeSend: function (xhr) {
            pleaseWait(true);
        },
        "data": JSON.stringify(param)

    };
    $.ajax(settings)
        .done(function (response) {
            SuccessCallBack(response);
            pleaseWait(false);
            //  config.ajaxloader = false;
            Util.clearconsole();
        })
        .fail(function (r) {
            ErrorCallBack(r);
            pleaseWait(false);
            Util.clearconsole();
        });
}

function PostData(url, data, successCallBack) {
    $.ajaxSetup({
        headers: { 'Authorization': lsUser.token }
    });
    $.post(url, data)
        .success(successCallBack)
        .error(function (msg, xhr) {
            if (JSON.parse(JSON.stringify(msg)).status == 401) {
                AuthSystem();
            }
            console.log("CODE: " + JSON.parse(JSON.stringify(msg)).status);
            console.log(msg); pleaseWait(false);
            Util.clearconsole();
        });
}

function FetchService(requestType, URL, param, isASync, SuccessCallBack, showloading) {
    showloading = showloading || false;
    // config.ajaxloader = true;
    jQuery.support.cors = true;
    $.ajax({
        type: requestType,
        url: URL,
        async: isASync,
        data: param,
        crossDomain: true,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        beforeSend: function (xhr) {
            pleaseWait(showloading);
            xhr.setRequestHeader('authorization', lsUser.token);
            xhr.setRequestHeader('Accept-Language', lsUser.inslang);
        },
        success: function (msg, textStatus, xhr) {
            try {
                SuccessCallBack(msg, xhr.status);
                pleaseWait(false); Util.clearconsole();
            }
            catch (msg) {
                console.log(msg); pleaseWait(false); Util.clearconsole();
            }
        },
        error: function (msg, xhr) {
            //debugger;
            if (JSON.parse(JSON.stringify(msg)).status === 401) {
                AuthSystem();
            } else {
                Util.Notification(Util.getTrans('_errorMsg'), 'error');
                //swal(Util.getTrans('_error'), Util.getTrans('_errorMsg'), 'error');
            }
            console.log('URL:' + URL + " -- CODE: " + JSON.parse(JSON.stringify(msg)).status);
            console.log(msg); pleaseWait(false); Util.clearconsole();
        }
    });
}


function FetchServiceEservices(requestType, URL, param, isASync, SuccessCallBack, ErrorCallback, showloading) {
    showloading = showloading || false;
    // config.ajaxloader = true;
    jQuery.support.cors = true;
    $.ajax({
        type: requestType,
        url: URL,
        async: isASync,
        data: param,
        crossDomain: true,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        beforeSend: function (xhr) {
            pleaseWait(showloading);
            xhr.setRequestHeader('authorization', config.Auth_eservices);
            xhr.setRequestHeader('Accept-Language', lsUser.inslang);
        },
        success: function (msg, textStatus, xhr) {
            try {
                SuccessCallBack(msg, xhr.status);
                pleaseWait(false); Util.clearconsole();
            }
            catch (msg) {
                console.log(msg); pleaseWait(false); Util.clearconsole();
            }
        },
        error: function (msg, xhr) {
            ErrorCallback(msg);
        }
    });
}

function FetchServiceDigitalService(requestType, URL, param, isASync, SuccessCallBack, ErrorCallback, showloading) {
    showloading = showloading || false;
    // config.ajaxloader = true;
    jQuery.support.cors = true;
    $.ajax({
        type: requestType,
        url: URL,
        async: isASync,
        data: param,
        crossDomain: true,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        beforeSend: function (xhr) {
            pleaseWait(showloading);
            xhr.setRequestHeader('authorization', config.Auth_DigitalService);
            xhr.setRequestHeader('Accept-Language', lsUser.inslang);
        },
        success: function (msg, textStatus, xhr) {
            try {
                SuccessCallBack(msg, xhr.status);
                pleaseWait(false); Util.clearconsole();
            }
            catch (msg) {
                console.log(msg); pleaseWait(false); Util.clearconsole();
            }
        },
        error: function (msg, xhr) {
            ErrorCallback(msg);
        }
    });
}
function UploadFiles(url, data_form, SuccessCallBackFunc, ErrorCallBackFunc) {
    jQuery.support.cors = true;
    $.ajax({
        method: "POST",
        url: url,
        mimeType: "multipart/form-data",
        // enctype: 'multipart/form-data',
        //contentType: false,
        processData: false,
        cache: false,
        data: data_form,
        dataType: "json",
        contentType: false,
        crossDomain: true,
        async: true,
        beforeSend: function (xhr) {
            xhr.setRequestHeader('authorization', lsUser.token);
            pleaseWait(true);
        },
        success: function (data, textStatus, xhr) {
            SuccessCallBackFunc(data, textStatus, xhr);
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            ErrorCallBackFunc(XMLHttpRequest, textStatus, errorThrown);
        }
    });
}


var app = {
    LoadEstablishment: function (ID, url, param, selectName) {
        $('#' + ID).html($('<option></option>').val(0).html(Util.getTrans('selectText') + selectName));
        param = JSON.stringify(param);
        FetchService('post', url, param, true, function (r) {
            console.log(r);
            $.each(r.ResponseData, function (i, v) {
                var N = lsUser.inslang === 'ar' ? v.NameAr : v.NameEn;
                $('#' + ID).append($('<option></option>').val(v.ID).html(N));
            });
            Util.clearconsole();
            Util.updateDropDown(ID);
        }, false);

    },
    LoadEstablishment_Fisheries: function (ID, url, param, selectName) {
        $('#' + ID).html($('<option></option>').val(0).html(Util.getTrans('selectText') + selectName));
        param = JSON.stringify(param);
        FetchService('post', url, param, true, function (r) {
            console.log(r);
            $.each(r.ResponseData, function (i, v) {
                var N = lsUser.inslang === 'ar' ? v.NameAr : v.NameEn;
                $('#' + ID).append($('<option data-esttypeid="' + v.EstablishmentTypeId + '"></option>').val(v.ID).html(N));
            });
            Util.clearconsole();
            Util.updateDropDown(ID);
        }, false);

    },
    LoadEmployee: function (ID, url, param, selectName, Callback) {
        $('#' + ID).html($('<option></option>').val(0).html(Util.getTrans('selectText') + selectName));

        if (param == null) {
            param = isDualDepartmentHead() ? { DeptIDList: [Departments.Agricultural_Audit_Section, Departments.Animal_Inspection_Section] } : { DeptID: lsUser.DeptID };
        }
        param = JSON.stringify(param);
        FetchService('post', url, param, true, function (r) {
            console.log(r);
            $.each(r.ResponseData, function (_i, v) {
                $('#' + ID).append($('<option></option>').val(v.UserID).html(v.FullName));
            });
            Util.updateDropDown(ID);
            Util.clearconsole();
            if (Callback !== undefined) Callback();
        }, false);

    },

    LoadDropdown: function (ID, url, param, isAjaxCall, selectName, Callback) {

        $('#' + ID).html($('<option></option>').val(0).html(Util.getTrans('selectText') + selectName));
        if (isAjaxCall) {

            FetchService('get', url, param, false, function (r) {
                console.log(r);
                $.each(r.ResponseData, function (i, v) {
                    var N = lsUser.inslang === 'ar' ? v.NameAr : v.NameEn;
                    $('#' + ID).append($('<option></option>').val(v.ID).html(N));
                });
                if (Callback !== undefined) Callback();
                Util.clearconsole();
            }, false);
        } else {
            $.each(url.ResponseData, function (i, v) {
                var N = lsUser.inslang === 'ar' ? v.NameAr : v.NameEn;
                $('#' + ID).append($('<option></option>').val(v.ID).html(N));
            });
            if (Callback !== undefined) Callback();
        }
        Util.updateDropDown(ID);
        // $('#' + ID).select2();
    },
    LoadDropdown_EstabType_fishiers: function (ID, url, param, isAjaxCall, selectName, Callback) {

        $('#' + ID).html($('<option></option>').val(0).html(Util.getTrans('selectText') + selectName));
        if (isAjaxCall) {

            FetchService('get', url, param, false, function (r) {
                console.log(r);
                $.each(r.ResponseData, function (i, v) {
                    var N = lsUser.inslang === 'ar' ? v.NameAr : v.NameEn;
                    if (v.MarketType == "2")
                        $('#' + ID).append($('<option></option>').val(v.ID).html(N));
                });
                $('#' + ID).append($('<option></option>').val(-2).html(Util.getTrans('_fishBoats')));
                $('#' + ID).append($('<option></option>').val(-3).html(Util.getTrans('_fishMarket')));

                if (Callback !== undefined) Callback();
                Util.clearconsole();
            }, false);
        }
        Util.updateDropDown(ID);
        // $('#' + ID).select2();
    },
    LoadDropdown_Departments: function (ID, selectText, selectName) {

        if (lsUser.RoleID != EmployeeRole.Admin && lsUser.RoleID != EmployeeRole.Directors) {
            if (!isDualDepartmentHead() && lsUser.RoleID == EmployeeRole.Department_Head) {
                $('.' + ID).hide();
                return;
            }
        }

        $('#' + ID).html($('<option></option>').val(0).html(selectText + selectName));

        if (ss.DeptList != null) {
            url = JSON.parse(ss.DeptList);

            $.each(url.ResponseData, function (i, v) {
                var N = lsUser.inslang == 'ar' ? v.NameAr : v.NameEn;
                if (isDualDepartmentHead()) {
                    if (v.ID == 2 || v.ID == 4)
                        $('#' + ID).append($('<option></option>').val(v.ID).html(N));
                } else {
                    $('#' + ID).append($('<option></option>').val(v.ID).html(N));
                }
            });
        }
        else {
            var param = null;
            FetchService('get', config.getDepartment + "?id=0", param, false, function (r) {
                ss.DeptList = JSON.stringify(r);
                console.log(r);
                $.each(r.ResponseData, function (i, v) {
                    var N = lsUser.inslang == 'ar' ? v.NameAr : v.NameEn;
                    if (isDualDepartmentHead()) {
                        if (v.ID == 2 || v.ID == 4)
                            $('#' + ID).append($('<option></option>').val(v.ID).html(N));
                    } else {
                        $('#' + ID).append($('<option></option>').val(v.ID).html(N));
                    }
                });
                Util.clearconsole();
            }, false);
        }
        Util.updateDropDown(ID);
        // $('#' + ID).select2();
    },

    LoadDropdown_Emirates: function (ID, selectText, selectName) {
        $('#' + ID).html($('<option></option>').val(0).html(selectText + selectName));

        if (ss.EmirateList != null) {
            url = JSON.parse(ss.EmirateList);

            $.each(url.ResponseData, function (i, v) {
                var N = lsUser.inslang === 'ar' ? v.NameAr : v.NameEn;
                $('#' + ID).append($('<option></option>').val(v.ID).html(N));
            });
        }
        else {
            var param = null;
            FetchService('get', config.getEmirate, param, false, function (r) {
                ss.EmirateList = JSON.stringify(r);
                console.log(r);
                $.each(r.ResponseData, function (i, v) {
                    var N = lsUser.inslang === 'ar' ? v.NameAr : v.NameEn;
                    $('#' + ID).append($('<option></option>').val(v.ID).html(N));
                });
                Util.clearconsole();
            }, false);
        }
        Util.updateDropDown(ID);
        // $('#' + ID).select2();
    }

};
var TableProp = {
    MakeTable: function (col, row) {
        var html = TableProp.Header(col);
        html += TableProp.Tbody();
        html += TableProp.Rows(row);
        html += TableProp.EndTable();
        return html;
    },
    Header: function (head) {
        var html = '<table class="table table-responsive table-hover">\
                <thead><tr>';
        head.forEach(function (v, i) {
            html += '<th style="' + v.style + '">' + v.data + '</th>';
        });
        html += '</tr><thead>';
        return html;
    },
    Tbody: function () {
        return '<tbody class="tbody">';
    },
    Rows: function (row) {
        var html = '';
        for (i = 0; i < row.length; i++) {
            html += '<tr>';
            for (j = 0; j < row[i].length; j++) {
                html += '<td>' + row[i][j] + '</td>';
            }
            html += '</tr>';
        }
        return html;
    },
    EndTable: function () {
        return '<tbody></table>';
    }
};

var Util = {

    isEmptyOrNullOrUndefined: (value) => {
        return value === "" || value === null || value === undefined || value == 0;
    },
    isObjectEmpty: (obj) => {
        for (let key in obj) {
            if (obj.hasOwnProperty(key)) {
                if (Util.isEmptyOrNullOrUndefined(obj[key])) {
                    console.log(`The property ${key} is empty, null, or undefined.`);
                    return false;
                } else {
                    console.log(`The property ${key} has a value: ${obj[key]}`);
                }
            }
        }
        return true;
    },
    Parameter2Json: function (param) {
        return JSON.parse('{"' + decodeURI(param).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g, '":"') + '"}');
    },
    GetUniqueArray_JSON: function (JsonArray, objectName) {
        objectName = objectName.trim();
        var uniqueNames = [];
        for (i = 0; i < JsonArray.length; i++) {
            if (uniqueNames.indexOf(JsonArray[i][objectName]) === -1) {
                uniqueNames.push(JsonArray[i][objectName]);
            }
        }
        return uniqueNames;
    },
    Notification: function (text, lbl) {
        if (lbl == "error") lbl = 'bg-red';
        else if (lbl == "success") lbl = 'bg-light-green';
        else if (lbl == "warning") lbl = 'bg-orange';
        showNotification(lbl, text, 'top', "center", null, null);
    },
    ToolTip: function (label) {
        return 'data-toggle="tooltip" data-placement="top" data-original-title="' + label + '" ';
    },
    ToolTipLabel: function (label) {
        return 'data-toggle="tooltip" data-placement="top" data-original-title="' + Util.getTrans(label) + '" ';
    },
    Guid: function () {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    },
    Array2CommaSepString: function (array, str) {
        return Array.prototype.map.call(array, function (item) { return str; }).join(",");
    },
    CalcBusinessDays: function (d0, d1) { // input given as Date objects
        /* Two working days and an sunday (not working day) */
        //var holidays = ['2016-05-03', '2016-05-05', '2016-05-07'];
        var holidays = [];
        var startDate = d0;
        var endDate = d1;
        // Validate input
        if (endDate < startDate) {
            return 0;
        }
        // Calculate days between dates
        var millisecondsPerDay = 86400 * 1000; // Day in milliseconds
        startDate.setHours(0, 0, 0, 1);  // Start just after midnight
        endDate.setHours(23, 59, 59, 999);  // End just before midnight
        var diff = endDate - startDate;  // Milliseconds between datetime objects    
        var days = Math.ceil(diff / millisecondsPerDay);

        // Subtract two weekend days for every week in between
        var weeks = Math.floor(days / 7);
        days -= weeks * 2;

        // Handle special cases
        var startDay = startDate.getDay();
        var endDay = endDate.getDay();

        // Remove weekend not previously removed.   
        if (startDay - endDay > 1) {
            days -= 2;
        }
        // Remove start day if span starts on Sunday but ends before Saturday
        if (startDay == 0 && endDay != 6) {
            days--;
        }
        // Remove end day if span ends on Saturday but starts after Sunday
        if (endDay == 6 && startDay != 0) {
            days--;
        }
        /* Here is the code */
        holidays.forEach(function (day) {
            if ((day >= d0) && (day <= d1)) {
                /* If it is not saturday (6) or sunday (0), substract it */
                if ((Util.parseDate(day).getDay() % 6) != 0) {
                    days--;
                }
            }
        });
        return days;
    },

    parseDate: function (input) {
        // Transform date from text to date
        var parts = input.match(/(\d+)/g);
        // new Date(year, month [, date [, hours[, minutes[, seconds[, ms]]]]])
        return new Date(parts[0], parts[1] - 1, parts[2]); // months are 0-based
    },

    ResetForm: function (formID) {
        $('form#' + formID).trigger("reset");
        var ddList = $('select');
        $.each(ddList, function (i, v) {
            Util.updateDropDown(v.id);
        });
    },

    isFishMarket: function (id) {
        return parseInt(id) > 40 && parseInt(id) < 63;
    },

    clearconsole: function () {
        //if (window.console && !config.devMode) {
        //    console.clear();
        //}
    },
    updateFromToDates: function () {
        //$('.datetimepicker_start').bootstrapMaterialDatePicker({
        //    format: 'DD/MM/YYYY HH:mm',
        //    clearButton: true,
        //    weekStart: 0,
        //    shortTime: true,
        //});
        //$('.datetimepicker_end').bootstrapMaterialDatePicker({
        //    format: 'DD/MM/YYYY HH:mm',
        //    clearButton: true,
        //    weekStart: 0,
        //    shortTime: true,
        //});

        $('.datepicker').bootstrapMaterialDatePicker({
            //format: 'dddd DD MMMM YYYY',
            //format: 'DD/MM/YYYY',
            clearButton: true,
            weekStart: 6,
            time: false,
            cancelText: Util.getTrans('_cancel'),
            okText: Util.getTrans('_ok'),
            clearText: Util.getTrans('_clear'),
            nowText: 'Now'
        });
    },

    updateDropDown: function (id) {
        if (lsUser.inslang === "ar") $(".chzn-select").addClass("chosen-rtl");
        $(".chzn-select").chosen();
        $(".chzn-select").attr('data-placeholder', lsUser.inslang === "ar" ? 'أختر' : 'Select an option');
        $('#' + id).trigger("chosen:updated");
    },
    IsObjectEmpty: function (obj) {
        return Object.keys(obj).length == 0;
    },
    getTrans: function (word) {
        if (word == '') return '';
        else if (dictionary.arabic[word] == undefined) return '';
        return lsUser.inslang == "ar" ? dictionary.arabic[word] : dictionary.english[word];
    },
    RadioBtnText: function (word, lang) {
        if (word == '') return '';
        return lang === "ar" ? dictionary.arabic[word] : dictionary.english[word];
    },
    Localize: function (arName, enName) {
        return lsUser.inslang === "ar" ? arName : enName;
    },
    RoundNumber: function (num) {
        if (isNaN(num) || num == Infinity) return 0.00;
        num = parseFloat(num);
        return Math.fround(num).toFixed(2);
    },
    //FixFloatNumber: function (num) {
    //    num = parseFloat(num);
    //    return Math.toFixed(2);
    //},
    getColorDiff: function (val) {
        var col = "";
        switch (val) {
            case 1: case 4: case 5: case 7: case 8: case 10: case 12: case 15:
                col = "rgb(237, 223, 183)";
                break;
            default:
                col = "#fbefcd";
                break;
        }
        return col;
    },
    onUploadImage: function (img) {

        data_form = new FormData();
        var fileList = img.target.files;
        fileUploadArray.push(fileList);
        //console.log(fileUploadArray);
        var anyWindow = window.URL || window.webkitURL;
        $('.pip').remove();
        for (var i = 0; i < fileList.length; i++) {

            var file = fileList[i];
            var ext = file.name.split('.').pop();
            if (!SupportedFileExtension(ext)) {
                Util.Notification(Util.getTrans('_fileNotSupported'), 'error');
                //swal(Util.getTrans('_fileNotSupported'));
                break;
            }

            data_form.append("file" + i, file);
            var size = parseFloat(parseInt(file.size) / 1024).toFixed(1) + " KB";
            var name = file.name;
            var objectUrl = anyWindow.createObjectURL(file);
            //$("<span class=\"pip\">" +
            //    "<img name=\"" + name + "\" class=\"imageThumb\" src=\"" + objectUrl + "\" title=\"" + name + "\"/>" +
            //    "<br/></span>").insertAfter("#table_div");
            //$(".remove").click(function () {
            //    $(this).parent(".pip").remove();
            //});
            //<span class=\"remove\">Util.getTrans('_delete')</span>" +
            $('#btnUploadFile').show();
            window.URL.revokeObjectURL(file);
        }
    },
    GetFileURL: function (value) {
        var ds_url = 'files.DS.MOCCAE.gov.ae';
        var Eservice_FileURL = 'https://eservices.moccae.gov.ae/FileManagement/DownloadFile.aspx?FileID=';
        var FolderID = parseInt(value.AuditServiceID) > 0 ? value.AuditServiceID : value.IncidnetID;
        if (value.NameAr != null) {
            if (value.FilePath.indexOf(ds_url) > -1) {
                return value.FilePath;
            }
            return Eservice_FileURL + value.FilePath;
        }
        return FileServer_URL + FolderID + "/" + value.FilePath;
        //return value.FilePath
    },
    GetSavedImages: function () {
        setTimeout(function () {
            try {
                var images = JSON.parse(ss.getItem('ins_img'));
                $('#table_div').html('');

                var img_show = '<table class="table table-responsive ">';
                if (images != null) {
                    $.each(images, function (_index, value) {
                        //var size = value.FileSize;

                        var fileurl = Util.GetFileURL(value);
                        var fileurl_wide = Util.GetFileURL(value);
                        var employeeName = value.Employee_Name;
                        var date = Util.getDateForTextbox(value.CreationDate);

                        if (value.NameAr == null) {

                            var deleteImage = lsUser.UserID == value.EmployeeID ?
                                '<a href="javascript:void(0)" onclick="Util.DeleteFile(this)" data-id="' + value.ID + '"> <img src="images/delete.png" width="20" ' + Util.ToolTipLabel('_delete') + '></a>' : "";
                            var ext = value.FilePath.split('.').pop();
                            img_show += '<tr id="tr_' + value.ID + '">\
                                            <td ><a class ="imageThumb" target="_blank" href="'+ fileurl + '"><img width="18" src="' + Util.GetFileIcon(ext) + '">' + value.FilePath + '</a> </td>\
                                            <td>'+ employeeName + '</td>\
                                            <td>'+ date + '</td>\
                                            <td>'+ deleteImage + '</td>\
                                        </tr>';
                        }
                        if (!Global.ExtRepot && value.NameAr != null) { //files from Eservices .
                            img_show += '<tr>\
                                            <td ><a class ="imageThumb" target="_blank" href="'+ fileurl_wide + '"><img width="18" src="images/paper.png">' + value.NameAr + '</a></td>\
                                            <td>eservices</td>\
                                            <td>'+ date + '</td><td> </td>\
                                        </tr>';
                        }

                    });
                    img_show += '</table>';
                    $('#aniimated-thumbnials').html(img_show);
                    $('[data-toggle="tooltip"]').tooltip({ container: '#mainSection', html: true });
                    //$('.pip_db').lightGallery({
                    //    thumbnail: true,
                    //    selector: 'a'
                    //});
                }
            } catch (e) {
                console.log(e);
            }
        }, 200);
    },
    ShortString: function (str, len) {
        return str.length > len ? str.sub(0, len - 1) : str;
    },
    DeleteFile: function (e) {
        pleaseWait(true);
        var id = e.dataset.id;
        console.log(id);
        FetchService('POST', config.DeleteFile, JSON.stringify({ ID: id }), true, function (r) {
            if (r.IsSuccess) {
                pleaseWait(false);
                // $('#tr_' + id).remove();
                var oldArray = JSON.parse(ss.ins_img);
                //var index = oldArray.findIndex(x => x.ID == id);
                var index;
                oldArray.some(function (e, i) {
                    if (e.ID == id) {
                        index = i;
                        return true;
                    }
                });
                if (index > -1) {
                    oldArray.splice(index, 1);
                    ss.ins_img = JSON.stringify(oldArray);
                    $('#tr_' + id).fadeOut(1000);
                }
            }
        });
    },
    GetFileIcon: function (extension) {
        var iconURL = window.location.href.indexOf('localhost') > -1 ? "images/" : "/sis/images/";
        switch (extension.toLowerCase()) {
            case "xlsx":
            case "xls":
                return iconURL + "excel.png";
            case "docx":
            case "doc":
                return iconURL + "word.png";
            case "pptx":
            case "ppt":
                return iconURL + "powerpoint.png";
            case "pdf":
                return iconURL + "pdf.png";
            case "jpg":
            case "jpeg":
            case "png":
            case "bmp":
            case "tif":
            case "tiff":
            case "gif":
            case "ico":
                return iconURL + "photo.png";
            default:
                return iconURL + "paper.png";
        }
    },
    encryptStr: function (str) {
        return btoa(str);
    },
    decryptStr: function (str) {
        return atob(str);
    },
    getDateFormated: function (dt) {
        return dt !== null ? new Date(dt.match(/\d+/)[0] * 1).toDateString() : null;
    },
    getDateSQL: function (dt) {
        if (dt === null) return '';
        var d = new Date(Date.parse(dt));
        return d.getDate() + "-" + parseInt(d.getMonth() + 1) + "-" + d.getFullYear() + " " + new Date(Date.parse(dt)).toLocaleTimeString();
    },
    getDateForTextbox: function (dt) {
        if (dt === null) return '';

        var d = (new Date(Date.parse(dt)).toLocaleDateString()).split('/');
        return d[2] + "-" + d[0] + "-" + d[1];
    },
    getDateOnlySQL: function (dt) {
        if (dt === null) return '';
        return new Date(Date.parse(dt)).toLocaleDateString();
    },
    DaysLeft: function (dat) {
        // debugger;
        var today = new Date();
        dat = new Date(Date.parse(dat));
        if (today > dat) {
            return Util.timeAgo(dat);
        }
        var one_day = 1000 * 60 * 60 * 24;
        return Util.getTrans('_dayLeft') + ' ' + Math.ceil((dat.getTime() - today.getTime()) / (one_day));
    },
    timeAgo: function (date) {
        date = new Date(Date.parse(date));
        const NOW = new Date();
        const times = [[Util.getTrans('_today'), 1, Util.getTrans('_today')], [Util.getTrans("_minute"), 60, Util.getTrans("_minutes")], [Util.getTrans("_hour"), 3600, Util.getTrans("_hours")],
        [Util.getTrans("_day"), 86400, Util.getTrans("_days")], [Util.getTrans("_week"), 604800, Util.getTrans("_weeks")], [Util.getTrans("_month"), 2592000, Util.getTrans("_months")],
        [Util.getTrans("_year"), 31536000, Util.getTrans("_years")]];
        var diff = Math.round((NOW - date) / 1000);
        for (var t = 0; t < times.length; t++) {
            if (diff < times[t][1]) {
                if (t === 0) {
                    return Util.getTrans('_today');
                } else {
                    diff = Math.round(diff / times[t - 1][1]);
                    return diff === 1 ? Util.getTrans('_ago') + " " + diff + " " + times[t - 1][0] + " " : Util.getTrans('_agos') + " " + diff + " " + times[t - 1][2];
                }
            }
        }
    },
    scrollTop: function () {
        window.scrollTo({
            top: 0,
            left: 0,
            behavior: 'smooth'
        });
    },
    //getParameter: function (param_name) {
    //    var url = new URL(window.location.href);
    //    return url.searchParams.get(param_name);
    //},
    getParameter: function (name, url) {
        if (!url) {
            url = window.location.href;
        }
        name = name.replace(/[\[\]]/g, "\\$&");
        var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
            results = regex.exec(url);
        if (!results) return null;
        if (!results[2]) return '';
        return decodeURIComponent(results[2].replace(/\+/g, " "));
    },
    DiffTime_Unix: function (user_time) {
        var current = Math.round((new Date()).getTime() / 1000);
        var a = user_time * 1000;
        var b = current * 1000;

        var dateA = new Date(a);
        var dateB = new Date(b);

        return dateB.getMinutes() - dateA.getMinutes();
    },
    DiffDay_Unix: function (user_time) {
        var current = Math.round((new Date()).getTime() / 1000);
        var a = user_time * 1000;
        var b = current * 1000;

        var dateA = new Date(a);
        var dateB = new Date(b);

        return {
            months: dateB.getMonth() - dateA.getMonth(),
            hours: dateB.getHours() - dateA.getHours(),
            mins: dateB.getMinutes() - dateA.getMinutes()
        };
    },
    showPopup: function (title_, text_, type_, showCancelButton, callbackSuccess) {
        swal({
            title: title_,
            text: text_,
            type: type_,
            showCancelButton: showCancelButton,
            closeOnConfirm: false,
            showLoaderOnConfirm: true,
        }, callbackSuccess);
    },
    GetProperName: function (value) {
        if (lsUser.inslang === "ar") { //ar
            if (value.NameAr === null) return value.NameEn;
            else return value.NameAr;
        } else {
            if (value.NameEn === null) return value.NameAr;
            else return value.NameEn;
        }
        //return value.NameEn;
    },
    GetGradeColor: function (grade) {
        if (grade == "A") {
            return color.green;
        }
        else if (grade == "B") {
            return color.blue;
        }
        else if (grade == "C") {
            return color.yellow;
        }
        else {
            return color.red;
        }
        //return '';
    },
    getPercentageColor: function (val) {
        var _color = '';
        if (val >= 80 && val <= 100) {
            _color = color.green;
        }
        else if (val >= 70 && val <= 79) {
            _color = color.blue;
        }
        else if (val >= 60 && val <= 69) {
            _color = color.yellow;
        }
        else {
            _color = color.red;
        }
        return _color;
    },
    getPercentageGrade: function (val) {
        var _grade = '';
        if (val >= 80 && val <= 100) {
            _grade = "A";
        }
        else if (val >= 70 && val <= 79) {
            _grade = "B";
        }
        else if (val >= 60 && val <= 69) {
            _grade = "C";
        }
        else {
            _grade = "D";
        }
        return _grade;
    },
    getRiskLevelColor: function (risklevel) {
        try {
            switch (risklevel) {
                case 1:
                    return "rgb(255, 128, 128)";

                case 2:
                    return "rgb(255, 201, 102)";

                case 3:
                    return "rgb(115, 224, 151)";

                case 4:
                    return "#fff";
            }
        }
        catch (e) {
            console.error(e);
        }

    },
    getRiskLevelColor_Fisheries: function (risklevel) {
        try {
            switch (risklevel) {
                case 2:
                    return "#f37777";

                case 1:
                    return "#4CAF50";
            }
        }
        catch (e) {
            console.error(e);
        }

    },
    getDeptartmentCode: function (id) {

        try {
            switch (id) {
                case 1:
                    return "EAS";
                case 2:
                    return "AAS";
                case 3:
                    return "FAS";
                case 4:
                    return "AIS";
            }
        }
        catch (e) {
            console.error(e);
        }
    },
    readImageURL: function (input) {
        var url = '';

        var reader = new FileReader();
        reader.addEventListener("load", function (e) {
            console.log(e);
            url = e.target.result;
        });

        return url;
    },
    countChar: function (str, match) {
        return str.match((new RegExp(match, "g")) || []).length;
    },
    TimeSpent: function (srtTime) {
        var currTime = new Date();
        var oldTime = new Date(srtTime);
        var res = currTime - oldTime;
        return res;
    },
    MakeProperHTML: function (markup) {
        var t = markup.split('${').join("'+");
        return t.split('}').join("+'");

    },
    GetImages: function (AuditServiceID) {

        var refNo = AuditServiceID;
        console.log(refNo);
        $('#img_div').hide();
        $('#aniimated-thumbnials').html('');
        FetchService("GET", config.GetInspectionImage + refNo, null, false, function (r, xhr) {
            //console.log(r, xhr);
            ls.setItem('ins_img', JSON.stringify(r));
            if (r.length > 0) {
                var img_show = '';
                $('#img_div').show();
                $.each(r, function (index, value) {
                    var size = value.FileSize;
                    var fileurl = FileServer_URL + refNo + "/" + value.FilePath + "_base.jpg";
                    var fileurl_wide = FileServer_URL + refNo + "/" + value.FilePath + "_wide.jpg";
                    img_show = '<div class="pip_db">\
                                    <a href="'+ fileurl_wide + '" data-sub-html="">\
                                        <img class ="imageThumb" src="'+ fileurl + '">\
                                    </a>\
                                </div>';
                    $('#aniimated-thumbnials').append(img_show);
                });
                $('#aniimated-thumbnials').lightGallery({
                    thumbnail: true,
                    selector: 'a'
                });
            }
            else {
                $('#img_div').hide();
            }
        });

    },
    findInJSONObject: function (mobject, criteria) {
        return mobject.filter(function (obj) {
            return Object.keys(criteria).every(function (c) {
                return obj[c] == criteria[c];
            });
        });

    },
    AddDays: function (NoOfDays) {
        NoOfDays = parseInt(NoOfDays);
        return new Date(new Date().getTime() + (NoOfDays * 24 * 60 * 60 * 1000)).toDateString();
    },
    ScrollTopAnimated: function () {
        $("html, body").animate({ scrollTop: "0" });
        $('html, body').css({ 'overflow': 'auto' });
    },
    SearchTextFromHTMLPage: function (searchText) {
        var color = '';
        searchText = searchText.toLowerCase();
        $.each($('#setTemplateTbody td'), function (i, v) {
            $(this).html(function (index, text) {
                color = $(this);
                if (text.toLowerCase().indexOf(searchText) > -1) {
                    // setTimeout(function () { color.context.style.background = ""; }, 5000);
                    color.context.style.background = "#f9f946";
                    document.getElementById($(this).context.parentNode.id).scrollIntoView();
                } else {
                    color.context.style.background = "";
                }
            });
        });
    },
    GetFishiersControl: function (isFishMarket) {

        if (isFishMarket == "1") {
            return 'fishMarketAuditControl';
        } else if (isFishMarket == "2") {
            return 'fishAuditControl';
        } else if (isFishMarket == "3") {
            return 'fishBoatAuditControl';
        }

    }

};