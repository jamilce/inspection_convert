//var appURL = "https://portal.moccae.gov.ae/sis";
//var Reports = "https://portal-stag/sis/ExtReprots/extreports.html?ser={0}&esttype={1}&est={2}&deptId={3}&lang={4}&auditTypeID={5}";
var Reports = "http://localhost:64378/ExtReprots/extreports.html?ser={0}&esttype={1}&est={2}&deptId={3}&lang={4}&auditTypeID={5}";

var URL_MAIN = "http://localhost:63406/api/";
// var URL_MAIN = 'http://localhost/inspection_api/api/';

//var Exernal_Audit = 'https://172.17.1.193/Services/MOEW_ExternalAudit.svc/';
var Exernal_Audit = 'https://stg.eservices.moccae.gov.ae/api/ExternalAudit/';

var FileServer_URL = 'https://portal.moccae.gov.ae/fileserver/SmartInpsection/uploads/';

var DigitalService_Inspection = 'https://portalstg.moccae.gov.ae/GISDBAPI/api/DigitalServices/';

var logging = {
    debug: false,
    devMode: true,
    liveMode: false,
};
