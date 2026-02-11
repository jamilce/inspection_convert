var params = null;
var underMaintenance = false;
var interval_underMaintenance;
var currentVersion = 1.0;
const googleMapId = '97ee3dea86d2f28c';
function loadScript(scriptName) {
    //history.replaceState(null, null, ' ');     
    scriptName = scriptName.indexOf('?') > 0 ? scriptName.substr(0, scriptName.indexOf('?')) + ".js" : scriptName + ".js";

    console.log(params);
    $.ajax({
        url: scriptName + "?v=" + new Date().getTime(),
        success: function () {
            console.log(getInfo());
            onLoad();
            CloseSidePanel();
            setTimeout(function () {
                trans();
                AccessFeature();

            }, 200);
        },
        error: function () {
            swal(Util.getTrans('_error'), Util.getTrans('_errorMsg') + "-" + exception.toString(), 'error');
            console.log("Triggered ajaxError handler.....");
            trans();
        }

    })
    //$.getScript(scriptName)
    //    .done(function (script, textStatus) {
    //        console.log(getInfo());
    //        onLoad();
    //        CloseSidePanel();
    //        setTimeout(function () {
    //            trans();
    //            AccessFeature();

    //        }, 200);
    //    }).fail(function (jqxhr, settings, exception) {
    //        swal(Util.getTrans('_error'), Util.getTrans('_errorMsg') + "-" + exception.toString(), 'error');
    //        console.log("Triggered ajaxError handler.....");
    //        trans();
    //    });
}
$(function () {

    interval_underMaintenance = setInterval(function () {
        if (underMaintenance) {
            clearInterval(interval_underMaintenance);
            SystemLogout();
        }
    }, 5000);
    console.log("ready!!");
    if (ls.SmartAudit == null) {
        AuthSystem();
    }
    else {
        if (window.location.hash) {
            displayHash(window.location.hash);
        }
        else {
            if (lsUser.token != null) {
                loadScript('views/main');
            }
            else {
                AuthSystem();
            }
        }
        SetLanguge();
        GeneralSetting();
        $(window).on('hashchange', function () {
            // On every hash change the render function is called with the new hash.
            displayHash(window.location.hash);
        });
        //SetDepartForDualDepartment();
        chekInspectorLocation = setInterval(chkInspectorLocation, 2 * 60 * 1000); //2 min
        chekLogin = setInterval(KeepSessionAlive, 1 * 60 * 1000); //2 min

        checkInternetConnection();
        ItemCountDashboard.GetNotificationBadges();
    }
});

function checkInternetConnection() {
    var status = navigator.onLine;
    if (status) {
        // console.info('Internet Available !!');
    } else {
        swal({
            title: '',
            text: Util.getTrans('_NoInternetConnection'),
            type: "warning"
        }, function () {
            window.location.reload(true);
        });
    }
    setTimeout(function () {
        checkInternetConnection();
    }, 10 * 1000);//10 sec
}
function CloseSidePanel() {
    $('body').removeClass('overlay-open');
    $('.overlay').hide();
}

function displayHash(hash) {
    if (hash) {
        console.log(hash);
        // assumes that the anchor tag and li tag 
        //remove the current anchor tag
        $(".active").removeClass("active");
        $('a[href="' + hash + '"]').parent().addClass("active");
        var scriptName = hash.replace("#", "");
        //  debugger;
        params = scriptName.indexOf('?') > 0 ? Util.Parameter2Json(scriptName.substr(scriptName.lastIndexOf('?') + 1, scriptName.length - 1)) : "";
        scriptName = scriptName.substr(0, scriptName.lastIndexOf('?') == -1 ? scriptName.length : scriptName.lastIndexOf('?'));
        if (HideSystemFeatures(scriptName)) {
            loadScript(scriptName);
        }
        else {
            window.location.href = '#views/p404';
        }
    }
}

function AuthSystem() {
    //  loadScript('auth/login.js');
    ls.removeItem('SmartAudit');
    window.location.href = 'auth/login.html';
}

var page = {
    createAudit: "createAudit",
    createEstablishment: "createEstablishment",
    createIncident: "createIncident",
    dashboard: "dashboard",
    groupInspection: "groupInspection",
    incidentmail: "incidentmail",
    mailbox: "mailbox",
    main: "main",
    notification: "notification",
    report: "report",
    employeelist: "employeelist",
    showInspectionForm: "showInspectionForm",
    editForm: "editform",
    p404: "p404",
    AddNewEmployee: "AddNewEmployee",
    profile: "profile",
    addAuditDetail: "addAuditDetail",
    createJSR: "createJSR",
    reportJSR: "reportJSR",
    updateAudit: "updateaudit",
};

function PageAuthorized(p) {

    var pre = lsUser.privilege[0];
    if (p == page.main || p == page.profile || p == page.p404) {// access for public pages.
        return true;
    }

    if ((pre.IsCreateAudits && p === page.createAudit)
        || (pre.IsCreateEstablisment && p === page.createEstablishment)
        || (pre.IsCreateGroupInspection && p === page.groupInspection)
        || (pre.IsCreateIncident && p === page.createIncident)
        || (pre.IsShowIncident && p === page.incidentmail)
        || (pre.IsShowNotification && p === page.notification)
        || (pre.IsShowReports && p === page.report)
        || (pre.IsShowInbox && p === page.mailbox)
        || (pre.IsShowEmployeeList && p === page.employeelist)
        || (pre.IsUpdateInspectionForm && (p === page.showInspectionForm || p === page.editForm))
        || (pre.IsShowEmployeeList && p === page.AddNewEmployee)
        || (pre.IsDashboard && p === page.dashboard)
        || (pre.IsJSReport && p === page.createJSR)
        || (pre.IsJSReport && p === page.reportJSR)
        || (p == page.addAuditDetail)
        || (p == page.updateAudit)
    ) {
        console.log('access granted===');
        return true;
    }
}
function HideSystemFeatures(page) {

    if (page === undefined) { return true; }
    var p = page.split(/(\\|\/)/g).pop();
    // p = p.split('.')[0];
    try {
        return PageAuthorized(p);
    } catch (e) {
        return false;
    }
}
function AccessFeature() {
    // debugger;
    $('.clearls').hide();
    var pre = lsUser.privilege[0];

    if (pre.IsCreateAudits) {
        $('.' + page.createAudit).show();
    }
    if (pre.IsCreateEstablisment) {
        $('.' + page.createEstablishment).show();
    }
    if (pre.IsCreateGroupInspection) {
        $('.' + page.groupInspection).show();
    }
    if (pre.IsCreateIncident) {
        $('.' + page.createIncident).show();
    }
    if (pre.IsShowIncident) {
        $('.' + page.incidentmail).show();
    }
    if (pre.IsShowNotification) {
        $('.' + page.notification).show();
    }
    if (pre.IsShowReports) {
        $('.' + page.report).show();
    }
    if (pre.IsShowInbox) {
        $('.' + page.mailbox).show();
    }
    if (pre.IsShowEmployeeList) {
        $('.' + page.employeelist).show();
    }
    if (pre.IsUpdateInspectionForm) {
        $('.' + page.showInspectionForm).show();
        $('.' + page.editForm).show();
    }
    if (pre.IsDashboard) {
        $('.' + page.dashboard).show();
    }
    if (pre.IsJSReport) {
        $('.' + page.reportJSR).show();
    }
    if (pre.updateAudit) {
        $('.' + page.updateAudit).show();
    }
}

function SendBacktoDigitalService_Inspection(action) {
    action = action == "3" ? "Accept" : "Reject";
    var proid = Global.ProcedureInstanceID;
    var AuditServiceID = Global.AuditServiceID;

    var ret = false;
    if (proid > 0) {
        var data = {
            "ServiceRequestTransactionId": proid,
            "Action": action,
            "AuditServiceId": AuditServiceID
        };
        FetchServiceDigitalService("post", config.SendBackToDigitaService, JSON.stringify(data), false, function (r) {
            if (r.ResponseData.IsSuccess) {
                console.log('DS-result = ' + r);
                console.log("success!! send to DS---." + r.message);
                ret = true;
            }
        }, function (error) {
            pleaseWait(false);
            ret = false;
        });

    }
    return ret;

}
function SendBacktoEservices_Inspection(action) {
    action = action == "3" ? "Accept" : "Reject";
    var proid = Global.ProcedureInstanceID;

    var ret = false;
    if (proid > 0) {
        var data = { RequestID: proid, Action: action, EstablishmentID: Global.EstablishmentID };
        FetchService('post', config.SubmitInspectionRequest_Eservice, JSON.stringify(data), false, function (r) {
            ret = r.IsSuccess;
        })

        //FetchService('get', config.GetEstablishmentCordinate + "/" + Global.EstablishmentID, null, false, function (r) {
        //    if (r.IsSuccess) {
        //        var cord = r.ResponseData;
        //        var data = { RequestID: proid, Action: action, Latitude: cord.Lat, Longitude: cord.Lng };
        //        FetchServiceEservices("post", config.SubmitInspectionRequest, JSON.stringify(data), false, function (r) {
        //            if (r.ResponseType == 3) {
        //                console.log("Repeated!! send to eservices." + r.ResponseMessage);
        //                ret = true;
        //            }
        //            else if (r.ResponseType == 1) {
        //                console.log("Success!! send to eservices." + r.ResponseMessage);
        //                ret = true;
        //            }
        //            else if (r.ResponseType == 0) {
        //                console.log("Error!! send to eservices." + r.ResponseMessage);
        //                ret = false;
        //            }
        //            else {
        //                console.log("false... send to eservices." + r.ResponseMessage);
        //                ret = false;
        //            }
        //        }, function (error) {
        //            pleaseWait(false);
        //            ret = false;

        //        }, true);
        //    }
        //})
    }
    return ret;

}


function SendBacktoEservices(action) {
    var ids = [20, 21, 23, 24, 26]; //new digital services.
    if (ids.indexOf(parseInt(Global.EstablishmentTypeID)) > -1) {
        return SendBacktoDigitalService_Inspection(action);
    }
    else {
        return SendBacktoEservices_Inspection(action);
    }
}

function LoadStyle(url) {
    var head = document.getElementsByTagName('head')[0];
    var link = document.createElement('link');
    link.rel = 'stylesheet';
    link.type = 'text/css';
    link.href = url;
    link.media = 'all';
    head.appendChild(link);
}

function GeneralSetting() {
    if (lsUser.inslang === "ar") {
        $('.cssheader2').addClass('navbar-left').removeClass("cssheader2");
        $('.cssheader').addClass('navbar-right').removeClass("cssheader");
    }
    else {
        $('.cssheader').addClass('navbar-left').removeClass("cssheader");
        $('.cssheader2').addClass('navbar-right').removeClass("cssheader2");
    }
}
function getPopUp_InspectionData(e) {
    debugger;
    var ID = e.dataset.id;
    Global.EstablishmentID = e.dataset.establismentid;
    Global.EstablishmentTypeID = e.dataset.establismenttypeid;
    Global.AuditServiceID = ID;
    Global.FormSubmissionInspectorID = e.dataset.inspectorid;
    Global.TeamLeaderID = e.dataset.teamleader;
    Global.IsAssignToMe = e.dataset.isassigntome == "true";
    Global.IsFishMarket = e.dataset.isfishmarket; //1 mean Fishmarket // 3 = Fishboats
    Global.EstablishmentName = e.dataset.establishmentname;
    var deptid = e.dataset.deptid;
    var auditTypeID = e.dataset.audittypeid;
    Global.isAuditFormDisable = e.dataset.isauditformdisable == undefined ? Global.isAuditFormDisable : e.dataset.isauditformdisable == "true";
    pleaseWait(true);
    GetAuditForm(ID, deptid, auditTypeID, e.dataset.establismenttypeid, Global.IsFishMarket);

}

function GetAuditForm(ID, deptid, AuditTypeID, estTypeID, isFishMarket) {
    deptid = parseInt(deptid);
    AuditTypeID = parseInt(AuditTypeID);
    estTypeID = parseInt(estTypeID);

    var control = null;
    //only for env department.
    if (AuditTypeID == AuditType.inspection && deptid == Departments.Environmental_Audit_Section) {
        control = 'envAuditControl';
    }
    else if (AuditTypeID == AuditType.audit || AuditTypeID == AuditType.audit_other) {//Audits
        if (deptid == Departments.Environmental_Audit_Section) {
            control = 'envAuditControl';
        } else if (deptid === Departments.Agricultural_Audit_Section) {
            control = 'agriAuditControl';
        }
        else if (deptid === Departments.Fisheries_Audit_Section) {
            control = Util.GetFishiersControl(isFishMarket);
        }
        else if (deptid === Departments.Animal_Inspection_Section) {
            control = 'vetAuditControl';
        }
    }
    else if (AuditTypeID == AuditType.inspection) { //Inspection
        if (deptid == Departments.Environmental_Audit_Section) {
            control = 'inspection.env.control';
        } else if (deptid === Departments.Agricultural_Audit_Section) {
            control = 'inspection.agri.control';
        }
        else if (deptid === Departments.Fisheries_Audit_Section) {
            control = 'inspection.fish.control';
        }
        else if (deptid === Departments.Animal_Inspection_Section) {
            control = 'inspection.vet.control';
        }
    }
    else if (AuditTypeID == AuditType.taqeem) { // Taqeem
        if (deptid == Departments.Environmental_Audit_Section) {
            control = 'envAuditControl';
        }
    }
    $('#ubody_AuditDetail').html('');
    getControl(control, 'data', function (script, textStatus) {
        $('#ubody_AuditDetail').html(script);
        ShowModal('#model_AuditDetail');
        setTimeout(function () {
            trans();
        }, 50);
    });
}
function FishiersMarkets_Mapping(ddVal) {
    ddVal = parseInt(ddVal);
    var arr_1 = [1, 3];
    var arr_2 = [-3, -2];
    if (arr_2.indexOf(ddVal) > -1) {
        return arr_1[arr_2.indexOf(ddVal)];
    }
    return ddVal;
}
function ShowModal(id) {
    $(id).modal({
        backdrop: 'static',
        keyboard: false
    });
    $(id).modal('show');
}
function CloseModal(id, isClearDOM) {
    $(id).modal('hide');
    if (!isClearDOM) {
        Util.GetSavedImages();
        $(id + ' .modal-body').html('');
    }
    //setTimeout(function () {
    //    if (window.location.href.indexOf('mailbox') > 0) {
    //        GetInspectionFromData_Refresh();
    //    }
    //}, 1000);
}

var chekInspectorLocation; var chekLogin;

function KeepSessionAlive() {

    var version = parseFloat(ls.inspectionVersion ?? 0);
    if (lsUser.token != null) {
        var current_time = new Date().getTime() / 1000;
        var expTime = JSON.parse(atob(lsUser.token.split('.')[1])).exp;
        if (current_time > expTime) {
            clearInterval(chekLogin);
            AuthSystem();
        }
    }
    if (version < currentVersion) {
        ls.inspectionVersion = currentVersion
        AuthSystem();
    }

}

function SetLanguge() {
    if (lsUser.inslang === "ar") {
        //LoadStyle('/css/arabic_css.css');
        lsUser.inslang = "ar";
    }
    else {
        $("#ArCSS").attr("disabled", "disabled");
        //$("link[href='css/arabic_css.css']").remove();
        lsUser.inslang = "en";
    }
}
function ChangeLanguge() {
    var a = JSON.parse(ls.SmartAudit);
    if (lsUser.inslang === "ar") {
        $("#ArCSS").attr("disabled", "disabled");
        // $("link[href='css/arabic_css.css']").remove();
        a.inslang = "en";
    }
    else {
        // LoadStyle('/css/arabic_css.css');
        a.inslang = "ar";
    }
    ls.SmartAudit = JSON.stringify(a);

    window.location.reload(true);
}

var lat = 0; lng = 0; loc = "";
function getCurrentCord(callback) {
    config.ajaxloader = false;
    navigator.geolocation.getCurrentPosition(function (p) {
        lat = p.coords.latitude;
        lng = p.coords.longitude;
        FetchService('get', config.GetGoogleLocation + "?latlng=" + lat + ',' + lng, null, false, function (r) {
            var res = JSON.parse(r);
            loc = res.results[0].formatted_address;
            console.log(loc);
            callback();
        })
    });

    //var s = 'https://maps.googleapis.com/maps/api/geocode/json?key=AIzaSyD2TKA_xdUldeY7yOZxXgRPBeCNhdr1uXM&latlng=' + lat + ',' + lng;
    //if (lat > 0) {
    //    var jqxhr = $.getJSON(s, function (r) {
    //        loc = r.results[0].formatted_address;
    //        callback();
    //    });
    //}
}
function getControl(page, divToLoad, SuccessCallBack) {
    var v = new Date().getTime();
    var url = "controls/" + page + ".html?v=" + v;
    $.get(url)
        .done(SuccessCallBack)
        .fail(function (jqxhr, settings, exception) {
            console.log("Controls Error handler....." + exception.toString());
        });
}
function chkInspectorLocation() {
    console.log('chkInspectorLocation');
    config.ajaxloader = false;
    if (window.location.href.indexOf('login.html') >= 0) { return false; }


    if (Global.isGPS == 1) {
        //if (lsUser.RoleID == EmployeeRole.Department_Staff && Global.isGPS == 1) {
        getCurrentCord(function () {
            setTimeout(function () {
                var url = config.SetInspectorLocation;
                if (lat > 0 && loc != '') {
                    var data = JSON.stringify({ cord_X: lat, cord_Y: lng, Location: loc, DeptID: lsUser.DeptID });
                    FetchService('post', url, data, true, function (response) {
                        if (response.IsSuccess) {
                            console.log("gps inserted");
                        } else {
                            console.log("gps inserted error");
                        }
                    }, false);
                }
            }, 1000);
        });

    } else {
        //console.log("Not-a-staff... gps");
    }
}

var SystemLogout = function () {
    AuthSystem();

};

var pleaseWait = function (act) {
    if (act) $('.page-loader-wrapper').fadeIn();
    else $('.page-loader-wrapper').fadeOut();
};

var getEstablimentData = function (id) {
    config.ajaxloader = true;
    pleaseWait(true);
    $('#ubody').html('');
    ShowModal('#model_showDeatil');

    $('.btnUpdateGPS').hide();
    setTimeout(function () {
        FetchService('POST', config.GetEstablisment_Eservices, JSON.stringify({ ID: id }), false, function (r) {
            //debugger;
            if (r.IsSuccess) {
                //if (r.ResponseData[0].ParticipantId !== null && r.ResponseData[0].ParticipantId > 0) {
                //    var url = config.GetEstablishmentByID;
                //    var p = {
                //        ID: r.ResponseData[0].ParticipantId,
                //        PageIndex: 0,
                //        PageSize: 10
                //    };
                //    AjaxExternalAudit(url, p, false, function (r) {

                //        if (r.Data === null) { return false; }
                //        var data = r.Data[0];
                //        getEstDataSuccess(data);
                //    },
                //        function (r) {
                //            $('#model_showDeatil').modal('hide');
                //            swal("", Util.getTrans('_errorMsg'), 'error');
                //        });
                //} else {
                getEstDataSuccess(r.ResponseData[0]);
                //}
            }
        }, true);
    }, 500);
};
function getEstDataSuccess(data) {
    var html = '';
    if (data.ParticipantId != null && data.ParticipantId > 0) {

        AjaxExternalAudit(config.GetEstablishmenCertificates, { ParticipantID: data.ParticipantId, EstablishmentTypeID: data.DeptID }, false, function (r) {
            console.log(r.Data[0].CertificateInfos);
            var cert = r.Data[0].CertificateInfos;

            cert.forEach(function (v, i) {
                var CertName = lsUser.inslang == "ar" ? v.CertificateNameAr : v.CertificateNameEn;
                html += '<tr style="border: 2px solid #bdb9b9;    background-color: #f1f1f1;">\
                        <th scope="row">'+ Util.getTrans('_certificateNo') + '\
                       </th>\
                        <td>'+ v.CertificateNumber + '</td>\
                     </tr>\
                    <tr>\
                        <th scope="row">'+ Util.getTrans('_date') + '</th>\
                        <td>'+ Util.getDateForTextbox(v.CertificateCreationDate) + " - " + Util.getDateForTextbox(v.CertificateExpiryDate) + '</td>\
                     </tr>\
                     <tr>\
                        <th scope="row">'+ Util.getTrans('_certificate') + '\
                        </th>\
                        <td>'+ CertName + '</td>\
                     </tr>\
                     ';
            });
        }, function (error) {
            console.log(error);
        });
    }

    var $data = data;
    //var dt1 = $data.CertificateCreationDate != undefined ? Util.getDateFormated($data.CertificateCreationDate) : '';
    //var dt2 = $data.CertificateExpiryDate != undefined ? Util.getDateFormated($data.CertificateExpiryDate) : "";

    var latlng = $data.Lat_X == null || $data.Lat_X == "0" ? '' : '<a target="_blank" href="https://www.google.com/maps?daddr=' + $data.Lat_X + "," + $data.Lng_Y + '">\
                                                <img src="images/google-maps.png" width="15" /></a>';
    var tbl = '<div class="card " >\
                        <div class="body ">\
                            <table class="table table-responsive">\
                                <tbody>';
    tbl += ' <tr>\
                        <th scope="row" style="width:30%">'+ Util.getTrans('_Name') + '</th>\
                        <td>${$data.NameAr} / ${$data.NameEn}</td>\
                     </tr>\
                       <tr>\
                        <th scope="row">'+ Util.getTrans('_type') + '</th>\
                        <td> ${$data.EstablishmentTypeNameAr}</td>\
                     </tr>\
                      <tr>\
                        <th scope="row">'+ Util.getTrans('_number') + '</th>\
                        <td>${$data.ParticipantNumber}</td>\
                     </tr>\
                     <tr>\
                        <th scope="row">'+ Util.getTrans('_mobileNo') + '</th>\
                        <td>${$data.Mobile} / ${$data.Phone}</td>\
                     </tr>\
                      <tr>\
                        <th scope="row">'+ Util.getTrans('_email') + '</th>\
                        <td>${$data.Email}</td>\
                     </tr>\
                      <tr>\
                        <th scope="row">'+ Util.getTrans('_licenseNo') + '</th>\
                        <td>${$data.TradeLicenseNumber}</td>\
                    </tr>\
                      <tr>\
                        <th scope="row">'+ Util.getTrans('_location') + '</th>\
                        <td>${$data.EmirateAr} / ${$data.EmirateEn} , ${$data.Area}   - ${$data.map}  </td>\
                     </tr>\
                      ' + html;
    tbl = tbl.replace('${$data.NameAr}', $data.NameAr)
        .replace('${$data.NameEn}', $data.NameEn)
        .replace('${$data.EstablishmentTypeNameAr}', $data.EstablishmentTypeNameAr)
        .replace('${$data.ParticipantType}', $data.ParticipantType)
        .replace('${$data.ParticipantNumber}', $data.ParticipantNumber)
        .replace('${$data.Mobile}', $data.Mobile)
        .replace('${$data.Phone}', $data.Phone)
        .replace('${$data.Email}', $data.Email)
        .replace('${$data.TradeLicenseNumber}', $data.TradeLicenseNumber)
        .replace('${$data.EmirateAr}', $data.EmirateAr)
        .replace('${$data.EmirateEn}', $data.EmirateEn)
        .replace('${$data.Area}', $data.Area)
        .replace('${$data.map}', latlng)
        ;
    tbl += '</tbody></table></div></div> ';

    tbl = tbl.replace(/null/gi, '');

    $('#ubody').html(tbl);
}
function disableLoading() {
    pleaseWait(false);
}

//$(document).on("click", ".clearls", function () {
//   // sessionStorage.setItem('inbox_refno', '');
//    // pleaseWait(true);
//});
//function MapEmirates(Eser_EID) {
//    Eser_EID = parseInt(Eser_EID);
//    var Eser_EmirateID = [2, 4, 6, 9, 10, 11, 14];
//    var ins_EmirateID = [1, 2, 3, 4, 7, 6, 5];
//    var index = Eser_EmirateID.indexOf(Eser_EID);
//    if (index >= 0) {
//        return ins_EmirateID[index];
//    }
//}
function MapEmirates(ins_EID) {
    ins_EID = parseInt(ins_EID);
    var Eser_EmirateID = [2, 4, 6, 9, 10, 11, 14];
    var ins_EmirateID = [1, 2, 3, 4, 7, 6, 5];
    var index = ins_EmirateID.indexOf(ins_EID);
    if (index >= 0) {
        return Eser_EmirateID[index];
    }
    return 0;
}
function MapDepts(ins_DeptID) {
    ins_DeptID = parseInt(ins_DeptID);
    var Eser_DepIDList = [1, 2, 3, 4];
    var ins_deptID = [4, 2, 3, 1];
    var index = ins_deptID.indexOf(ins_DeptID);
    if (index >= 0) {
        return Eser_DepIDList[index];
    }
    return 0;
}
function GetEstablishmentSearch() {
    var data = JSON.stringify({
        Name: 'test',
        ID: 2,
        emirateID: 2
    });
    FetchService('POST', config.GetEstablishmentSearch, data, true, function (r) {
        console.log(r);
    });
}


LoadDropDown_Select = function (ddName) {
    var searchTerm = null;
    //var EmirateID = $('#ddEmirate').val();
    config.ajaxloader = false;
    jQuery.support.cors = true;
    // Remote data example
    var remoteDataConfig = {
        width: "100%",
        placeholder: lsUser.inslang === 'ar' ? "البحث عن منشأة" : "Search Establishment..",
        allowClear: false,
        minimumInputLength: 4,
        dropdownCssClass: "bigdrop",
        closeOnSelect: false,
        formatNoMatches: function () {
            return Util.getTrans('_noResultFound');
        },
        formatInputTooShort: function (input, min) {
            var n = min - input.length;
            return lsUser.inslang === 'ar' ? " الرجاء إدخال " + n + " أو أكثر من حرف " : "Please enter " + n + " or more character" + (n == 1 ? "" : "s")
        },
        formatSearching: function () {
            return lsUser.inslang === 'ar' ? "بحث..." : "Searching ...";
        },
        id: function (res) {
            var id = res.ParticipantId == null ? res.ID : res.ParticipantId;
            return id; // use slug field for id
        },
        ajax: {
            url: config.GetEstablishmentSearch,
            dataType: 'json', cache: true, type: 'POST',
            params: {
                contentType: 'application/json; charset=utf-8',
                headers: { 'Authorization': lsUser.token }
            },
            //headers: { 'Authorization': config.Auth_eservices },
            data: function (term, page) {
                return JSON.stringify(
                    {
                        Name: term,
                        ID: MapDepts(selectedVal),
                        emirateID: MapEmirates($('#ddEmirate').val())
                    });
            },
            results: function (data, page) {
                //var data_ = data.d.Data;
                // console.log(data);
                return { results: data.ResponseData };
            }
        },
        formatResult: formatResult,
        formatSelection: formatSelection
        //escapeMarkup: function (m) {
        //    return m;
        //}
    };
    $("#" + ddName).on("select2-removing", function (e) {
        // just in case you need this method to fire on removing the selection
        $("#value_dd").val("");
    });
    function formatResult(res) {
        var n = lsUser.inslang === 'ar' ? res.NameAr : res.NameEn;
        return "<div>" + n + " - " + res.Area + "     <span style='float:left'> " + res.TradeLicenseNumber + "</span></div>";

    }
    function formatSelection(res) {
        // console.log("Select end-----" + JSON.stringify(res));
        ls.est_data = JSON.stringify(res);
        var n = lsUser.inslang === 'ar' ? res.NameAr : res.NameEn;
        var markup = "<div>" + n + " - " + res.Area + "     <span style='float:left'> " + res.TradeLicenseNumber + "</span></div>";
        var id = res.ParticipantId == null && res.ParticipantId == 0 ? res.ID : res.ParticipantId;
        $("#value_dd").val(id);
        GetUpcommingAudits_ByEstablishment(res.ID);
        return markup;
    }

    $("#" + ddName).select2(remoteDataConfig).val('').trigger("change");

};

LoadDropDown_Select_Internal = function (ddName) {
    var searchTerm = null;
    //var EmirateID = $('#ddEmirate').val();
    config.ajaxloader = false;
    jQuery.support.cors = true;
    // Remote data example
    var remoteDataConfig = {
        width: "100%",
        placeholder: lsUser.inslang === 'ar' ? "البحث عن منشأة" : "Search Establishment..",
        allowClear: false,
        minimumInputLength: 4,
        dropdownCssClass: "bigdrop",
        closeOnSelect: false,
        formatNoMatches: function () {
            return Util.getTrans('_noResultFound');
        },
        formatInputTooShort: function (input, min) {
            var n = min - input.length;
            return lsUser.inslang === 'ar' ? " الرجاء إدخال " + n + " أو أكثر من حرف " : "Please enter " + n + " or more character" + (n == 1 ? "" : "s")
        },
        formatSearching: function () {
            return lsUser.inslang === 'ar' ? "بحث..." : "Searching ...";
        },
        id: function (obj) {
            return obj.ID; // use slug field for id
        },
        ajax: {
            url: config.GetEstablisment,
            dataType: 'json', cache: true, type: 'POST',
            params: {
                contentType: 'application/json; charset=utf-8',
                headers: { 'Authorization': lsUser.token }
            },
            //headers: { 'Authorization': config.Auth_eservices },
            data: function (term, page) {
                return JSON.stringify(
                    {
                        NameAr: term,
                        NameEn: term,
                    });
            },
            results: function (data, page) {
                //var data_ = data.d.Data;
                // console.log(data);

                return { results: data.ResponseData };
            }
        },
        formatResult: formatResult,
        formatSelection: formatSelection
        //escapeMarkup: function (m) {

        //    return m;
        //}
    };
    $("#" + ddName).on("select2-removing", function (e) {
        // just in case you need this method to fire on removing the selection
        $("#value_dd").val("");
    });
    function formatResult(res) {
        var tl = res.TradeLicenseNumber == null ? "" : res.TradeLicenseNumber;
        var n = lsUser.inslang === 'ar' ? res.NameAr : res.NameEn;
        return "<div>" + n + "     <span style='float:left'> " + tl + " -- " + res.Area + "</span></div>";
    }
    function formatSelection(res) {
        var tl = res.TradeLicenseNumber == null ? "" : res.TradeLicenseNumber;
        var n = lsUser.inslang === 'ar' ? res.NameAr : res.NameEn;
        var markup = "<div>" + n + "     <span style='float:left'> " + tl + " -- " + res.Area + "</span></div>";
        $("#value_dd").val(res.ID);
        return markup;
    }

    $("#" + ddName).select2(remoteDataConfig).val('').trigger("change");

};

function isEditInspection() {
    if (ls.isEidtInpsection !== null) {
        if (ls.isEidtInpsection === 'false') {
            $(":button").hide();
        }
    }
}

function trans() {
    // Function for swapping dictionaries
    var lang = lsUser.inslang;
    set_lang = function (dictionary) {
        $('[data-tran]').each(function (e, input) {
            var key = input.dataset.tran;
            if (input.localName === "span") {
                $(this).html(dictionary[key]);
            } else
                $(this).attr("placeholder", dictionary[key]);
        });
    };
    // Set initial language to English
    if (lang === "en") {
        set_lang(dictionary.english);
    } else
        set_lang(dictionary.arabic);
}
function ChangeDepartment(e) {
    lsUser.DeptID = e.dataset.id;
    lsUser.DeptNameAr = DepartmentName[parseInt(lsUser.DeptID) - 1].NameAr;
    lsUser.DeptNameEn = DepartmentName[parseInt(lsUser.DeptID) - 1].NameEn;
    window.location.reload(true);
}

//function SetDepartForDualDepartment() {
//    if (lsUser.RoleID == EmployeeRole.Department_Head &&
//        (lsUser.DeptID == Departments.Agricultural_Audit_Section || lsUser.DeptID == Departments.Animal_Inspection_Section)) {
//        var html = '<li><a href="javascript:void(0)" data-id="2" class=" waves-effect waves-block" onclick="ChangeDepartment(this)">\
//                        <i class="material-icons">domain</i>\
//                                <span>'+ DepartmentName[1].NameAr + '</span>\
//                    </a></li>';
//        html += '<li><a href="javascript:void(0)" data-id="4" class=" waves-effect waves-block" onclick="ChangeDepartment(this)">\
//                        <i class="material-icons">domain</i>\
//                                <span>'+ DepartmentName[3].NameAr + '</span>\
//                    </a></li>';
//        $('.selectLang').before(html);
//    }
//}
function isDualDepartmentHead() {
    if (lsUser.RoleID == EmployeeRole.Department_Head &&
        (lsUser.DeptID == Departments.Agricultural_Audit_Section || lsUser.DeptID == Departments.Animal_Inspection_Section)) {
        return true;
    }
    return false;
}

var position = [25.276987, 55.296249];
var final_lat = 0;
var final_lng = 0;
function GoogleMapCallBack() {
    console.log('google api is working.');
}
function LoadMap() {
    // Declare variables at the top
    var map;
    var marker = null;
    var markers = [];
    var infowindow = new google.maps.InfoWindow();
    var final_lat, final_lng;
    var position = [0, 0]; // Initialize position array

    // Check if map container exists
    var mapCanvas = document.getElementById("mapCanvas");
    if (!mapCanvas) {
        console.error("Map container 'mapCanvas' not found");
        return;
    }

    var latlng = new google.maps.LatLng(24, 54);
    var myOptions = {
        zoom: 8,
        center: latlng,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        streetViewControl: false
    };

    // Add mapId only if googleMapId variable exists
    if (typeof googleMapId !== 'undefined') {
        myOptions.mapId = googleMapId;
    }

    map = new google.maps.Map(mapCanvas, myOptions);

    // Create location button
    var controlDiv = document.createElement('DIV');
    controlDiv.style.margin = '10px';

    var firstChild = document.createElement('button');
    firstChild.style.backgroundColor = '#fff';
    firstChild.style.border = 'none';
    firstChild.style.outline = 'none';
    firstChild.style.width = '28px';
    firstChild.style.height = '28px';
    firstChild.style.borderRadius = '2px';
    firstChild.style.boxShadow = '0 1px 4px rgba(0,0,0,0.3)';
    firstChild.style.cursor = 'pointer';
    firstChild.style.marginRight = '10px';
    firstChild.style.padding = '0px';
    firstChild.title = 'Your Location';
    controlDiv.appendChild(firstChild);

    var secondChild = document.createElement('div');
    secondChild.style.margin = '5px';
    secondChild.style.width = '18px';
    secondChild.style.height = '18px';
    secondChild.style.backgroundImage = 'url(https://maps.gstatic.com/tactile/mylocation/mylocation-sprite-1x.png)';
    secondChild.style.backgroundSize = '180px 18px';
    secondChild.style.backgroundPosition = '0px 0px';
    secondChild.style.backgroundRepeat = 'no-repeat';
    secondChild.id = 'location_img';
    firstChild.appendChild(secondChild);

    controlDiv.index = 1;
    map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(controlDiv);

    // Map dragend listener
    google.maps.event.addListener(map, 'dragend', function () {
        $('#location_img').css('background-position', '0px 0px');
    });

    // Location button click handler
    firstChild.addEventListener('click', function () {
        var imgX = '0';
        var animationInterval = setInterval(function () {
            imgX = (imgX === '-18') ? '0' : '-18';
            $('#location_img').css('background-position', imgX + 'px 0px');
        }, 500);

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                function (position) {
                    var latlng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

                    // Create marker if it doesn't exist
                    if (!marker) {
                        marker = createMarker(latlng, map, true);
                    } else {
                        marker.setPosition(latlng);
                    }

                    map.setCenter(latlng);
                    clearInterval(animationInterval);
                    updateMarkerPosition(latlng);
                    $('#location_img').css('background-position', '-144px 0px');
                },
                function (error) {
                    console.error("Geolocation error:", error);
                    clearInterval(animationInterval);
                    $('#location_img').css('background-position', '0px 0px');
                    alert("Unable to get your location: " + error.message);
                },
                {
                    enableHighAccuracy: true,
                    timeout: 10000,
                    maximumAge: 60000
                }
            );
        } else {
            clearInterval(animationInterval);
            $('#location_img').css('background-position', '0px 0px');
            alert("Geolocation is not supported by this browser.");
        }
    });

    // Search box functionality
    var input = document.getElementById('pac-input');
    if (input) {
        var searchBox = new google.maps.places.SearchBox(input);
        map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

        map.addListener('bounds_changed', function () {
            searchBox.setBounds(map.getBounds());
        });

        searchBox.addListener('places_changed', function () {
            var places = searchBox.getPlaces();
            if (places.length === 0) {
                return;
            }

            // Clear old markers
            markers.forEach(function (m) {
                m.setMap(null);
            });
            markers = [];

            var bounds = new google.maps.LatLngBounds();
            places.forEach(function (place) {
                if (!place.geometry) {
                    console.log("Returned place contains no geometry");
                    return;
                }

                // Use standard Marker instead of AdvancedMarkerElement for compatibility
                var newMarker = new google.maps.Marker({
                    map: map,
                    title: place.name,
                    position: place.geometry.location
                });

                markers.push(newMarker);

                // Update main marker
                if (!marker) {
                    marker = createMarker(place.geometry.location, map, true);
                } else {
                    marker.setPosition(place.geometry.location);
                }
                updateMarkerPosition(place.geometry.location);

                if (place.geometry.viewport) {
                    bounds.union(place.geometry.viewport);
                } else {
                    bounds.extend(place.geometry.location);
                }
            });
            map.fitBounds(bounds);
        });
    }

    // Initialize marker based on existing coordinates or geolocation
    var latX = $("input[name='Lat_X']").val();
    var lngY = $("input[name='Lng_Y']").val();

    if (navigator.geolocation && (!latX || latX === "")) {
        console.log("Attempting to get current location...");

        var locationOptions = {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 60000
        };

        // Detect IE and adjust options
        if (/*@cc_on!@*/false || !!document.documentMode) {
            console.log("Using IE detected, adjusting location options");
            locationOptions.enableHighAccuracy = false;
        }

        navigator.geolocation.getCurrentPosition(
            function (p) {
                console.log("Initial location obtained:", p.coords.latitude, p.coords.longitude);
                final_lat = position[0] = p.coords.latitude;
                final_lng = position[1] = p.coords.longitude;

                var initialLatLng = new google.maps.LatLng(final_lat, final_lng);
                geocodePosition(initialLatLng);

                marker = createMarker(initialLatLng, map, true);
                map.setCenter(initialLatLng);
            },
            function (error) {
                console.error("Geolocation failed:", error);
                // Fallback to default location
                var defaultLatLng = new google.maps.LatLng(24, 54);
                marker = createMarker(defaultLatLng, map, true);
                map.setCenter(defaultLatLng);
            },
            locationOptions
        );
    } else if (latX && latX !== '') {
        console.log("Using existing coordinates:", latX, lngY);
        final_lat = parseFloat(latX);
        final_lng = parseFloat(lngY);

        var existingLatLng = new google.maps.LatLng(final_lat, final_lng);
        geocodePosition(existingLatLng);

        marker = createMarker(existingLatLng, map, true);
        map.setCenter(existingLatLng);
    } else {
        console.log("Browser doesn't support location service, using default location.");
        var defaultLatLng = new google.maps.LatLng(24, 54);
        marker = createMarker(defaultLatLng, map, false);
        map.setCenter(defaultLatLng);
    }

    // Set up event listeners after a short delay to ensure marker is created
    setTimeout(function () {
        if (!marker) {
            console.error("Marker not initialized");
            return;
        }

        // Drag events
        google.maps.event.addListener(marker, 'dragstart', function () {
            updateMarkerAddress('...');
        });

        google.maps.event.addListener(marker, 'drag', function () {
            updateMarkerPosition(marker.getPosition());
        });

        google.maps.event.addListener(marker, 'dragend', function () {
            geocodePosition(marker.getPosition());
            map.panTo(marker.getPosition());
        });

        // Map click event
        google.maps.event.addListener(map, 'click', function (e) {
            marker.setPosition(e.latLng);
            updateMarkerPosition(e.latLng);
            geocodePosition(e.latLng);
            map.panTo(e.latLng);
        });

        // Load boundaries if function exists
        if (typeof GetUAEBounderies === 'function') {
            GetUAEBounderies(map);
        }

    }, 1000);
}

// Helper function to create markers
function createMarker(position, map, draggable) {
    // Use standard Marker for better compatibility
    return new google.maps.Marker({
        position: position,
        map: map,
        title: "Latitude:" + position.lat() + " | Longitude:" + position.lng(),
        draggable: draggable !== false
    });
}

// Placeholder functions - make sure these exist in your code
function updateMarkerPosition(latlng) {
    // Implementation needed
    console.log("Marker position updated:", latlng.lat(), latlng.lng());
}

function updateMarkerAddress(address) {
    // Implementation needed
    console.log("Marker address:", address);
}

function geocodePosition(latlng) {
    // Implementation needed
    console.log("Geocoding position:", latlng.lat(), latlng.lng());
}

function geocodePosition(pos) {
    var geocoder = new google.maps.Geocoder();
    geocoder.geocode({
        latLng: pos
    }, function (responses) {
        if (responses && responses.length > 0) {
            updateMarkerAddress(responses[0]);
        } else {
            updateMarkerAddress('Cannot determine address at this location.');
        }
    });
}

function updateMarkerPosition(latLng) {
    //console.log('info', latLng.lat() ,latLng.lng());
    final_lat = latLng.lat();
    final_lng = latLng.lng();
    $("input[name='Lat_X']").val(final_lat);
    $("input[name='Lng_Y']").val(final_lng);
    //console.log(final_lat, final_lng);
}

function updateMarkerAddress(str) {
    console.log('Address', str);
    if (str.geometry) {
        $("input[name='Lat_X']").val(str.geometry.location.lat());
        $("input[name='Lng_Y']").val(str.geometry.location.lng());
    }

}

function transition(result) {
    i = 0;
    deltaLat = (result[0] - position[0]) / numDeltas;
    deltaLng = (result[1] - position[1]) / numDeltas;
    moveMarker();
}

function moveMarker() {
    position[0] += deltaLat;
    position[1] += deltaLng;
    var latlng = new google.maps.LatLng(position[0], position[1]);
    marker.setTitle("Latitude:" + position[0] + " | Longitude:" + position[1]);
    marker.setPosition(latlng);
    if (i !== numDeltas) {
        i++;
        setTimeout(moveMarker, delay);
    }
}

function GetUAEBounderies(map) {
    $.each(uaeBound.features, function (i, v) {
        $.each(v.geometry.paths, function (i, data) {
            var limitCoord = [];
            $.each(data, function (i, v) {
                limitCoord.push(new google.maps.LatLng(v[1], v[0]));
            });
            var boundries = new google.maps.Polyline({
                path: limitCoord,
                strokeColor: "#000",
                strokeOpacity: 0.5,
                strokeWeight: 3,
                geodesic: true,
            });

            boundries.setMap(map);
        });
    });

    $.each(uaeborderInternal.features, function (i, v) {
        $.each(v.geometry.rings, function (i, data) {
            var triangleCoords = [];
            $.each(data, function (i, v) {
                triangleCoords.push(new google.maps.LatLng(v[1], v[0]));
            });
            var Triangle = new google.maps.Polygon({
                paths: triangleCoords,
                strokeColor: '#000',
                strokeOpacity: 0.8,
                strokeWeight: 1,
                fillColor: '#000',
                fillOpacity: 0.0
            });

            Triangle.setMap(map);
        });
    });
}

function initMapSearchBox() {
    var map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: position[0], lng: position[1] },
        zoom: 13,
        mapTypeId: 'roadmap',
        mapId: googleMapId
    });

}

function GetServiceHistory() {
    try {
        var downloadReport = '<a onclick="Download_Pdf_Report_Inspection()" href="#" style="position: absolute;top: 48px;left: 29px;" class="btn btn-default btn-circle waves-effect waves-circle"><img src="images/pdf.png" width="25px"></a>';
        if (Global.ExtRepot) {
            $('#HistoryDataMarkeup').html(downloadReport);
            return false;
        }
        var mup = '<div>\
                        <a class=" waves-effect m-b-15" role="button" data-toggle="collapse" href="#collapseExample" aria-expanded="false" aria-controls="collapseExample">\
                            <span data-tran="_preVisit"></span><span style="vertical-align: text-bottom;"><i class="material-icons">keyboard_arrow_down</i></span>\
                        </a>\
                    </div>\
                    <div class="collapse" id="collapseExample" aria-expanded="true" style="">\
                        <div class="preVisitData well">\
                            <span data-tran="_noResultFound"></span>\
                        </div>\
                    </div>';
        $('#HistoryDataMarkeup').append(downloadReport);
        $('#HistoryDataMarkeup').append(mup);

        var markup = '<table class="table table-responsive">';
        var data = JSON.stringify({ ID: Global.AuditServiceID, EstablishmentID: Global.EstablishmentID, EstablishmentTypeID: Global.EstablishmentTypeID });
        FetchService('post', config.GetAuditHistory, data, true,
            function (r) {
                if (r.IsSuccess) {
                    var res = r.ResponseData;
                    if (res.length > 0) {
                        res.forEach(function (v) {
                            var url = Reports.replace('{0}', btoa(v.ID)).replace('{1}', btoa(v.EstablishmentType_ID))
                                .replace('{2}', btoa(v.Establishment_ID)).replace('{3}', btoa(v.DeptID)).replace('{4}', lsUser.inslang)
                                .replace('{5}', btoa(v.AuditType_ID));
                            markup += '<tr><td>' + Util.getDateSQL(v.SubmissionDate) + '</td><td>' + v.Inspector_Name + '</td><td>' + v.Ref_No + '</td>\
                          <td><a class="waves-effect" href="'+ url + '" target="_blank" >\
                          <span data-tran="_view"></span> <span data-tran="_audit"></span>\
                          </a></td></tr>';
                        });
                    }
                }
                //console.log(r);
                markup += '</table>';
                $('.preVisitData').html(markup);
                trans();
            });
    }
    catch (ex) {
        console.log(ex);
    }
}

function GetImageControl() {
    $('#ImageControl').html('');
    getControl('imageControl', 'ImageControl', function (script, textStatus) {
        $('#ImageControl').html(script);
        setTimeout(function () {
            GetServiceHistory();
            trans();
            if (Global.ExtRepot) {
                $('#fileUpload_div').hide();
            }
        }, 500);
    });
}

function AuditDetailAndWorkflow(ID, mailbox, data) {
    isTeamPlayer = false;

    Global.AuditServiceID = ID;
    Global.IncidentID = 0;
    // Global.EstablishmentID = ID;
    Global.isAuditFormDisable = mailbox != "inbox";

    Global.ProcedureInstanceID = data.ProcedureInstanceID;

    var gps = data.GPS_Cord == null || data.GPS_Cord == "0,0" ? "" : '<a target="_blank" href="https://www.google.com/maps?daddr=' + data.GPS_Cord + '">\
                                                <img src="images/google-maps.png" width="15" />\
                                             </a>' ;
    //var insType = data.InspectionType === null ? "" : data.InspectionType;
    var inspectorName = data.Inspector_Name === null ? "" : data.Inspector_Name;
    var estbName = lsUser.inslang === "ar" ? data.EstablishmentType_NameAr : data.EstablishmentType_NameEn;
    var IsEstab_GPS = data.Establishment_GPS == null || data.Establishment_GPS == '' || data.Establishment_GPS == 0 ?
        '<img class="IconToUpdateGPS" src="images/pin.png" width="15" />' : "";
    var auditType = lsUser.inslang === "ar" ? data.InspectionTypeAr : data.InspectionTypeEn;
    var Establishment_NameAr = data.Establishment_NameAr;
    var Estab_URLData = mailbox == 'reports' ? '<span class="badge animated slideInDown">' + Establishment_NameAr + ' &#183 ' + data.EmirateName + '</span>' : '<a href="javascript:void(0)" onclick="getEstablimentData(' + data.Establishment_ID + ')">' + Establishment_NameAr + ' &#183 ' + data.EmirateName + ' </a><a href="javascript:void(0)" data-id=' + data.Establishment_ID + ' onclick="ShowMapPopUp2(this)">' + IsEstab_GPS + '</a>'
    var pageHTML =
        '<div class="animated fadeIn">\
    <div class="card">\
        <div class="body">\
            <div class="row clearfix">\
                <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">\
                    <ul class="list-group followupDetail">\
                        <li class="list-group-item">\
                            <span data-tran="_audit"></span>  <span class="badge animated slideInDown ">\
                           ' + estbName + '\
                            </span>\
                        </li>\
                        <li class="list-group-item">\
                            <span data-tran="_establishment"></span>\
                            <span class="badge animated slideInDown ">\
                               '+ Estab_URLData + ' \
                            </span>\
                        </li>\
                        <li class="list-group-item">\
                            <span data-tran="_inspector"></span>\
                            <span class="badge animated slideInDown">' + inspectorName + '</span>\
                        </li>\
                    </ul>\
                </div>\
                <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12">\
                    <ul class="list-group followupDetail">\
                        <li class="list-group-item">\
                            <span data-tran="_refNo"></span>\
                            <span class="badge animated slideInDown">' + data.Ref_No + '</span>\
                        </li>\
                        <li class="list-group-item">\
                            <span data-tran="_type"></span>\
                            <span class="badge animated slideInDown ">' + auditType + '</span>\
                        </li>\
                         <li class="list-group-item">\
                            <span data-tran="_visitNo"></span>\
                            <span class="badge animated slideInDown ">' + data.Visit_No + '</span>\
                        </li>\
                        <li class="list-group-item">\
                            <span data-tran="_createdDate"></span>\
                            <span class="badge animated slideInDown ltr ">' + Util.getDateSQL(data.ExpectedDateTime_Start) + '</span>\
                        </li>';
    if (data.SubmissionDate != null) {
        pageHTML += '<li class="list-group-item"><span data-tran="_dateSubmitted"></span> <span class="badge animated slideInDown ltr" >' + Util.getDateSQL(data.SubmissionDate) + '</span></li>';
    }
    pageHTML += '</ul>\
                </div>\
                <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12">\
                    <ul class="list-group">\
                        <li class="list-group-item">\
                           <span data-tran="_cordinates"></span>\
                           <span class="cus badge animated slideInDown ">\
                               ' + gps + '\
                            </span>\
                       </li>';

    if (data.Inspector_Name !== null && data.RiskLevel_ID !== null && data.AuditType_ID != AuditType.taqeem) {
        var riskname = lsUser.inslang === "ar" ? data.RiskLevel_NameAr : data.RiskLevel_NameEn;
        if (data.AuditType_ID == AuditType.inspection) {
            riskname = data.RiskLevel_ID == RiskLevelID.LowRisk ? '<span data-tran="_aprove">' : '<span data-tran="_reject">';
        }

        pageHTML += '<li class="list-group-item"><span data-tran="_riskLevel"></span> <span class="badge animated slideInDown" style="background-color: ' + data.RiskColor + ';color:white!important;">' + riskname + '</span></li>';
    }


    if (data.Total_Points !== null && data.Total_Points !== "") {
        if (parseInt(data.Total_Points) > 0) {
            var ifTaqeem = data.AuditType_ID == AuditType.taqeem && data.Rating != null ? 'color:white !important;background-color:' + Util.GetGradeColor(data.Rating.trim()) : '';

            pageHTML += data.Rating === null ? '' : '<li class="list-group-item"><span data-tran="_rating" ></span> <span class="badge animated slideInDown" style="' + ifTaqeem + '">' + data.Rating + '</span></li>';
            pageHTML += '<li class="list-group-item"><span data-tran="_total"></span> <span class="badge animated slideInDown">' + data.Total_Points + '</span></li>';

            if (data.Auto_Remarks != null && data.Auto_Remarks != '') {
                pageHTML += '<li class="list-group-item">\
                        <span data-tran="_avarageRating"></span>\
                        <span class=" badge animated slideInDown">' + data.Auto_Remarks + '</span>\
                    </li>';
            }
        }
    }

    pageHTML += '</ul>\
    </div>';
    //configure the Team people here.
    if (data.Audit_TeamPlayer.length > 0) {
        var employeeTeam = Array.prototype.map.call(data.Audit_TeamPlayer, function (v) { return v.EmployeeName; }).join(",");

        pageHTML += '<div class="col-md-12 col-sm-12 col-xs-12">\
                        <b><span data-tran="TeamMembers"></span></b>&nbsp;&nbsp;&nbsp;\
                        <span class=" badge animated slideInDown">' + employeeTeam + '</span>\
                    </div>';
    }
    var comments = data.Remarks === null || data.Remarks === "" ? "" : data.Remarks;
    var shortComments = data.Remarks === null || data.Remarks === "" ? "" : data.Remarks.substr(0, data.Remarks.length > 50 ? 50 : data.Remarks.length);
    pageHTML += '<div class="col-lg-6 col-md-6 col-sm-6 col-xs-6 p-b-10">\
                <b><span data-tran="_detial"></span></b>&nbsp;&nbsp;&nbsp;\
                <span class="badge animated slideInDown" data-toggle="tooltip" data-placement="top" title=""\
                      data-original-title="' + comments + '">\
                   ' + shortComments + '...\
                </span><br />\
            </div>';
    if (data.PreviousAuditServiceID != null) {
        pageHTML += '<div class="col-lg-6 col-md-6 col-sm-6 col-xs-6 p-b-10">\
                         <div id="PreviousReport"></div><br />\
                    </div>';
    }
    pageHTML += '<div class="col-md-12 col-sm-12 col-xs-12">\
        <table class="table table-responsive" style="font-size: 11px;">\
            <tr style="background : #ddd; color: #333;">\
                <th ><span data-tran="_date" ></span> </th>\
                <th><span data-tran="_from"></span> </th>\
                <th><span data-tran="_to"></span>  </th>\ <th><span data-tran="_status"></span>  </th>\
                <th><span data-tran="_comment"></span>   </th>\
            </tr>';
    $.each(data.Audit_Workflow, function (i, v) {
        var status = Util.Localize(v.StatusNameAr, v.StatusNameEn);
        var statusColor = v.StatusColor;
        pageHTML += '<tr>\
                        <td>' + Util.getDateSQL(v.CreatedDate) + '</td>\
                        <td>' + v.Report_From_Name + '</td>\
                        <td>' + v.Report_To_Name + '</td>\
                        <td><span class="label ' + statusColor + ' " > ' + status + '</span></td>\
                        <td>' + v.Comments + '</td>\
                    </tr>';
    });
    pageHTML += '</table>\
        </div>\
        </div>\
        </div>\
        </div>\
        </div>';


    return pageHTML;
}

var ItemCountDashboard = {
    getEmployee: function () {
        FetchService('post', config.GetEmployeeDashboard, JSON.stringify({}), true, function (r) {
            if (r.IsSuccess) {
                var data = r.ResponseData;
                console.log(data);
                ss.allcount = JSON.stringify(data);
                ItemCountDashboard.ShowNotification(data);
            }
        });
    },
    ShowNotification: function (data) {
        Global.Incident.inbox = data.BalaghatCount.inboxCount;
        Global.Incident.sent = data.BalaghatCount.sentCount;
        Global.InboxCount = data.ServiceCount.inboxCount;

        ItemCountDashboard.ShowHideBadge('.mailboxNumberClass', data.ServiceCount.inboxCount);
        ItemCountDashboard.ShowHideBadge('.incidentNumberClass', data.BalaghatCount.inboxCount);
    },
    GetNotificationBadges: function () {
        if (ss.allcount != null) {
            var data = JSON.parse(ss.allcount);
            ItemCountDashboard.ShowNotification(data);
        }
    },
    ShowHideBadge: function (div, total) {
        $(div).hide();
        if (total > 0 && total < 99) {
            $(div).addClass('notificationClass');
            $(div).html("   " + total);
            $(div).show();
        }
        else if (total > 99) {
            $(div).addClass('notificationClass');
            $(div).html("99+");
            $(div).show();
        }
    }
};

var envBalaghData = new Object();
var fishBalaghData = new Object();
function getImages_incident(mailbox) {

    getControl('imageControl', 'ImageControl' + mailbox, function (script, textStatus) {
        $('#ImageControl_' + mailbox).html(script);
        setTimeout(function () {
            trans();
            if (mailbox == "reports") {
                $('#fileUpload_div').hide();
            }
        }, 50);
    });
}
function GetDetail_Incidents(DivLoadControl, ID, mailbox, data) {
    Global.IncidentID = ID;
    Global.AuditServiceID = 0;
    envBalaghData = new Object();
    fishBalaghData = new Object();
    isTeamPlayer = false;

    var pageHTML = '<div class="animated fadeIn">\
    <div class="card">\
        <div class="body">\
            <div class="row clearfix">\
                <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">\
                    <ul class="list-group followupDetail">\
                        <li class="list-group-item">\
                            <span data-tran="_Name"></span>\
                            <span class="badge animated slideInDown">' + data.ReporterName + '</span>\
                        </li>\
                         <li class="list-group-item">\
                            <span data-tran="_mobileNo"></span>\
                            <span class="badge animated slideInDown">' + data.ReporterMobileNo + '</span>\
                        </li>\
                         <li class="list-group-item">\
                            <span data-tran="_email"></span>\
                            <span class="badge animated slideInDown">' + data.Email + '</span>\
                        </li>\
                        <li class="list-group-item">\
                            <span data-tran="_incidentNo"></span>\
                            <span class="badge animated slideInDown">' + data.IncidentNo + '</span>\
                        </li>\
                        <li class="list-group-item">\
                            <span data-tran="_incidentTitle"></span>\
                            <span class="badge animated slideInDown">' + data.IncidentTitle + '</span>\
                        </li>\
                        <li class="list-group-item">\
                            <span data-tran="_comment" style="font-weight: bold;color: #bb8031;"> </span>: <span class=" animated slideInDown " style="font-weight: 100">\
                           ' + data.Comments + '\
                            </span>\
                        </li>\
                         <li class="list-group-item"><span data-tran="_date"></span><span class="badge animated slideInDown">' + Util.getDateForTextbox(data.IncidentDate) + '</span></li>\
                    </ul>\
                </div>';

    //form for inspector to reply
    if ((mailbox == 'inbox_incident') || (data.ReplyDate != null && data.ReplyDate != '')) {
        debugger;
        var observation = data.ObservationAfterStudy == null ? '' : data.ObservationAfterStudy;
        var reason = data.Reason == null ? '' : data.Reason;
        var res2Customer = data.ResponseToCustomer == null ? '' : data.ResponseToCustomer;
        var rlID = data.RiskLevelID == null ? '0' : data.RiskLevelID;
        var roID = data.ReplyOptionID == null ? '0' : data.ReplyOptionID;
        var isdisable = mailbox == 'inbox_incident' ? '' : 'disabled';
        //var DeptIDofDptHead = data.Audit_Workflow[0].DeptID_To;

        pageHTML += Envrionment_Data.EnvBalaghContorl(isdisable, data);
        pageHTML += Fisheries_Data.FisheriesBalaghContorl(isdisable, data);

        pageHTML += '<div class="col-md-6">\
                        <b> <span data-tran="_studyResultText"></span></b>\
                        <div class="input-group">\
                            <span class="input-group-addon">\
                                <i class="material-icons">web_asset</i><span class="pl-red"> *</span>\
                            </span>\
                            <div class="form-line">\
                                <select '+ isdisable + ' class="form-control chzn-select" id="ddReplyOption"  ></select>\
                            </div>\
                        </div>\
                     </div>\
                     <div class="col-md-6">\
                        <b> <span data-tran="_risk"></span></b>\
                        <div class="input-group">\
                            <span class="input-group-addon">\
                                <i class="material-icons">location_city</i><span class="pl-red"> *</span>\
                            </span>\
                            <div class="form-line">\
                                <select '+ isdisable + ' class="form-control chzn-select" id="ddRiskLevel" ></select>\
                            </div>\
                        </div>\
                     </div>\
                    <div class="col-md-12">\
                        <b> <span data-tran="_observationAfterStudy"></span></b >\
                        <div class="input-group">\
                            <span class="input-group-addon">\
                                <i class="material-icons">short_text</i><span class="pl-red">*</span>\
                            </span>\
                            <div class="form-line">\
                                <textarea '+ isdisable + ' type="text" class="form-control" name="Comments" id="ObservationAfterStudy" rows="4" cols="100" required>' + observation + '</textarea>\
                            </div>\
                        </div>\
                    </div>\
                    <div class="col-md-12">\
                        <b> <span data-tran="_reason"></span></b>\
                        <div class="input-group">\
                            <span class="input-group-addon">\
                                <i class="material-icons">short_text</i><span class="pl-red">*</span>\
                            </span>\
                            <div class="form-line">\
                                <textarea '+ isdisable + ' type="text" class="form-control" name="Comments" id="Reason" rows="4" cols="100" required>' + reason + '</textarea>\
                            </div>\
                        </div>\
                    </div>\
                    <div class="col-md-12">\
                        <b> <span data-tran="_responseToCustomer"></span></b >\
                        <div class="input-group">\
                            <span class="input-group-addon">\
                                <i class="material-icons">short_text</i><span class="pl-red"> *</span>\
                            </span>\
                            <div class="form-line">\
                                <textarea '+ isdisable + ' type="text" class="form-control" name="Comments" id="ResponseToCustomer" rows="4" cols="100" required>' + res2Customer + '</textarea>\
                            </div>\
                        </div>\
                    </div>\
                    ';
        setTimeout(function () {
            app.LoadDropdown('ddRiskLevel', config.getRiskLevel + "?id=0", null, true, Util.getTrans('_risk'), function (r) {
                $('#ddRiskLevel').val(rlID.toString());
                Util.updateDropDown('ddRiskLevel');
            });
            app.LoadDropdown('ddReplyOption', config.getReplyOption + "?id=0", null, true, Util.getTrans('_studyResult'), function (r) {
                $('#ddReplyOption').val(roID.toString());
                Util.updateDropDown('ddReplyOption');
            });

        }, 300);
    }

    pageHTML += '<div class="col-md-12 col-sm-12 col-xs-12">\
    <table class="table table-responsive">\
        <tr style="background : #ddd; color: #333;">\
            <th><span data-tran="_date"></span> </th>\
            <th><span data-tran="_from"></span> </th>\
            <th><span data-tran="_to"></span>  </th><th><span data-tran="_status"></span>  </th>\
            <th><span data-tran="_comment"></span>   </th>\
        </tr>';
    $.each(data.Audit_Workflow, function (i, v) {
        var status = Util.Localize(v.StatusNameAr, v.StatusNameEn);
        var statusColor = v.StatusColor;
        pageHTML += '<tr>\
                        <td>' + Util.getDateSQL(v.CreatedDate) + '</td>\
                        <td>'+ v.Report_From_Name + '</td>\
                        <td>'+ v.Report_To_Name + '</td>\
                        <td><span class="label ' + statusColor + ' " > ' + status + '</span></td>\
                        <td>' + v.Comments + '</td>\
                    </tr>';

    });
    pageHTML += '</table>\
        </div>\
        </div>\
        </div>\
        </div>\
        </div>';

    pageHTML += ' <div id="ImageControl_' + mailbox + '" class="card"></div>';

    if (lsUser.RoleID != EmployeeRole.Department_Staff && lsUser.RoleID != EmployeeRole.CustomerService && mailbox == 'inbox_incident') {
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

    if (mailbox === 'inbox_incident' && data.Audit_Workflow[data.Audit_Workflow.length - 1].Report_To_ID == lsUser.UserID) {
        pageHTML += '<div class="col-md-12">\
                    <div class="input-group">\
                        <span class="input-group-addon">\
                            <i class="material-icons">comment</i><span class="pl-red"> *</span>\
                        </span>\
                        <div class="form-line">\
                            <textarea id="commentsID_' + mailbox + '" name="Comments" class="form-control no-resize" rows="4" data-tran="_comment"></textarea>\
                        </div>\
                    </div>\
                </div>\
                <div class="col-md-12 col-sm-12">\
                    <div class="input-group">\
                        <div class="">';

        if (lsUser.RoleID != EmployeeRole.Department_Staff) {
            pageHTML += ' <button class="btn bg-orange waves-effect" style="display:none" id="SendByDeptHead" data-mailbox="' + mailbox + '"  data-id="' + data.ID + '" type="button" name="SendIt" value="SendIt" onclick="SubmitFollowUp(this)">\
                                <span data-tran="_sendIt"></span>\
                            </button>&nbsp;';
            if ((data.InspectorID !== null && data.InspectorID !== '') || lsUser.RoleID == EmployeeRole.Department_Head) {
                pageHTML += '<button class="btn bg-light-green waves-effect" data-mailbox="' + mailbox + '" data-id="' + data.ID + '"  type="button" name="ApproveIt" value="ApproveIt" onclick="SubmitFollowUp(this)">\
                                <span data-tran="_approved"></span>\
                            </button>&nbsp;';
            }
        }
        if (lsUser.RoleID == EmployeeRole.Department_Staff) {
            pageHTML += '<button class="btn bg-green waves-effect" data-mailbox="' + mailbox + '" data-id="' + data.ID + '"  type="button" name="CompleteIt" value="CompleteIt" id="CompleteIt" onclick="SubmitFollowUp(this)">\
                            <span data-tran="_completeIt"></span>\
                        </button>&nbsp;';
        }

        pageHTML += '<button class="btn bg-orange waves-effect" id="ReturnByDeptHead" data-mailbox="' + mailbox + '" data-id="' + data.ID + '"  type="button" name="ReturnIt" value="ReturnIt" id="ReturnIt" onclick="SubmitFollowUp(this)">\
                        <span data-tran="_return"></span>\
                    </button>&nbsp;';

        if (lsUser.RoleID == EmployeeRole.CustomerService || lsUser.RoleID == EmployeeRole.Department_Head) {
            pageHTML += '<button class="btn bg-red waves-effect" data-mailbox="' + mailbox + '" data-id="' + data.ID + '"  type="button" name="DeleteIt" value="DeleteIt" id="DeleteIt" onclick="DeleteFollowUp(this)">\
                            <i class="material-icons">close</i> <span data-tran="_delete"></span> \
                        </button>&nbsp;';
        }
        pageHTML += ' \
            </div>\
            </div>\
            </div>\
        </div>';
    } else {
        if (data.Audit_Workflow[0].Report_From_ID == lsUser.UserID) {
            pageHTML += '<button class="btn bg-red waves-effect" data-mailbox="' + mailbox + '" data-id="' + data.ID + '"  type="button" name="DeleteIt" value="DeleteIt" id="DeleteIt" onclick="DeleteFollowUp(this)">\
                            <i class="material-icons">close</i> <span data-tran="_delete"></span> \
                        </button>&nbsp;';
        }
    }

    pageHTML += '</div>\
        </div>\
</div>';

    $(DivLoadControl).html(pageHTML);
    $('[data-toggle="tooltip"]').tooltip({ container: 'body' });

    if (data.Audit_Attachment.length > 0) {
        ss.ins_img = JSON.stringify(data.Audit_Attachment);
    }
    else {
        ss.removeItem('ins_img');
    }

    getImages_incident(mailbox);
    Util.updateFromToDates();
    Envrionment_Data.EnvBalaghLoadControls();
    Fisheries_Data.FisheriesBalaghLoadControls();
    if (mailbox == "reports") {
        $('#fileUpload_div').hide();
        $('#btnGroups_reports').hide()
    }
    trans();
}
var Envrionment_Data = {

    EnvBalaghLoadControls: function () {
        debugger;

        console.log(envBalaghData);
        if (Util.IsObjectEmpty(envBalaghData)) { return false; }
        var cs = $("input[name='rbgComm'][value='" + envBalaghData.CommunicationSubject + "']").prop('checked', true);
        if (cs.length == 0 && envBalaghData.CommunicationSubject != undefined) {
            Envrionment_Data.CommSubject.ShowHideTextbox_Other({ id: "commSub_c5" });
            Envrionment_Data.CommSubject.SetCommSubjectCheckboxValue(envBalaghData.CommunicationSubject);
        }
        cs = $("input[name='rbgCommFreq'][value='" + envBalaghData.CommunicationFrequency + "']").prop('checked', true);
        if (cs.length == 0 && envBalaghData.CommunicationFrequency != undefined) {
            Envrionment_Data.CommFrequency.ShowHideTextbox({ id: "commFeq_f2" });
            Envrionment_Data.CommFrequency.SetCheckboxValue(envBalaghData.CommunicationFrequency);
        }
        $("input[name='rbgCommTime'][value=" + envBalaghData.CommunicationTime + "]").prop('checked', true);
        $('#txt_AuditTeamNotes').val(envBalaghData.AuditTeamNotes);
        $("input[name='rbgAuthorContactd'][value=" + envBalaghData.IsAuthorContacted + "]").prop('checked', true);
        $('#chk_CopyofCommSubmittedToAuthority').prop('checked', envBalaghData.ReportCopySubmittedAuthority);
        if (envBalaghData.ReportCopySubmittedAuthority) {
            $('.hasAuthorContacted_Yes').show();
            $('#txt_nameOfPersonContactByAuthority').val(envBalaghData.PersonNameToContactInAuthority);
            $('#txt_dateComplaintSubmitted').val(envBalaghData.DateReprotComplaintSubmittedToAuthority == undefined ? '' : Util.getDateForTextbox(envBalaghData.DateReprotComplaintSubmittedToAuthority));
            $('#txt_dateOfFollowup').val(envBalaghData.FollowUpDatesWithCompetentAuthority == undefined ? '' : Util.getDateForTextbox(envBalaghData.FollowUpDatesWithCompetentAuthority));
        }
    },

    EnvBalaghContorl: function (isdiabled, data) {
        var html = '';
        if (lsUser.DeptID == Departments.Environmental_Audit_Section) {

            envBalaghData = {
                CommunicationFrequency: data.EnvBalagh.CommunicationFrequency,
                CommunicationSubject: data.EnvBalagh.CommunicationSubject,
                CommunicationTime: data.EnvBalagh.CommunicationTime,
                IsAuthorContacted: data.EnvBalagh.IsAuthorContacted,
                ReportCopySubmittedAuthority: data.EnvBalagh.ReportCopySubmittedAuthority,
                PersonNameToContactInAuthority: data.EnvBalagh.PersonNameToContactInAuthority,
                DateReprotComplaintSubmittedToAuthority: data.EnvBalagh.DateReprotComplaintSubmittedToAuthority,
                FollowUpDatesWithCompetentAuthority: data.EnvBalagh.FollowUpDatesWithCompetentAuthority,
                AuditTeamNotes: data.EnvBalagh.AuditTeamNotes,
            };

            //if (!Util.IsObjectEmpty(envBalaghData)) {
            html += '<div class="col-md-12">\
                        <b> <span data-tran="_CommSubject"></span></b>\
                        <div class="input-group">\
                            <span class="input-group-addon">\
                                <i class="material-icons">web_asset</i><span class="pl-red">*</span>\
                            </span>\
                            <div class="form-line">\
                                '+ Envrionment_Data.CommSubject.GetCommSubjectCheckbox(isdiabled) + '\
                            </div>\
                        </div>\
                    </div>\
                    <div class="col-md-6">\
                        <b> <span data-tran="_CommFreq"></span></b>\
                        <div class="input-group">\
                            <span class="input-group-addon">\
                                <i class="material-icons">web_asset</i><span class="pl-red">*</span>\
                            </span>\
                            <div class="form-line">\
                               '+ Envrionment_Data.CommFrequency.GetCommFreqHTML(isdiabled) + '\
                            </div>\
                        </div>\
                    </div>\
                    <div class="col-md-6">\
                        <b> <span data-tran="_commTime"></span></b>\
                        <div class="input-group">\
                            <span class="input-group-addon">\
                                <i class="material-icons">web_asset</i><span class="pl-red">*</span>\
                            </span>\
                            <div class="form-line">\
                               '+ Envrionment_Data.CommTime.GetCommTimeHTML(isdiabled) + '\
                            </div>\
                        </div>\
                    </div>\
                    <div class="col-md-12">\
                        <b> <span data-tran="_hasAuthorContacted"></span></b>\
                        <div class="input-group">\
                            <span class="input-group-addon">\
                                <i class="material-icons">web_asset</i><span class="pl-red">*</span>\
                            </span>\
                            <div class="form-line">\
                                    '+ Envrionment_Data.AuthorContacted.GetHTML(isdiabled) + '\
                            </div>\
                        </div>\
                    </div>\
                    <div class="col-md-6 hasAuthorContacted_Yes" style="display:none"><b> <span></span></b>\
                       <div class="input-group">\
                            <span class="input-group-addon">\
                                <i class="material-icons">web_asset</i><span class="pl-red">*</span>\
                            </span>\
                            <div class="form-line">\
                                  <input '+ isdiabled + ' type="checkbox" id="chk_CopyofCommSubmittedToAuthority" class="chk-col-green"><label for="chk_CopyofCommSubmittedToAuthority"></label> <b> <span data-tran="_copyOfCommSumittedToAutiority"></span></b>\  \
                            </div>\
                        </div>\
                    </div>\
                    <div class="col-md-6 hasAuthorContacted_Yes" style="display:none">\
                        <b> <span data-tran="_nameOfPersonContactByAuthority"></span></b>\
                        <div class="input-group">\
                            <span class="input-group-addon">\
                                <i class="material-icons">web_asset</i><span class="pl-red">*</span>\
                            </span>\
                            <div class="form-line">\
                                     <input '+ isdiabled + ' type="text" id="txt_nameOfPersonContactByAuthority"  class="form-control"  > \
                            </div>\
                        </div>\
                    </div>\
                     <div class="col-md-6 hasAuthorContacted_Yes" style="display:none">\
                        <b> <span data-tran="_dateComplaintSubmitted"></span></b>\
                        <div class="input-group">\
                            <span class="input-group-addon">\
                                <i class="material-icons">web_asset</i><span class="pl-red">*</span>\
                            </span>\
                            <div class="form-line">\
                                     <input '+ isdiabled + ' type="text" id="txt_dateComplaintSubmitted"  class="form-control datepicker"  > \
                            </div>\
                        </div>\
                    </div>\
                    <div class="col-md-6 hasAuthorContacted_Yes" style="display:none">\
                        <b> <span data-tran="_dateOfFollowup"></span></b>\
                        <div class="input-group">\
                            <span class="input-group-addon">\
                                <i class="material-icons">web_asset</i><span class="pl-red">*</span>\
                            </span>\
                            <div class="form-line">\
                                     <input '+ isdiabled + ' type="text" id="txt_dateOfFollowup"  class="form-control datepicker"  > \
                            </div>\
                        </div>\
                    </div>\
                    <div class="col-md-12">\
                        <b> <span data-tran="_auditTeamNotes"></span></b>\
                        <div class="input-group">\
                            <span class="input-group-addon">\
                                <i class="material-icons">web_asset</i><span class="pl-red">*</span>\
                            </span>\
                            <div class="form-line">\
                                    <textarea '+ isdiabled + ' id="txt_AuditTeamNotes" name="txt_AuditTeamNotes" class="form-control no-resize" rows="4" data-tran="_comment"></textarea>\
                            </div>\
                        </div>\
                    </div>';
        }
        //}
        return html;
    },

    AuthorContacted: {
        GetHTML: (isdiable) => {
            var html = '';
            var Comm = [{ id: 1, val: Util.getTrans('_yes') }, { id: 2, val: Util.getTrans('_no') }];
            Comm.forEach((v) => {
                html += '<input ' + isdiable + ' onclick="Envrionment_Data.AuthorContacted.ShowHideTextbox(this)" type="radio" id="authCont_' + v.id + '" name="rbgAuthorContactd" value="' + v.id + '"><label for= "authCont_' + v.id + '">' + v.val + '</label>';
            });
            return html;
        },
        ShowHideTextbox: (e) => {
            if (e.id == "authCont_1") {
                $('.hasAuthorContacted_Yes').show();
            } else {
                $('.hasAuthorContacted_Yes').hide();
            }
        },
        GetCheckboxValue: () => {
            return $("input[name='rbgAuthorContactd']:checked").val();
        },
        Validate: () => {
            if ($("input[name='rbgAuthorContactd']:checked").val() == undefined) {
                return false;
            }
            return true;
        }
    },

    CommTime: {
        GetCommTimeHTML: (isdiable) => {
            var html = '';
            var Comm = [{ id: 1, val: Util.getTrans('_dayTime') }, { id: 2, val: Util.getTrans('_eveningTime') }];
            Comm.forEach((v) => {
                html += '<input ' + isdiable + ' type="radio" id="commTime_' + v.id + '" name="rbgCommTime" value="' + v.id + '"><label for= "commTime_' + v.id + '">' + v.val + '</label>';
            });
            return html;
        },
        GetCheckboxValue: () => {
            return $("input[name='rbgCommTime']:checked").val();
        },
        Validate: () => {
            if ($("input[name='rbgCommTime']:checked").val() == undefined) {
                return false;
            }
            return true;
        }
    },

    CommFrequency: {
        GetCommFreqHTML: (isdiable) => {
            var html = '';
            var Comm = [{ id: 'f1', val: Util.getTrans('_firstTime') }, { id: 'f2', val: Util.getTrans('_repeated') }];
            Comm.forEach((v) => {
                html += '<input ' + isdiable + ' onclick="Envrionment_Data.CommFrequency.ShowHideTextbox(this)" type="radio" id="commFeq_' + v.id + '" name="rbgCommFreq" value="' + v.id + '"><label for= "commFeq_' + v.id + '">' + v.val + '</label>';
            });
            html += '<input ' + isdiable + ' style="display:none" type="number" value="" class="form-control warning" id="comFreq_others"  placeholder="' + Util.getTrans('_numberOfRepetition') + '" /> ';

            return html;
        },
        ShowHideTextbox: (e) => {
            if (e.id == "commFeq_f2") {
                $('#comFreq_others').show();
                $('#' + e.id).prop('checked', true);
            } else {
                $('#comFreq_others').hide();
            }
        },
        GetCheckboxValue: () => {
            if ($('#comFreq_others').css('display') == "none") {
                return 1; //first time occur.
            }
            return $('#comFreq_others').val();
        },
        SetCheckboxValue: (txt) => {
            $('#comFreq_others').val(txt);
        },
        Validate: () => {
            if ($('#comFreq_others').css('display') != "none") {
                if ($('#comFreq_others').val() == "") {
                    return false;
                }
            }
            else if ($("input[name='rbgCommFreq']:checked").val() == undefined) {
                return false;
            }
            return true;
        }
    },

    CommSubject: {
        GetCommSubjectCheckbox: (isdiable) => {
            debugger;
            var html = '';
            var Comm = [{ id: 'c1', val: Util.getTrans('_dustEmission') }, { id: 'c2', val: Util.getTrans('_gasEmission') }
                , { id: 'c3', val: Util.getTrans('_trashFill') }, { id: 'c4', val: Util.getTrans('_suggestion') }, { id: 'c5', val: Util.getTrans('_others') }];

            Comm.forEach((v) => {
                html += '<input ' + isdiable + ' onclick="Envrionment_Data.CommSubject.ShowHideTextbox_Other(this)" type="radio" id="commSub_' + v.id + '" name="rbgComm" value="' + v.id + '"><label for= "commSub_' + v.id + '">' + v.val + '</label>';
            });
            html += '<input ' + isdiable + ' type="text" value="" class="form-control warning" id="comsubj_others" style="display:none" placeholder="' + Util.getTrans('_writeHere') + '" /> ';

            return html;
        },
        ShowHideTextbox_Other: (e) => {
            if (e.id == "commSub_c5") {
                $('#comsubj_others').show();
                $('#' + e.id).prop('checked', true);
            } else {
                $('#comsubj_others').hide();
            }
        },
        GetCommSubjectCheckboxValue: () => {
            if ($('#comsubj_others').css('display') == "none") {
                return $("input[name='rbgComm']:checked").val();
            }
            return $('#comsubj_others').val();
        },
        SetCommSubjectCheckboxValue: (val) => {
            $('#comsubj_others').val(val);
        },
        Validate: () => {
            if ($('#comsubj_others').css('display') != "none") {
                if ($('#comsubj_others').val() == "") {
                    return false;
                }
            }
            else if ($("input[name='rbgComm']:checked").val() == undefined) {
                return false;
            }
            return true;
        }
    },

    GetEnvBalaghData: () => {

        envBalaghData.IncidentDataID = Global.IncidentID;
        envBalaghData.CommunicationSubject = Envrionment_Data.CommSubject.GetCommSubjectCheckboxValue();
        envBalaghData.CommunicationFrequency = Envrionment_Data.CommFrequency.GetCheckboxValue();
        envBalaghData.CommunicationTime = Envrionment_Data.CommTime.GetCheckboxValue();
        envBalaghData.IsAuthorContacted = Envrionment_Data.AuthorContacted.GetCheckboxValue();
        envBalaghData.AuditTeamNotes = $('#txt_AuditTeamNotes').val();

        envBalaghData.ReportCopySubmittedAuthority = $('#chk_CopyofCommSubmittedToAuthority').prop('checked');
        if (envBalaghData.ReportCopySubmittedAuthority) {
            envBalaghData.PersonNameToContactInAuthority = $('#txt_nameOfPersonContactByAuthority').val();
            envBalaghData.DateReprotComplaintSubmittedToAuthority = $('#txt_dateComplaintSubmitted').val();
            envBalaghData.FollowUpDatesWithCompetentAuthority = $('#txt_dateOfFollowup').val();
        }
        return envBalaghData;
    }
};

var Fisheries_Data = {
    FisheriesBalaghContorl: (isdiabled, data) => {
        var html = '';
        if (lsUser.DeptID == Departments.Fisheries_Audit_Section) {

            fishBalaghData = {
                AuthorName: data.FishBalagh.AuthorName,
                EmiratesID: data.FishBalagh.EmiratesID,
                Recommendation: data.FishBalagh.Recommendation,
                ObservedViolation: data.FishBalagh.ObservedViolation,
            };

            html += '<div class="col-md-6" >\
                        <b> <span data-tran="_emirate"></span></b>\
                        <div class="input-group">\
                            <span class="input-group-addon">\
                                <i class="material-icons">web_asset</i><span class="pl-red">*</span>\
                            </span>\
                            <div class="form-line">\
                                <select '+ isdiabled + ' class="form-control chzn-select" id="ddEmirate_fish" name="EmirateId"></select>\
                            </div>\
                        </div></div>';
            html += '<div class="col-md-12"  >\
                        <b> <span data-tran="_recommendation"></span></b>\
                        <div class="input-group">\
                            <span class="input-group-addon">\
                                <i class="material-icons">person</i><span class="pl-red">*</span>\
                            </span>\
                            <div class="form-line">\
                               <textarea '+ isdiabled + ' type="text" class="form-control" name="Comments" id="txt_Recommendation" rows="2" cols="100"></textarea> \
                            </div>\
                        </div>\
                    </div>';
            html += '<div class="col-md-12"  >\
                        <b> <span data-tran="_observedViolation"></span></b>\
                        <div class="input-group">\
                            <span class="input-group-addon">\
                                <i class="material-icons">person</i><span class="pl-red">*</span>\
                            </span>\
                            <div class="form-line">\
                              <textarea '+ isdiabled + ' type="text" class="form-control" name="Comments" id="txt_ObservedViolation" rows="2" cols="100"></textarea>  \
                            </div>\
                        </div>\
                    </div>';
            html += '';
        }
        return html;
    },
    FisheriesBalaghLoadControls: () => {
        console.log(fishBalaghData);
        app.LoadDropdown_Emirates('ddEmirate_fish', Util.getTrans('selectText'), Util.getTrans('_emirate'));
        if (Util.IsObjectEmpty(fishBalaghData)) { return false; }

        $('#txt_Recommendation').val(fishBalaghData.Recommendation);
        $('#txt_ObservedViolation').val(fishBalaghData.ObservedViolation);
        $('#ddEmirate_fish').val(fishBalaghData.EmiratesID);
        Util.updateDropDown('ddEmirate_fish');
    },
    Validate: () => {
        if ($('#ddEmirate_fish').val() == '0' || $('#txt_Recommendation').val() == '' || $('#txt_ObservedViolation').val() == '') {
            return false;
        }
        return true;
    },
    GetFishBalaghData: () => {
        fishBalaghData.IncidentDataID = Global.IncidentID;
        // fishBalaghData.AuthorName = $('#txt_AuthorName').val();
        fishBalaghData.EmiratesID = $('#ddEmirate_fish').val();
        fishBalaghData.Recommendation = $('#txt_Recommendation').val();
        fishBalaghData.ObservedViolation = $('#txt_ObservedViolation').val();
        return fishBalaghData;
    }
};