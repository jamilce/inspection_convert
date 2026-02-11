var error = "<h1>Something wrong happened.Please try again.</h1>";
var lang = 'ar';

$(document).ready(function () {
    console.log("ready!!");
    try {

        if (Util.getParameter('ser') !== '') {
            var ID = atob(Util.getParameter('ser'));
            var estType = atob(Util.getParameter('esttype'));
            var estID = atob(Util.getParameter('est'));
            var deptId = atob(Util.getParameter('deptId'));
            var auditTypeID = Util.getParameter('auditTypeID') == null ? 2 : atob(Util.getParameter('auditTypeID'));
            lang = Util.getParameter('lang') === null ? lang : Util.getParameter('lang');
            localStorage.inslang = lang;

            if (lsUser.token != '') {
                if (IsTokenExpire(lsUser.token)) {
                    localStorage.removeItem('SmartAudit');
                    window.location.reload(true);
                }
            } 
            GetInspectionData(ID, estType, estID, deptId, auditTypeID);
        }
        else {
            $('#mainSection').html(error);
        }

        SetLanguge(lang);
        GeneralSetting(lang);
    } catch (e) {
        $('#mainSection').html(error);
    }

});
function IsTokenExpire(token) {
    var current_time = new Date().getTime() / 1000;
    var expTime = JSON.parse(atob(token.split('.')[1])).exp;
    return current_time > expTime;

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

function GeneralSetting(lang) {
    if (lang === "ar") {
        $('.cssheader2').addClass('navbar-left').removeClass("cssheader2");
        $('.cssheader').addClass('navbar-right').removeClass("cssheader");
    }
    else {
        $('.cssheader').addClass('navbar-left').removeClass("cssheader");
        $('.cssheader2').addClass('navbar-right').removeClass("cssheader2");
    }
}
function GetInspectionData(ID, EstablishmentTypeID, EstID, DeptId, auditTypeID) {
    //debugger;
    Global.EstablishmentTypeID = EstablishmentTypeID;
    Global.AuditServiceID = ID;
    Global.ExtRepot = true;
    Global.isAuditFormDisable = true;
    var deptid = DeptId;
    pleaseWait(true);
    var audTypeID = auditTypeID;
    GetAuditForm(deptid, EstablishmentTypeID, audTypeID);

}

function GetAuditForm(deptid, estTypeID, AuditTypeID) {
    deptid = parseInt(deptid);
    estTypeID = parseInt(estTypeID);
    AuditTypeID = parseInt(AuditTypeID);
    var control = null;
    if (AuditTypeID === 1) {//Audits
        if (deptid === 1) {
            control = 'envAuditControl';
        } else if (deptid === 2) {
            control = 'agriAuditControl';
        }
        else if (deptid === 3) {

            control = estTypeID > 40 && estTypeID < 67 ? 'fishMarketAuditControl' : 'fishAuditControl';
        }
        else if (deptid === 4) {
            control = 'vetAuditControl';
        }
    }
    else if (AuditTypeID === 2) { //Inspection
        if (deptid === 1) {
            control = 'inspection.env.control';
        } else if (deptid === 2) {
            control = 'inspection.agri.control';
        }
        else if (deptid === 3) {
            control = 'inspection.fish.control';
        }
        else if (deptid === 4) {
            control = 'inspection.vet.control';
        }
    }
    else if (AuditTypeID == 3) { // Taqeem
        if (deptid == 1) {
            control = 'envAuditControl';
        }
    }
    getControl(control, 'data', function (script, _textStatus) {
        $('#mainSection').html(script);
        setTimeout(function () {
            trans();
        }, 50);
    });
}


function SetLanguge(lang) {
    if (lang === "ar") {
        LoadStyle('../css/arabic_css.css');
        lang = "ar";
    }
    else {
        $("link[href='../css/arabic_css.css']").remove();
        lang = "en";
    }
}
function ChangeLanguge() {
    if (lang === "ar") {
        $("link[href='../css/arabic_css.css']").remove();
        lang = "en";
    }
    else {
        LoadStyle('../css/arabic_css.css');
        lang = "ar";
    }
    window.location.reload(true);
}

function getControl(page, divToLoad, SuccessCallBack) {
    var v = new Date().getTime();
    var url = "../controls/" + page + ".html?v=" + v;
    $.get(url)
        .done(SuccessCallBack

        ).fail(function (jqxhr, settings, exception) {
            console.log("Controls Error handler....." + exception.toString());
        });
}

var pleaseWait = function (act) {
    if (act) $('.page-loader-wrapper').fadeIn();
    else $('.page-loader-wrapper').fadeOut();
};

function disableLoading() {
    pleaseWait(false);
}
function isEditInspection() {
    if (ls.isEidtInpsection !== null) {
        if (ls.isEidtInpsection === 'false') {
            $(":button").hide();
        }
    }
}

function trans() {
    // Function for swapping dictionaries
    var lang = lang;
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

function GetImageControl() {
    getControl('imageControl', 'ImageControl', function (script, textStatus) {
        $('#ImageControl').html(script);
        setTimeout(function () {
            //GetServiceHistory();
            trans();
            if (Global.ExtRepot) {
                $('#fileUpload_div').hide();
            }
        }, 50);
    });
}