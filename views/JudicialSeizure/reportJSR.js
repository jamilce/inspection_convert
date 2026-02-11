function getInfo() {
    return "reportJSR.html";
}
var selectedVal;
var isAudit = 0;
var currentPage_inbox = 1;
var numbering = 0;
var pageSize = 20;
function onLoad() {

    $.get(routes.reportJSR, function (data) {
        pleaseWait(true);
        $('#mainSection').html(data);
        setTimeout(function () {
            AfterOnLoad();
            pleaseWait(false);
            trans();
        }, 10);
    });
}

function AfterOnLoad() {
    app.LoadDropdown_Departments('ddDepartment', Util.getTrans('selectText'), Util.getTrans('_department'));
    app.LoadDropdown_Emirates('ddEmirate', Util.getTrans('selectText'), Util.getTrans('_emirate'));
    Util.updateFromToDates();
    currentPage_inbox = 1;
}
function AddNewJSReport() {
    loadScript('views/JudicialSeizure/createJSR');
}

function onchange_ddEmirate(e) {
    var emirateID = typeof (e) == "string" || e == null ? e : e.selectedOptions["0"].value;

}
function onchange_ddDepartment(e) {
    pleaseWait(true);
    selectedVal = e.selectedOptions["0"].value;
    app.LoadEmployee('ddEmployee', config.getEmployee, { DeptID: selectedVal }, Util.getTrans('_employees'));
    pleaseWait(false);
}



//audits Reports
function getData(pg, pageSize) {

    return {
        DeptID: jQuery("#ddDepartment option:selected").val(),
        employeeID: jQuery("#ddEmployee option:selected").val() === undefined ? 0 : jQuery("#ddEmployee option:selected").val(),
        ExpectedDateTime_Start: $('#FromDateTime_gi').val(),
        ExpectedDateTime_End: $('#ToDateTime_gi').val(),
        currentPage: pg,
        pageSize: pageSize,
        Refno: $('#txtRefno').val(),
        EmiratesID: $('#ddEmirate').val(),
    };
}
function SearchReport() {
    $('.table').html('');
    numbering = 0;
    ss.removeItem('JSReports');
    var data = getData(1, pageSize);
    MakeReport(data);

}
function LoadMore() {
    currentPage_inbox = currentPage_inbox + 1;
    var data = getData(currentPage_inbox, pageSize);
    MakeReport(data);
}
function MakeReport(data) {

    pleaseWait(true);
    FetchService('post', config.SearchReportJSR, JSON.stringify(data), true, ReportSuccess, true);
}
function ReportSuccess(res) {
    $('.totalRows').show();

    $('#totalRows').html(res.TotalItems);
    var prevStore = ss.JSReports != null ? JSON.parse(ss.JSReports).concat(res.ResponseData) : res.ResponseData;
    ss.JSReports = JSON.stringify(prevStore);
    var row = [];
    var column = [
        { data: '#', style: "width:2%" },
        { data: Util.getTrans('_refNo'), style: "width:10%" },
        { data: Util.getTrans('_inspector'), style: "width:10%" },
        { data: Util.getTrans('_EstablishmentName'), style: "width:12%" },
        { data: Util.getTrans('_EstablishmentOwnerName'), style: "width:10%" },
        { data: Util.getTrans('_IndustrialLicenseNo'), style: "width:8%" },
        { data: Util.getTrans('_emirate'), style: "width:8%" },
        { data: Util.getTrans('_date'), style: "width:8%" },
        { data: Util.getTrans('_detial'), style: "width:8%" }
    ];

    if (res.IsSuccess && res.ResponseData.length > 0) {
        $('.LoadMore').show();
        console.log(res.ResponseData);
        $.each(res.ResponseData, function (i, v) {
            row.push(
                [
                    ++numbering,
                    v.RefNo,
                    v.CreatedBy,
                    v.EstablishmentName,
                    v.EstablishmentOwnerName,
                    v.IndustrialLicenseNo,
                    v.Lookup_Emirates.NameAr,
                    Util.getDateForTextbox(v.InspectionDate),
                    '<a href="javascript:void(0)" ' + Util.ToolTipLabel('_detial') + ' data-id="' + v.Id + '" onclick="ShowAuditDetail(this)"><i class="material-icons">remove_from_queue</i> </a>   '

                ]);
        });
        var html = res.CurrentPage === 1 ? TableProp.MakeTable(column, row) : TableProp.Rows(row);
        res.CurrentPage === 1 ? $('.table').html(html) : $('.tbody').append(html);
        if (res.TotalPages == 1) {
            $('.LoadMore').hide();
        }
        $('[data-toggle="tooltip"]').tooltip({ container: '#mainSection', html: true });
    } else {
        $('.LoadMore').hide();
    }

}

//end audits Reports

function ShowReprotHTML(v) {
    console.log(v);
    var pageHTML = `<div  >
                <a onclick="Download_Pdf_Report_JSR()" href="#" style="position: absolute;top: calc(100vh - 103vh);left: 24px;" class="btn btn-default btn-circle waves-effect waves-circle"><img src="images/pdf.png" width="25px"></a>

            <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12  m-b-15 header-Topic-jsr">
                 <span class="font-bold" data-tran="_createJSR"></span>
            </div>
          <table class="table table-responsive">  
               <tr>
                  <td><b>${Util.getTrans('_date')}</b></td >
                  <td>${v.InspectionDate.split('T')[0]}</td>
                  <td><b>${Util.getTrans('_time')}</b></td>
                   <td>${v.InspectionDate.split('T')[1].substr(0, 8)}</td>                
               </tr>
               </table>

            <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12  m-b-25  ">
                 <span class="" data-tran="">${(Util.getTrans('_JSR_Text1')).replace('$Name', v.CreatedBy)}</span>
            </div>
             
           <table class="table table-responsive">
              <tr>
                  <td><b>${Util.getTrans('_EstablishmentName')}</b></td >
                  <td>${v.EstablishmentName}</td>
                  <td><b>${Util.getTrans('_IndustrialLicenseNo')}</b></td>
                  <td>${v.IndustrialLicenseNo}</td>                  
              </tr>`;
    if (v.AgriculturalActivityLicenseNo != null) {
        pageHTML += `<tr>
                  <td><b>${Util.getTrans('_AgriculturalActivityLicenseNo')}</b></td>
                  <td>${v.AgriculturalActivityLicenseNo}</td>
                  <td><b>${Util.getTrans('_AgriculturalEngProfessionCertificateNo')}</b></td>
                  <td>${v.AgriculturalEngProfessionCertificateNo}</td>                  
              </tr>`;
    }
    if (v.VeterinaryActivityLicenseNo != null) {
        pageHTML += ` <tr>
                  <td><b>${Util.getTrans('_VeterinaryMedicineProfessionLicenseNo')}</b></td>
                  <td>${v.VeterinaryMedicineProfessionLicenseNo}</td> 
                  <td><b>${Util.getTrans('_VeterinaryActivityLicenseNo')}</b></td>
                  <td>${v.VeterinaryActivityLicenseNo}</td>
              </tr>`;
    }
    pageHTML += `<tr>
                  <td><b>${Util.getTrans('_EstablishmentOwnerName')}</b></td>
                  <td>${v.EstablishmentOwnerName}</td> 
                  <td><b>${Util.getTrans('_emirate')}</b></td>
                  <td>${v.Lookup_Emirates.NameAr}</td>
              </tr>
              <tr>
                  <td><b>${Util.getTrans('_area')}</b></td>
                  <td>${v.Area}</td> 
                  <td><b>${Util.getTrans('_cordinates')}</b></td>
                  <td>${v.XYCoordinates}</td>
              </tr> 
          </table>            
    </div>`;

    var html = `
         <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12  m-b-15  ">
                 <span class="font-bold" data-tran="_JSR_Text2"></span>
            </div>
    <table class="table table-responsive">
                         <thead>
                            <tr>
                                <td>${Util.getTrans('_Name')}</td>
                                <td>${Util.getTrans('_job')}</td> 
                                <td>${Util.getTrans('_Address')}</td>
                                <td>${Util.getTrans('_ContactNo')}</td>
                                <td>${Util.getTrans('_Signature')}</td>
                            </tr>   
                        </thead>  `;
    v.JudicialSeizure_Supervisor.forEach((v) => {
        html += `<tr>
                    <td><span>${v.Name}</a></span> </td>
                     <td>${v.JobTitle}</td>
                     <td>${v.Address}</td>
                     <td>${v.ContactNo}</td>
                     <td><img width="120px" src="${v.Signature}" /></td>
                 </tr>`;
    });
    html += '</table>';
    pageHTML += html;


    if (v.JudicialSeizure_VetViolations.length > 0) {
        html = `
         <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12  m-b-15">
            <span class="font-bold" data-tran="_JSR_Text3"></span>
        </div>
        <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 m-b-5">
            <strong> <span data-tran="_JSR_Text11"></span></strong>
        </div>
       
        <table class="table table-responsive">
                        <thead>
                            <tr>
                                <td>${Util.getTrans('_type')}</td>
                                <td>${Util.getTrans('_Number')}</td> 
                                <td>${Util.getTrans('_Comments_ElectronicChipNumber')}</td>
                            </tr>   
                        </thead>  `;
        v.JudicialSeizure_VetViolations.forEach((v) => {
            html += `<tr>
                    <td><span>${v.Type}</a></span> </td>
                     <td>${v.Number}</td>
                     <td>${v.Notes}</td>
                 </tr>`;
        });
        html += '</table>';

        html += `<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12  m-b-15   ">
            <span class=" " data-tran="_JSR_Text4"></span>
        </div>`;
        pageHTML += html;
    }

    if (v.JudicialSeizure_AgrViolation.length > 0) {
        var html =
        `<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12  m-b-15   ">
            <span class="font-bold" data-tran="_JSR_Text3"></span>
        </div>
        <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 m-b-5  ">
            <strong> <span data-tran="_JSR_Text10"></span></strong>
        </div>
        <table class="table table-responsive">
                        <thead>
                            <tr>
                                <td>${Util.getTrans('_TradeName')}</td>
                                <td>${Util.getTrans('_ActiveMaterial')}</td>
                                <td>${Util.getTrans('_PackageType')}</td>
                                <td>${Util.getTrans('_Number')}</td>
                                <td>${Util.getTrans('_Weight')}</td>
                                <td>${Util.getTrans('_BatchNumber')}</td>
                                <td>${Util.getTrans('_ExpiryDate')}</td>
                                <td>${Util.getTrans('_total')}</td>
                                <td>${Util.getTrans('_ViolationType')}</td>
                            </tr>   
                        </thead>                 
                    `;
        v.JudicialSeizure_AgrViolation.forEach((v) => {
            html += `<tr>
                        <td><span>${v.TradeName}</a></span> </td>
                         <td>${v.ActiveIngredient}</td>
                         <td>${v.PackageType}</td>
                         <td>${v.Number}</td>
                         <td>${v.Weight}</td>
                         <td>${v.BatchNumber}</td>
                         <td>${Util.getDateForTextbox(v.ExpiryDate)}</td>
                         <td>${v.Total}</td>
                         <td>${v.ViolationType}</td>
                     </tr>`;
        });
        html += '</table>';
        html += `<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12  m-b-15 ">
            <span class=" " data-tran="_JSR_Text5"></span>
        </div>`;
        pageHTML += html;
    }

    html = `<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12  m-b-15  ">
            <span class="font-bold" data-tran="_StatementOfViolation"></span>
        </div>

        <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12  m-b-10">
            <span data-tran="_JSR_Text6"></span> <span class="font-bold" >${v.InChargePersonName}</span>
            <span data-tran="InCapacityOf"></span> <span  class="font-bold">${v.InChargePersonCapacity}</span>
            <span data-tran="InContactOf"></span> <span class="font-bold" >${v.InChargePersonContactNo}</span>
        </div>`;
    pageHTML += html;


    html = `<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12  m-b-15  m-t-20 ">
            <span class="font-bold" data-tran="_JSR_Text8"></span>
        </div>
    <table class="table table-responsive">                     
                        <thead>
                            <tr>
                                <td>${Util.getTrans('_JSR_Text9')}</td>
                                <td>${Util.getTrans('_FederalLawYear')}</td>
                            </tr>   
                        </thead> `;
    v.JudicialSeizure_FederalLaw.forEach((v) => {
        html += `<tr>
                        <td><span>${v.LawNo}</a></span> </td>
                        <td>${v.Year}</td>
                     </tr>`;
    });
    html += '</table>';
    pageHTML += html;

    //Attachments

    html = `<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12  m-b-15  m-t-10 header-Topic-jsr">
                <span class="font-bold" data-tran="_attachment"></span>
            </div>
        <table class="table table-responsive">`;
    v.JudicialSeizure_Attachment.forEach((vv) => {
        const fileName = vv.Lookup_AttachmentType.NameEn == "Other" ? vv.OtherText : vv.Lookup_AttachmentType.NameAr;
        //console.log(vv.Audit_Attachment.FilePath)
        html += `<tr>
                    <td><span>${fileName}</a></span> </td>
                    <td><a href="${FileServer_URL + vv.Audit_Attachment.FilePath}" target="_blank"> ${vv.Audit_Attachment.FilePath.split('/')[1]}</a> </td>
                </tr>`;
    });
    html += '</table>';
    pageHTML += html;

    //signatures

    html = `<div class="col-lg-6 col-md-6 col-sm-12 col-xs-12 m-t-10 m-b-15">
                <b><span data-tran="_DefendantSignature"></span> : </b>
                <img src="${v.DefendantSignature}" class="signature-box" />                         
            </div> 
            <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12 m-t-10 m-b-15">
                <b><span data-tran="_PoliceOfficerSignature"></span> : </b>
                <img src="${v.PoliceOfficerSignature}" class="signature-box" />
            </div>`


    html += `<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 m-t-10 m-b-15">
                <b><span data-tran="_comment"></span> : </b>
                <span>${v.Comments}</span>
            </div>`
    pageHTML += html;

    return pageHTML;
}
function ShowAuditDetail(e) {
    var ID = e.dataset.id;
    var data = JSON.parse(ss.getItem('JSReports'));
    data = Util.findInJSONObject(data, { Id: ID })[0];

    var html = ShowReprotHTML(data);
    $('#ubody_AuditDetail').html(`<div id="jsrReportDetail" class=" "><div class="row">${html}</div></div>`);
    trans();
    ShowModal('#model_AuditDetail');
}


//excel and PDF reports management
function GetReportAllData(reportType) {

    const url = config.SearchReportJSR;
    const data = getData(1, 0);
    GetReportDoc(reportType, url, data);

}
function GetReportDoc(reportType, url, data) {
    FetchService('post', url, JSON.stringify(data), true, function (res) {
        if (res.IsSuccess && res.ResponseData.length > 0) {
            if (reportType == 'excel')
                Export2ExcelSheet(res.ResponseData);
            else if (reportType == 'pdf') {
                Export2Pdf(res.ResponseData);
            }
        }
    }, true);
}

function Export2ExcelSheet(xlsRows) {
    const data = [];
    /* XLS Head Columns */
    const xlsHeader = [
        Util.getTrans('_refNo'),
        Util.getTrans('_inspector'),
        Util.getTrans('_EstablishmentName'),
        Util.getTrans('_EstablishmentOwnerName'),
        Util.getTrans('_IndustrialLicenseNo'),
        Util.getTrans('_AgriculturalActivityLicenseNo'),
        Util.getTrans('_AgriculturalEngProfessionCertificateNo'),
        Util.getTrans('_VeterinaryMedicineProfessionLicenseNo'),
        Util.getTrans('_VeterinaryActivityLicenseNo'),
        Util.getTrans('_area'),
        Util.getTrans('_emirate'),
        Util.getTrans('_JSR_Text6'),
        Util.getTrans('InCapacityOf'),
        Util.getTrans('InContactOf'),
        Util.getTrans('_date'),
    ];


    data.push(xlsHeader);
    $.each(xlsRows, function (index, v) {
        var innerRowData = [];

        var val = [
            v.RefNo,
            v.CreatedBy,
            v.EstablishmentName,
            v.EstablishmentOwnerName,
            v.IndustrialLicenseNo,
            v.AgriculturalActivityLicenseNo,
            v.AgriculturalEngProfessionCertificateNo,
            v.VeterinaryMedicineProfessionLicenseNo,
            v.VeterinaryActivityLicenseNo,
            v.Area,
            v.Lookup_Emirates.NameAr,
            v.InChargePersonName,
            v.InChargePersonCapacity,
            v.InChargePersonContactNo,
            Util.getDateForTextbox(v.InspectionDate),
        ];

        $.each(val, function (ind, val) {
            innerRowData.push(val);
        });

        //innerRowData.push(val);
        data.push(innerRowData);
    });

    CreateExcelReport("JSR_Report", data);

}

function CreateExcelReport(reportName, data) {
    console.log(data);
    if (typeof console !== 'undefined') console.log(new Date());
    var wb = XLSX.utils.book_new(),
        ws = XLSX.utils.aoa_to_sheet(data);
    XLSX.utils.book_append_sheet(wb, ws, reportName);

    if (typeof console !== 'undefined') console.log(new Date());
    XLSX.writeFile(wb, reportName + ".xlsx");
    if (typeof console !== 'undefined') console.log(new Date());
}




