function getInfo() {
    return "updateAudit";
}
var selectedVal;
function onLoad() {
    $.get(routes.updateAudit, function (data) {

        pleaseWait(true);
        $('#mainSection').html(data);


        pleaseWait(false);
    });
}

function SearchAudit() {
    var refNo = $('#Ref_No').val();
     
    FetchService('get', config.GetAuditByRefNo + '?refNo=' + refNo, null, true, function (res) {
        console.log(res);
        if (res.IsSuccess) {
            $('#EstablishmentTypeID').val(res.ResponseData.EstTypeId)
        }
        else {
            swal(Util.getTrans('_error'), Util.getTrans('_errorMsg'), 'error');
        }
    });
}

function UpdateAudit() {
    var data = {
        RefNo: $('#Ref_No').val(),
        EstTypeId: $('#EstablishmentTypeID').val()
    }
    FetchService('post', config.UpdateAuditEstType, JSON.stringify(data), true, function (res) {
        console.log(res);
        if (res.IsSuccess) {
            swal(Util.getTrans('_success'), Util.getTrans('_successDone'), 'success');
        }
        else {
            swal(Util.getTrans('_error'), Util.getTrans('_errorMsg'), 'error');
        }
    });
}


function SubmitForm() {

    console.log(AuditDetailList);
}