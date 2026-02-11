function getInfo() {
    return "createJSR.html";
}
var updateID = 0;
var selectedVal;
var jsrContent = {
    DeptId: "",
    EstablishmentName: "",
    IndustrialLicenseNo: "",
    //AgriculturalActivityLicenseNo: "",
    //AgriculturalEngProfessionCertificateNo: "",
    // VeterinaryMedicineProfessionLicenseNo: "",
    // VeterinaryActivityLicenseNo: "",
    EstablishmentOwnerName: "",
    XYCoordinates: "",
    EmirateId: "",
    Area: "",
    InChargePersonName: "",
    InChargePersonContactNo: "",
    InChargePersonCapacity: "",
    DefendantSignature: "",
    PoliceOfficerSignature: "",
    CreatedBy: lsUser.FullName,
    InspectorId: lsUser.UserID,
    JudicialSeizure_Attachment: new Array(),
    JudicialSeizure_FederalLaw: new Array(),
    JudicialSeizure_Supervisor: new Array(),
    Comments:"",
    // JudicialSeizure_VetViolations: new Array(),
    // JudicialSeizure_AgrViolation: new Array()
}
function onLoad() {
    $.get(routes.createJSR, function (data) {
        $('#mainSection').html(data);
        app.LoadDropdown_Departments('ddDepartment', Util.getTrans('selectText'), Util.getTrans('_department'));
        app.LoadDropdown_Emirates('ddEmirate', Util.getTrans('selectText'), Util.getTrans('_emirate'));
        Util.updateFromToDates();
         
        setTimeout(() => {
            $('#_JSR_Text1').html($('#_JSR_Text1').html().replace('$Name', lsUser.FullName));
            GetSignatureConfig();
            Attachments.Get(2);
            // GetJSR();
            Voice2Text();
        }, 1000);
        pleaseWait(false);
    });
}

function Voice2Text() {
    var speak = document.getElementById('start-record-btn');
    
    var SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    var recognition = new SpeechRecognition();
    // select a default language on page load
    recognition.lang = 'ar-AE';
    //handle the action on click		
    speak.addEventListener('click', function () {
        var textarea = document.getElementById('ViolationStatement');
        recognition.start();
        textarea.innerHTML = '...'; 
    })
    //Once the result is ready We only control the item we get in response
    recognition.onresult = function (e) {
        var textarea = document.getElementById('ViolationStatement');
        var transcript = e.results[0][0].transcript;
        textarea.innerHTML = transcript;
        console.log(transcript);
    }
    
}
function GetJSR() {
    FetchService('get', config.GetByIdJSR + "?Id=1", null, true, (res) => {
        console.log(res)
        var data = res.ResponseData;
        jsrContent = data;
        updateID = 1;
        $('#AgriculturalActivityLicenseNo').val(jsrContent.AgriculturalActivityLicenseNo);
        $('#AgriculturalEngProfessionCertificateNo').val(jsrContent.AgriculturalEngProfessionCertificateNo);
        $('#Area').val(jsrContent.Area);
        //jsrContent.DefendantSignature = 'data:image/png;base64,' + ($("#Defendant_jsignature").jSignature("getData", "image"))[1];
        //jsrContent.PoliceOfficerSignature = 'data:image/png;base64,' + ($("#PoliceOfficer_jsignature").jSignature("getData", "image"))[1];
        $('#Defendant_jsignature').html(`<img src="${jsrContent.DefendantSignature}" width="300" />`)
        $('#PoliceOfficer_jsignature').html(`<img src="${jsrContent.PoliceOfficerSignature}" width="300" />`)

        $('#ddEmirate').val(jsrContent.EmirateId);
        $('#ddDepartment').val(jsrContent.DeptId);
        $('#EstablishmentName').val(jsrContent.EstablishmentName);
        $('#EstablishmentOwnerName').val(jsrContent.EstablishmentOwnerName);
        $('#InChargePersonName').val(jsrContent.InChargePersonName);
        $('#InChargePersonContactNo').val(jsrContent.InChargePersonContactNo);
        $('#InChargePersonCapacity').val(jsrContent.InChargePersonCapacity);
        $('#IndustrialLicenseNo').val(jsrContent.IndustrialLicenseNo);
        $('#VeterinaryActivityLicenseNo').val(jsrContent.VeterinaryActivityLicenseNo);
        $('#VeterinaryMedicineProfessionLicenseNo').val(jsrContent.VeterinaryMedicineProfessionLicenseNo);
        Supervisor.MakeListSupervisorList(jsrContent.JudicialSeizure_Supervisor);
        VetViolation.MakeViolationList(jsrContent.JudicialSeizure_VetViolations);
        AgrViolation.MakeViolationList(jsrContent.JudicialSeizure_AgrViolation);
        FederalLaw.MakeHistroyList(jsrContent.JudicialSeizure_FederalLaw);
        // Attachments.MakeListFromAPI(jsrContent.JudicialSeizure_Attachment);

        Util.updateDropDown('ddEmirate');

    }, true);
}
function GetSignatureConfig() {
    $("#Supervisor_jsignature").jSignature({
        width: 300,
        height: 100,
        color: "#ba3a3a",
        lineWidth: 2,
        'background-color': 'transparent',
        'decor-color': 'transparent',
    });
    $("#Defendant_jsignature").jSignature({
        width: 400,
        height: 100,
        color: "#ba3a3a",
        lineWidth: 2,
        'background-color': 'transparent',
        'decor-color': 'transparent',
    });
    $("#PoliceOfficer_jsignature").jSignature({
        width: 400,
        height: 100,
        color: "#ba3a3a",
        lineWidth: 2,
        'background-color': 'transparent',
        'decor-color': 'transparent',
    });
    $("#clear").click(function () {
        $("#Supervisor_jsignature").jSignature("reset");
    });
    $("#clear2").click(function () {
        $("#Defendant_jsignature").jSignature("reset");
    });
    $("#clear3").click(function () {
        $("#PoliceOfficer_jsignature").jSignature("reset");
    });
}

var Supervisor = {
    AddNewSupervisor: () => {
        var data = $("#Supervisor_jsignature").jSignature("getData", "image");
        jsrContent.JudicialSeizure_Supervisor.push({
            Id: new Date().getTime(),
            Name: $('#Supervisor_Name').val(),
            JobTitle: $('#Supervisor_JobTitle').val(),
            Address: $('#Supervisor_Address').val(),
            ContactNo: $('#Supervisor_ContactNo').val(),
            Signature: 'data:image/png;base64,' + data[1]
        })
        console.log(jsrContent.JudicialSeizure_Supervisor);
        Supervisor.MakeListSupervisorList(jsrContent.JudicialSeizure_Supervisor);
        Supervisor.ClearForm();
    },
    MakeListSupervisorList: (data) => {
        if (data.length == 0) {
            $('.SupervisorHistory').html('');
            return false;
        }
        var html = `<table class="table table-responsive">
                         <thead>
                            <tr>
                                <td>${Util.getTrans('_Name')}</td>
                                <td>${Util.getTrans('_job')}</td> 
                                <td>${Util.getTrans('_Address')}</td>
                                <td>${Util.getTrans('_ContactNo')}</td>
                                <td>${Util.getTrans('_Signature')}</td>
                                <td>${Util.getTrans('_action')}</td>
                            </tr>   
                        </thead>  `;
        data.forEach((v) => {
            html += `<tr>
                    <td><span>${v.Name}</a></span> </td>
                     <td>${v.JobTitle}</td>
                     <td>${v.Address}</td>
                     <td>${v.ContactNo}</td>
                     <td><img width="120px" src="${v.Signature}" /></td>
                    <td> <a onclick="Supervisor.DeleteSupervisor(${v.Id})"><span>${Util.getTrans('_delete')}</span></a></td> 
                 </tr>`;
        });
        html += '</table>';
        $('.SupervisorHistory').html(html);
        return true;
    },
    DeleteSupervisor: (e) => {
        const updatedArray = jsrContent.JudicialSeizure_Supervisor.filter((x) => x.Id !== e);
        jsrContent.JudicialSeizure_Supervisor = updatedArray;
        Supervisor.MakeListSupervisorList(jsrContent.JudicialSeizure_Supervisor);

    },
    ClearForm: () => {
        $("#Supervisor_jsignature").jSignature("reset");
        $('#Supervisor_Name').val('');
        $('#Supervisor_JobTitle').val('');
        $('#Supervisor_Address').val('');
        $('#Supervisor_ContactNo').val('');
    }
}

var VetViolation = {
    AddNewViolation: () => {
        jsrContent.JudicialSeizure_VetViolations.push({
            Id: new Date().getTime(),
            Type: $('#VetViolation_Type').val(),
            Number: $('#VetViolation_Number').val(),
            Notes: $('#VetViolation_Notes').val(),
        })
        console.log(jsrContent.JudicialSeizure_VetViolations);
        VetViolation.MakeViolationList(jsrContent.JudicialSeizure_VetViolations);
        VetViolation.ClearForm();

    },
    MakeViolationList: (data) => {
        if (data.length == 0) {
            $('.VetViolationHistory').html('');
            return false;
        }
        var html = `<table class="table table-responsive">
                        <thead>
                            <tr>
                                <td>${Util.getTrans('_type')}</td>
                                <td>${Util.getTrans('_Number')}</td> 
                                <td>${Util.getTrans('_Comments_ElectronicChipNumber')}</td>
                                <td>${Util.getTrans('_action')}</td>
                            </tr>   
                        </thead>  `;
        data.forEach((v) => {
            html += `<tr>
                    <td><span>${v.Type}</a></span> </td>
                     <td>${v.Number}</td>
                     <td>${v.Notes}</td>
                    <td> <a onclick="VetViolation.DeleteViolation(${v.Id})"><span>${Util.getTrans('_delete')}</span></a></td> 
                 </tr>`;
        });
        html += '</table>';
        $('.VetViolationHistory').html(html);
        return true;
    },
    DeleteViolation: (e) => {
        const updatedArray = jsrContent.JudicialSeizure_VetViolations.filter((x) => x.Id !== e);
        jsrContent.JudicialSeizure_VetViolations = updatedArray;
        VetViolation.MakeViolationList(jsrContent.JudicialSeizure_VetViolations);
    },
    ClearForm: () => {
        $('#VetViolation_Type').val('');
        $('#VetViolation_Number').val('');
        $('#VetViolation_Notes').val('');
    }
}

var AgrViolation = {
    AddNewViolation: () => {
        jsrContent.JudicialSeizure_AgrViolation.push({
            Id: new Date().getTime(),
            TradeName: $('#AgrViolation_TradeName').val(),
            ActiveIngredient: $('#AgrViolation_ActiveIngredient').val(),
            PackageType: $('#AgrViolation_PackageType').val(),
            Number: $('#AgrViolation_Number').val(),
            Weight: $('#AgrViolation_Weight').val(),
            Total: parseFloat($('#AgrViolation_Number').val()) * parseFloat($('#AgrViolation_Weight').val()),
            ViolationType: $('#AgrViolation_Type').val(),
            BatchNumber: $('#AgrViolation_BatchNumber').val(),
            ExpiryDate: $('#AgrViolation_ExpiryDate').val(),
        })
        console.log(jsrContent.JudicialSeizure_AgrViolation);
        AgrViolation.MakeViolationList(jsrContent.JudicialSeizure_AgrViolation);
        AgrViolation.ClearForm();

    },
    MakeViolationList: (data) => {
        if (data.length == 0) {
            $('.AgrViolationHistory').html('');
            return false;
        }
        var html = `<table class="table table-responsive">                     
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
                                <td>${Util.getTrans('_action')}</td>
                            </tr>   
                        </thead>                 
                    `;
        data.forEach((v) => {
            html += `<tr>
                    <td><span>${v.TradeName}</a></span> </td>
                     <td>${v.ActiveIngredient}</td>
                     <td>${v.PackageType}</td>
                     <td>${v.Number}</td>
                     <td>${v.Weight}</td>
                     <td>${v.BatchNumber}</td>
                     <td>${v.ExpiryDate}</td>
                     <td>${v.Total}</td>
                     <td>${v.ViolationType}</td>
                    <td> <a onclick="AgrViolation.DeleteViolation(${v.Id})"><span>${Util.getTrans('_delete')}</span></a></td> 
                 </tr>`;
        });
        html += '</table>';
        $('.AgrViolationHistory').html(html);
        return true;
    },
    DeleteViolation: (e) => {
        const updatedArray = jsrContent.JudicialSeizure_AgrViolation.filter((x) => x.Id !== e);
        jsrContent.JudicialSeizure_AgrViolation = updatedArray;
        AgrViolation.MakeViolationList(jsrContent.JudicialSeizure_AgrViolation);
    },
    ClearForm: () => {
        $('#AgrViolation_TradeName').val('');
        $('#AgrViolation_ActiveIngredient').val('');
        $('#AgrViolation_PackageType').val('');
        $('#AgrViolation_Number').val('');
        $('#AgrViolation_Weight').val('');
        $('#AgrViolation_Type').val('');
        $('#AgrViolation_BatchNumber').val('');
        $('#AgrViolation_ExpiryDate').val('');
    }
}

var FederalLaw =
{
    AddNew: () => {
        jsrContent.JudicialSeizure_FederalLaw.push({
            Id: new Date().getTime(),
            LawNo: $('#FederalLaw_LawNo').val(),
            Year: $('#FederalLaw_Year').val(),
        })
        console.log(jsrContent.JudicialSeizure_FederalLaw);
        FederalLaw.MakeHistroyList(jsrContent.JudicialSeizure_FederalLaw);
        FederalLaw.ClearForm();
    },
    MakeHistroyList: (data) => {
        if (data.length == 0) {
            $('.FederalLawHistory').html('');
            return false;
        }
        var html = `<table class="table table-responsive">                     
                        <thead>
                            <tr>
                                <td>${Util.getTrans('_JSR_Text9')}</td>
                                <td>${Util.getTrans('_FederalLawYear')}</td>
                                <td>${Util.getTrans('_action')}</td>
                            </tr>   
                        </thead>                 
                    `;
        data.forEach((v) => {
            html += `<tr>
                        <td><span>${v.LawNo}</a></span> </td>
                        <td>${v.Year}</td>
                        <td> <a onclick="FederalLaw.Delete(${v.Id})"><span>${Util.getTrans('_delete')}</span></a></td> 
                     </tr>`;
        });
        html += '</table>';
        $('.FederalLawHistory').html(html);
        return true;
    },
    Delete: (e) => {
        const updatedArray = jsrContent.JudicialSeizure_FederalLaw.filter((x) => x.Id !== e);
        jsrContent.JudicialSeizure_FederalLaw = updatedArray;
        FederalLaw.MakeHistroyList(jsrContent.JudicialSeizure_FederalLaw);
    },
    ClearForm: () => {
        $('#FederalLaw_LawNo').val('');
        $('#FederalLaw_Year').val('');
    }
}


var Attachments = {
    Get: (deptId) => {
        FetchService('get', config.GetAttachmentType + '?deptId=' + deptId, null, true, (response) => {
            Attachments.MakeList(response.ResponseData);
            //Attachments.MakeListFromAPI();
            //console.log(response);
        }, true)
    },
    MakeList: (data) => {
        var html = `<table class="table table-responsive" id="tbl_attachment">`;
        data.forEach((v, i) => {
            html += Attachments.MakeANewRow(v, i);
        });
        html += '</table>';
        $('.AttachmentHistory').html(html);
        $("div[data-code='Other']").hide();
        //$('#attachmentBtn_10').hide();
        return true;
    },
    MakeANewRow: (v, i) => {
        var html = "";
        var dt = new Date().getTime() + i;
        var isOther = v.NameEn == 'Other' ? 'none' : 'block';
        html += `<tr>
                        <td><span>${v.NameAr}</a></span>`
        if (v.NameEn == 'Other') {
            html += `<div><input type="text" class=""  data-vid="${dt}" id="OtherText_${dt}" onKeyUp="return Attachments.onChangeOtherText(this)" ></div>`;
        }
        html += `</td>
                        <td>
                            <div class="upload-btn-wrapper" style="display:${isOther}" data-code="${v.NameEn}" id="attachmentBtn_${dt}">
                                <button class="btn bg-green  waves-float waves-light">
                                    <span >${Util.getTrans('_uploadFile')}</span>
                                </button>
                                <input type="file" data-vid="${dt}" data-code="${v.NameEn}" data-id="${v.Id}"  name="file[]" id="AttFileUpload_${dt}" accept="image/*;capture=camera" class=""  onchange="Attachments.UploadFile(this)">
                            </div> 
                        </td>
                        <td id="attachmentURL_${dt}">  </td> 
                     </tr>`;
        return html;
    },
    MakeOtherAttachment_Btn: () => {
        var item = {
            Id: 11, NameEn: 'Other', NameAr: ' أخرى'
        }
        var html = Attachments.MakeANewRow(item, 1000);
        $('#tbl_attachment').append(html);
    },
    //MakeListFromAPI: () => {
    //    jsrContent.JudicialSeizure_Attachment.map(x => {
    //        console.log(x);
    //        $('#attachmentURL_' + x.AttachmentTypeId).html(`<a href="${FileServer_URL + x.Audit_Attachment.FilePath}" target="_blank"> ${x.Audit_Attachment.FilePath.split('/')[1]}</a>`);
    //    });
    //},
    onChangeOtherText: (e) => {
        var text = e.value;
        var vid = e.dataset.vid;
        if (text.length > 3) {
            $('#attachmentBtn_' + vid).show();
        } else {
            $('#attachmentBtn_' + vid).hide();
        }
    },
    UploadFile: (e) => {
        const attachmentTypeId = e.dataset.id;
        const vId = e.dataset.vid;

        var url = config.PostAttachment;
        var fileSelected = $('#AttFileUpload_' + vId).val();
        if (fileSelected.length <= 0) {
            swal(Util.getTrans('_pleaseSelectFile'), Util.getTrans('_pleaseSelectFile'), 'warning');
            return false;
        }
        else if (!Attachments.SupportedFileExt(fileSelected.split('.').pop())) {
            swal(Util.getTrans('_error'), Util.getTrans('_fileNotSupported'), 'warning');
            return false;
        }
        else {
            var form_data = new FormData();
            var ins = document.getElementById('AttFileUpload_' + vId).files.length;
            for (var x = 0; x < ins; x++) {
                form_data.append("file", document.getElementById('AttFileUpload_' + vId).files[x]);
            }
            UploadFiles(url, form_data, (data, st, xhr) => {
                if (data.IsSuccess) {
                    var res = data.ResponseData;

                    jsrContent.JudicialSeizure_Attachment.push({
                        AttachmentTypeId: attachmentTypeId,
                        AuditAttachmentId: res[0].ID,
                        OtherText: $('#OtherText_' + vId).val() || ""
                    });
                    $('#attachmentURL_' + vId).html(`<a href="${FileServer_URL + res[0].FileName}" target="_blank"> ${res[0].FileName.split('/')[1]}</a>`);

                    document.getElementById('AttFileUpload_' + vId).value = '';
                    console.log(res);
                    //Util.Notification(Util.getTrans("_uploadSuccessful"), 'success');
                }
                else {
                    document.getElementById('AttFileUpload_' + vId).value = '';
                    swal(Util.getTrans('_error'), "Server error ,Please try again", 'error');
                }
                pleaseWait(false);
            },
                (xhr, textStatus, errorThrown) => {
                    document.getElementById('AttFileUpload_' + vId).value = '';
                    if (xhr.status == 415) { // file type not supported.
                        swal(Util.getTrans('_error'), Util.getTrans('_fileNotSupported'), 'warning');
                    }
                    else if (xhr.status == 406) { //file exceed 5 MB
                        swal(Util.getTrans('_error'), Util.getTrans('_fileSizeExceed'), 'warning');
                    }
                    else if (xhr.status == 500) {
                        swal(Util.getTrans('_error'), "Error, Please try again", 'error');
                    }
                    console.log(JSON.stringify(xhr) + textStatus + ': ' + errorThrown);
                    pleaseWait(false);
                }
            );
            return true;
        }
        return true;
    },
    UpdateAttachmentContent: (attachmentTypeId) => {
        jsrContent.JudicialSeizure_Attachment.push({
            AttachmentTypeId: attachmentTypeId,
            AuditAttachmentId: res[0].ID,
            OtherText: $('#OtherText_' + attachmentTypeId).val() || ""
        });
        $('#attachmentURL_' + attachmentTypeId).html(`<a href="${FileServer_URL + res[0].FileName}" target="_blank"> ${res[0].FileName.split('/')[1]}</a>`);

    },
    SupportedFileExt: (ext) => {
        ext = ext.toLocaleLowerCase();
        var SupportedExtensions = ['png', 'jpg', 'jpeg', 'png', 'bmp', 'pdf', 'docx', 'xlsx'];
        if (SupportedExtensions.indexOf(ext) > -1) {
            return true;
        }
        return false;
    }
}

function SaveForm() {
    jsrContent.DeptId = $('#ddDepartment').val();

    if (jsrContent.DeptId == 2) {
        jsrContent.AgriculturalActivityLicenseNo = $('#AgriculturalActivityLicenseNo').val();
        jsrContent.AgriculturalEngProfessionCertificateNo = $('#AgriculturalEngProfessionCertificateNo').val();
    }
    if (jsrContent.DeptId == 4) {
        jsrContent.VeterinaryActivityLicenseNo = $('#VeterinaryActivityLicenseNo').val();
        jsrContent.VeterinaryMedicineProfessionLicenseNo = $('#VeterinaryMedicineProfessionLicenseNo').val();
    }
    jsrContent.Area = $('#Area').val();
    jsrContent.DefendantSignature = 'data:image/png;base64,' + ($("#Defendant_jsignature").jSignature("getData", "image"))[1];
    jsrContent.PoliceOfficerSignature = 'data:image/png;base64,' + ($("#PoliceOfficer_jsignature").jSignature("getData", "image"))[1];
    jsrContent.EmirateId = $('#ddEmirate').val();
    jsrContent.EstablishmentName = $('#EstablishmentName').val();
    jsrContent.EstablishmentOwnerName = $('#EstablishmentOwnerName').val();
    jsrContent.InChargePersonName = $('#InChargePersonName').val();
    jsrContent.InChargePersonContactNo = $('#InChargePersonContactNo').val();
    jsrContent.InChargePersonCapacity = $('#InChargePersonCapacity').val();
    jsrContent.IndustrialLicenseNo = $('#IndustrialLicenseNo').val();
    jsrContent.Comments = $('#Comments').val();

    jsrContent.XYCoordinates = lat + "," + lng;

    if (!Util.isObjectEmpty(jsrContent)) {

        Util.Notification(Util.getTrans("_requiredField"), 'warning');
        return false;
    }
    if (
        ($("#PoliceOfficer_jsignature").jSignature("getData", "native")).length == 0 ||
        ($("#Defendant_jsignature").jSignature("getData", "native")).length == 0
    ) {
        Util.Notification(Util.getTrans("_SignatureRequired"), 'warning');
        return false;
    }

    console.log(jsrContent);
    PostData(config.CreateJSR, jsrContent, (res) => {
        console.log(res);
        swal(Util.getTrans('_success'), Util.getTrans('_successDone'), 'success');

        setTimeout(() => {
            loadScript('views/JudicialSeizure/reportJSR');
        }, 2000);
    })
}

function onchange_ddDepartment(e) {
    $('#AddVetViolation').hide();
    $('#AddAgrViolation').hide();
    $('.forAgrActivity').hide();
    $('.forVetActivity').hide();
    selectedVal = e.selectedOptions["0"].value;
    //vet =4, Agr = 2
    if (parseInt(selectedVal) == 4) {
        $('#vet_agr_material_id').html(Util.getTrans('_JSR_Text11'));
        $('#AddVetViolation').show();
        $('.forVetActivity').show();
       
        jsrContent.JudicialSeizure_VetViolations = new Array();
        jsrContent.VeterinaryMedicineProfessionLicenseNo = "";
        jsrContent.VeterinaryActivityLicenseNo = "";

        $('#AddAgrViolation').show();
     
        jsrContent.JudicialSeizure_AgrViolation = new Array();         

        //delete jsrContent.JudicialSeizure_AgrViolation;
         delete jsrContent.AgriculturalActivityLicenseNo;
        delete jsrContent.AgriculturalEngProfessionCertificateNo;


    } if (parseInt(selectedVal) == 2) {
        $('#vet_agr_material_id').html(Util.getTrans('_JSR_Text10'));
        $('#AddAgrViolation').show();
        $('.forAgrActivity').show();
        jsrContent.JudicialSeizure_AgrViolation = new Array();
        jsrContent.AgriculturalActivityLicenseNo = "";
        jsrContent.AgriculturalEngProfessionCertificateNo = "";

        delete jsrContent.JudicialSeizure_VetViolations;
        delete jsrContent.VeterinaryMedicineProfessionLicenseNo;
        delete jsrContent.VeterinaryActivityLicenseNo;

    }
    Attachments.Get(selectedVal);
}