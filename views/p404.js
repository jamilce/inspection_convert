function getInfo() {
    return "p404";
}
var selectedVal;
function onLoad() {
    $.get(routes.p404, function (data) {
        $('#mainSection').html(data);
        trans();
        pleaseWait(false);
    });
} 