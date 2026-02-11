function getInfo() {
    return "test";
}
var selectedVal;
function onLoad() {
    $.get("views/test.html", function (data) {
        $('#mainSection').html(data);
        
        pleaseWait(false);
    });
} 