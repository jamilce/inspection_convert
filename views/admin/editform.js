function getInfo() {
    return "editform";
}
var selectedVal;
function onLoad() {
    $.get(routes.editForm, function (data) {

        pleaseWait(true);
        $('#mainSection').html(data);
        $('#btnSubmit').hide();
        var DeptID = lsUser.RoleID == EmployeeRole.Admin ? 0 : lsUser.DeptID;
        app.LoadDropdown('ddEstablishmentType', config.getEstablishmentType + DeptID + "/" + "1", null, true, Util.getTrans('_establishment'));
        getRepeatVisit();
        getRiskLevel();
        pleaseWait(false);
    });
}
function onchange_ddEstbType(e) {
    var id = selectedVal = e.selectedOptions["0"].value;
    ShowForm(id);
}

function getRiskLevel() {
    FetchService("get", config.getRiskLevel + "?id=0", null, false, function (r, xhr) {
        ls.getRiskLevel = JSON.stringify(r);
    });
}
function getRepeatVisit() {
    FetchService("get", config.getRepeatVisit + "?id=0", null, false, function (r, xhr) {
        ls.getRepeatVisit = JSON.stringify(r);
    });
}
function ShowForm(id) {
    pleaseWait(true);
    var row = '';
    var html = '<table class="table table-condensed">\
                    <thead>\
                        <tr><td></td>\
                            <td><b><span data-tran="_violationOfLaw"></span></b></td>\
                            <td><b><span data-tran="_blackpoints"></span></b></td>\
                            <td><b><span data-tran="_weightage"></span></b></td>\
                            <td><b><span data-tran="_repeatVisit"></span></b></td>\
                            <td><b><span data-tran="_actionRequired"></span></b></td>\
                            <td><b><span data-tran="_comment"></span></b></td>\
                        </tr>\
                    </thead>\
                <tbody id="setTemplateTbody"></tbody>\
            </table>';
    $('#setTemplate').html(html);
    var data = JSON.stringify({ "EstablishmentTypeID": id });
    FetchService("post", config.GetAuditsLookup, data, false, function (r, xhr) {
        console.log(r);
        // $('#TopicAudit').html(r.ResponseData[0].EstablishmentTypeNameAr);
        if (r.IsSuccess) {
            if (r.ResponseData.length > 0) {
                $.each(r.ResponseData, function (i, v) {

                    row = "";
                    row += '<tr id="tr_' + v.ID + '">';
                    row += '<td><input type="checkbox" id="chk_' + v.ID + '"  class="chk-col-red" data-id="' + v.ID + '" onclick= "SelectCheckbox(this)">\
                        <label for="chk_' + v.ID + '"></label></td>';
                    row += '<td ><textarea class="form-control" id="EvaluationAr_' + v.ID + '" style="width: unset;" cols="20" rows="4"> ' + v.EvaluationAr + '</textarea> </td>';
                    row += '<td style="width: 13%;background-color:' + Util.getRiskLevelColor(v.RiskLevelID) + '"><select class="form-control" id="ddRiskLevel_' + v.ID + '"> </select><input type="textbox" id="BlackPoints_' + v.ID + '" class="form-control" value="' + v.BlackPoints + '" /></td>';
                    row += '<td><input type="textbox" class="form-control" id="ViolationWeightage_' + v.ID + '" value="' + v.ViolationWeightage + '" />%</td>';
                    row += '<td style="width: 14%;"> <select class="form-control" id="ddRepeatVisit_' + v.ID + '"></select> </td>';
                    row += '<td style="font-size:10px"><textarea class="form-control" id="ActionTaken_' + v.ID + '" style="width: unset;" cols="20" rows="4">' + v.ActionTaken + '</textarea></td>';
                    row += '<td style="font-size:10px"><textarea class="form-control" id="ViolationTarget_' + v.ID + '" style="width: unset;" cols="20" rows="4">' + v.ViolationTarget + '</textarea></td>';

                    row += '</tr>';
                    $('#setTemplateTbody').append(row);

                    app.LoadDropdown('ddRepeatVisit_' + v.ID, JSON.parse(ls.getRepeatVisit), null, false, '');
                    $('#ddRepeatVisit_' + v.ID).val(v.RepeatVisitID);
                    app.LoadDropdown('ddRiskLevel_' + v.ID, JSON.parse(ls.getRiskLevel), null, false, '');
                    $('#ddRiskLevel_' + v.ID).val(v.RiskLevelID);
                    $('#tr_' + v.ID).css("background-color", 'rgb(236, 234, 234)');
                    $('#tr_' + v.ID).find("input,textarea,select").prop('disabled', true);
                    $('#chk_' + v.ID).prop('disabled', false);
                });
                $('#btnSubmit').show();
            } else {
                $('#btnSubmit').hide();
            }


            pleaseWait(false);
        }
    });

    trans();
}

function SelectCheckbox(e) {
    debugger;

    if (e.id.substr(0, 3) == "chk") {
        var id = e.id.substr(4);
        if (!e.checked) {
            $('#tr_' + id).find("input,textarea,select").prop('disabled', true);
            // $('#chk_' + id).prop('checked', false);
            $('#chk_' + id).prop('disabled', false);
            $('#tr_' + id).css("background-color", 'rgb(236, 234, 234)');
        } else {
            $('#tr_' + id).find("input,textarea,select").prop('disabled', false);
            //$('#chk_' + id).prop('checked', false);
            $('#chk_' + id).prop('disabled', false);
            $('#tr_' + id).css("background-color", 'white');
        }
    }
}

function SubmitForm() {
    var AuditDetailList = new Array();
    //$('#setTemplateTbody tr').each(function (i, row) {
    $('#fromCreateAudit *').filter(':input').each(function (e, input) {
        var ID = input.dataset.id;
        if (input.type == "checkbox") {
            var isChecked = $('#chk_' + ID).prop('checked');
            if (isChecked) {

                debugger;
                // var ID = row.id.substr(3);
                //var comments = $('#txtComment_' + ID).val().trim();
                AuditDetailList.push({
                    EstablishmentTypeID: selectedVal,
                    ID: ID,
                    ActionTaken: $('#ActionTaken_' + ID).val().trim(),
                    BlackPoints: $('#BlackPoints_' + ID).val().trim(),
                    //ControlAuthority : $('#ActionTaken_'+ID).val().trim(),
                    EvaluationAr: $('#EvaluationAr_' + ID).val().trim(),
                    //EvaluationEn: $('#ActionTaken_' + ID).val().trim(),
                    //LegislationNo: $('#ActionTaken_' + ID).val().trim(),
                    RepeatVisitID: $('#ddRepeatVisit_' + ID).val(),
                    RiskLevelID: $('#ddRiskLevel_' + ID).val(),
                    ViolationTarget: $('#ViolationTarget_' + ID).val().trim(),
                    ViolationWeightage: $('#ViolationWeightage_' + ID).val().trim()

                });
            }
        }
    });
    console.log(AuditDetailList);
}