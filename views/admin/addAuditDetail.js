function getInfo() {
    return "addAuditDetail";
}
var selectedVal;
function onLoad() {
    $.get("views/admin/addAuditDetail.html", function (data) {
        $('#mainSection').html(data);

        pleaseWait(false);
    });
}
function Validate() {
    var ret = true;
    var data = jQuery('#fromAuditDetail').serializeArray();
    data.forEach(function (v) {
        if (v.value == "") {
            ret = false;
        }
    });

    if (!ret) {
        swal('', Util.getTrans('_requiredField'), 'warning');
        return false;
    }
    return true;
}
function AddNewAuditDetail() {
    var data = jQuery('#fromAuditDetail').serializeArray();
    pleaseWait(true);
    if ( Validate())
        PostData(config.InsertData_AuditDetail, data, PostSuccess);
}

function PostSuccess(data) {
    pleaseWait(false);
    console.log(JSON.stringify(data));
    if (data.IsSuccess) {       
        swal(Util.getTrans('_success'), Util.getTrans('_successDone'), 'success');       
    } else {
        swal(Util.getTrans('_error'), Util.getTrans('_errorMsg'), 'error');
        return false;
    }
    pleaseWait(false);
}