
function getInfo() {
    return "audit";
}
var totalBlackPoints = 0;
var totalViolationWeightage = 0;
var RequiredAudits = new Array();
var isFormEidtMode = false;
function onLoad() {
    $.get("views/audit.html", function (data) {
        $('#mainSection').html(data);

        CreateAuditTemplate(ss.EstablishmentTypeID);

        getControl('imageControl', 'ImageControl', function (script, textStatus) {
            $('#ImageControl').html(script);
            setTimeout(function () {
                trans();
            }, 50)
        });
        ss.InpsectionTimeSpent = new Date();
        pleaseWait(false);
    });
}

function GetAuditSubmittedData() {
    var data = { AuditServiceID: ss.AuditServiceID }
   
    FetchService("post", config.GetAuditDetailsForm, JSON.stringify(data), true, function (r, xhr) {
        if (r.IsSuccess) {
            console.log(r.ResponseData);
            var res = r.ResponseData[0];
            if (res.Audit_AnimalDeptForm.length > 0) {
                isFormEidtMode = true;
                $.each(res.Audit_AnimalDeptForm, function (i, v) {
                    $('#txtComment_' + v.LookupAuditDetailID).val(v.Comments);
                    if (v.IsChecked) {
                        $('#chk_' + v.LookupAuditDetailID).attr('checked', true);
                        $('#tr_' + v.LookupAuditDetailID).css("background-color", 'rgb(236, 234, 234)');

                        totalBlackPoints -= parseInt($('#chk_' + v.LookupAuditDetailID).attr('data-blackpoints'));
                        totalViolationWeightage -= parseInt($('#chk_' + v.LookupAuditDetailID).attr('data-violationweightage'));
                        RequiredAudits.push({ id: v.LookupAuditDetailID, days: $('#chk_' + v.LookupAuditDetailID).attr('data-days') });
                    }
                }); 
            }
            UpdateTotalReult();
           
        }
    });
}
function UpdateTotalReult() {
    $('#BlackPoints_ID').html(totalBlackPoints);
    $('#TotalWeight_ID').html(totalViolationWeightage); 
}

function CreateAuditTemplate(estabTypeID) {
    var row = '';
    var html = '<table class="table table-condensed">\
                <thead>\
                    <tr>\
                        <td></td>\
                        <td><b><span data-tran="_violationOfLaw"></span></b></td>\
                        <td><b><span data-tran="_blackpoints"></span></b></td>\
                        <td><b><span data-tran="_weightage"></span></b></td>\
                        <td><b><span data-tran="_repeatVisit"></span></b></td>\
                        <td><b><span data-tran="_actionRequired"></span></b></td>\
                        <td><b><span data-tran="_comment"></span></b></td>\
                        <td><b><span data-tran="_comment"></span></b></td>\
                    </tr>\
                </thead>\
                <tbody id="setTemplateTbody"></tbody>\
            </table>';
    $('#setTemplate').html(html);
    var data = JSON.stringify({ "EstablishmentTypeID": estabTypeID });
    FetchService("post", config.GetAuditsLookup, data, false, function (r, xhr) {
        console.log(r);
        $('#TopicAudit').html(r.ResponseData[0].EstablishmentTypeNameAr);
        if (r.IsSuccess) {
            $.each(r.ResponseData, function (i, v) {
                row += '<tr id="tr_' + v.ID + '">'
                row += '<td><input type="checkbox" id="chk_' + v.ID + '" data-id="' + v.ID + '" class="chk-col-red" data-days="' + v.NoOfDays + '" data-violationweightage = "' + v.ViolationWeightage + '" data-blackpoints= ' + v.BlackPoints + ' >\
                        <label data-id="' + v.ID + '" data-days="' + v.NoOfDays + '" data-violationweightage = "' + v.ViolationWeightage + '" data-blackpoints= ' + v.BlackPoints + ' onclick= "SelectCheckbox(this)" for="chk_' + v.ID + '"></label></td>'
                row += '<td>' + v.EvaluationAr + '</td>';
                row += '<td style="background-color:' + Util.getRiskLevelColor(v.RiskLevelID) + '">' + v.BlackPoints + '</td>';
                row += '<td>' + v.ViolationWeightage + '%</td>';
                row += '<td>' + v.RepeatVisitPolicy + '</td>';
                row += '<td style="font-size:10px">' + v.ActionTaken + '</td>';
                row += '<td style="font-size:10px">' + v.ViolationTarget + '</td>';
                row += '<td><textarea class="form-control" id="txtComment_' + v.ID + '" style="width: unset;" cols="20" rows="4"></textarea></td>';
                row += '</tr>';
                totalBlackPoints += parseInt(v.BlackPoints);
                totalViolationWeightage += parseInt(v.ViolationWeightage);

                row = row.replace('null', '');
                row = row.replace('""', '');
            })
             
            $('#setTemplateTbody').html(row);
        }
        console.log("TotalBlackPoints = " + totalBlackPoints + " , v=" + totalViolationWeightage);
        GetAuditSubmittedData();
    });
}

function SelectCheckbox(e) {
    debugger;
    var id = e.dataset.id;
    var blackPoint = e.dataset.blackpoints;
    var violationWeightage = e.dataset.violationweightage;
    var days = e.dataset.days;
    var checkbox = $('#chk_' + id).prop('checked');
    if (!checkbox) {
        $('#tr_' + id).css("background-color", 'rgb(236, 234, 234)');
        totalBlackPoints -= parseInt(blackPoint);
        totalViolationWeightage -= parseInt(violationWeightage);
        RequiredAudits.push({ id: id, days: days });

    } else {
        $('#tr_' + id).css("background-color", 'white');
        totalBlackPoints += parseInt(blackPoint);
        totalViolationWeightage += parseInt(violationWeightage);
        for (var i = 0; i < RequiredAudits.length; i++) {
            if (RequiredAudits[i].id == id) {
                RequiredAudits.splice(i, 1);
            }
        }
    }
    UpdateTotalReult();
    console.log(totalBlackPoints, totalViolationWeightage);

}

function SubmitInpsection() {
    debugger;
    var AuditDetailList = new Array();
    var RiskLevel = new Array();
    $('#fromCreateAudit *').filter(':input').each(function (e, input) {
        if (input.type == "checkbox") {
            var ID = input.dataset.id;
            var comments = $('#txtComment_' + ID).val();
            var isChecked = $('#chk_' + ID).prop('checked');
            AuditDetailList.push({
                AuditServiceID: ss.AuditServiceID,
                LookupAuditDetailID: ID,
                Comments: comments,
                IsChecked: isChecked,
            });
        }
    })
    //console.log(AuditDetailList);    
    FetchService("post", config.PostAuditDetailsForm, JSON.stringify(AuditDetailList), true, function (r, xhr) {
        console.log(r);
        if (r.IsSuccess) {

            var AuditService = {
                Inspector_ID: ls.UserID,
                ID: ss.AuditServiceID,
                GPS_Cord: lat + "," + lng,
                //NextVisit_Date: new Date(),
                Rating: totalViolationWeightage,
                Remarks: $('#comments_ID').val(),
                TimeSpent: Util.TimeSpent(ss.InpsectionTimeSpent),
                Total_Points: totalBlackPoints,
                ToEmp_ID: ls.UserID,
                IsEditMode: isFormEidtMode,
                RequiredAudits: [... new Set(RequiredAudits.map(x => x.days))],

            };
            FetchService('post', config.UpdateAuditsService, JSON.stringify(AuditService), true, function (r, xhr) {
                if (r.IsSuccess) {
                    var msg = ''; var daysMsg = '';
                    $.each(RequiredAudits, function (i, v) {
                        daysMsg += Util.AddDays(v) + ",";
                    });
                    daysMsg = daysMsg.substr(0, daysMsg.length - 1);
                    msg = "Next visits are schedule for " + daysMsg + " Dates";
                    swal(Util.getTrans('_success'), Util.getTrans('_successDone'), 'success');
                    swal(Util.getTrans('_success'), msg, 'success');
                } else {
                    swal(Util.getTrans('_error'), Util.getTrans('_errorMsg'), 'error');
                }
            })

        } else {
            swal(Util.getTrans('_error'), Util.getTrans('_errorMsg'), 'error');
        }
    });

}