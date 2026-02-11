
//function addScript(url) {
//    var script = document.createElement('script');
//    script.type = 'application/javascript';
//    script.src = url;
//    document.head.appendChild(script);
//}

//$(function () {
//    addScript('js/pdf_report.js');
//})


function General_Report(report_div_id, filename) {
    pleaseWait(true);
    var reportid = report_div_id;
    $('#' + reportid + ' *').filter(':input').each(function (e, input) {
        var ID = input.id;
        if (input.type == "text" || input.type == "textarea") {
            $('#' + ID).replaceWith("<div>" + $('#' + ID).val() + "</div>");
        }
    });

    var element = document.getElementById(reportid);
    var opt = {
        margin: 0.5,
        filename: filename + '.pdf',
        image: { type: 'jpeg', quality: 1 },
        html2canvas: { scale: 3 },
        jsPDF: { unit: 'in', format: 'A2', orientation: 'landscape' },
        // pagebreak: { mode: ['css', 'legacy'], after: '.breakme' }
    };

    // New Promise-based usage:
    html2pdf().set(opt).from(element).save();

    pleaseWait(false);
    // $('#HistoryDataMarkeup').show();
}
function Download_Pdf_Report_Inspection() {
    pleaseWait(true);
    var reportid = "fromCreateAudit";
     
    var filename = Global.EstablishmentName == null ? $('#TopicName_ID').html() : Global.EstablishmentName;
    filename = filename == null ? "Report_" + new Date().getTime() : filename;

    $('#establishmentName').html(Global.EstablishmentName);
    $('#HistoryDataMarkeup').hide(); 

    General_Report(reportid, filename);
}
function Download_Pdf_Report_JSR() {
    pleaseWait(true);
    var reportid = "jsrReportDetail";    
    var filename = "JSRReport_" + new Date().getTime();    

    General_Report(reportid, filename);
}