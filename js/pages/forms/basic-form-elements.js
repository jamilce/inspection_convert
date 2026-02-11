$(function () {
    //Textare auto growth
    autosize($('textarea.auto-growth'));

    //Datetimepicker plugin
    $('.datetimepicker').bootstrapMaterialDatePicker({
        // format: 'dddd DD MMMM YYYY - HH:mm',
        format: 'DD/MM/YYYY HH:mm',
        clearButton: true,
        weekStart: 0,
        shortTime: true,
    });

    $('.datepicker').bootstrapMaterialDatePicker({
        format: 'dddd DD MMMM YYYY',
        //format: 'DD/MM/YYYY',
        clearButton: true,
        weekStart: 0,
        time: false
    });

    $('.timepicker').bootstrapMaterialDatePicker({
        format: 'HH:mm',
        clearButton: true,
        date: false
    });



    //Start and End DateTime

    $('.datetimepicker_start').bootstrapMaterialDatePicker({
        format: 'DD/MM/YYYY HH:mm',
        clearButton: true,
        weekStart: 0,
        shortTime: true,
    });
    $('.datetimepicker_end').bootstrapMaterialDatePicker({
        format: 'DD/MM/YYYY HH:mm',
        clearButton: true,
        weekStart: 0,
        shortTime: true,
    });

    $('.datetimepicker_start').bootstrapMaterialDatePicker({
        format: 'DD/MM/YYYY HH:mm',
        clearButton: true,
        weekStart: 0,
        shortTime: true,
    }).on('change', function (e, date) {
        //console.log(e,date);
        $('.datetimepicker_end').bootstrapMaterialDatePicker('setMinDate', date);
    });
    $('.datetimepicker_start').bootstrapMaterialDatePicker({
        format: 'DD/MM/YYYY HH:mm',
        clearButton: true,
        weekStart: 0,
        shortTime: true,
    }).on('beforeChange', function (e, date) {
        $('.datetimepicker_end').bootstrapMaterialDatePicker('setMinDate', date);
    });

    ///Set Date only --start and end


    $('.datepicker_start').bootstrapMaterialDatePicker({
        format: 'MM-DD-YYYY',
        clearButton: true,
        weekStart: 1,
        time: false
    });
    $('.datepicker_end').bootstrapMaterialDatePicker({
        format: 'MM-DD-YYYY',
        clearButton: true,
        weekStart: 1,
        time: false
    });

    $('.datepicker_start').bootstrapMaterialDatePicker({
        format: 'MM-DD-YYYY',
        clearButton: true,
        weekStart: 1,
        time: false
    }).on('change', function (e, date) {
        //console.log(e,date);
        $('.datepicker_end').bootstrapMaterialDatePicker('setMinDate', date);
    });
    $('.datepicker_start').bootstrapMaterialDatePicker({
        format: 'MM-DD-YYYY',
        clearButton: true,
        weekStart: 1,
        time: false
    }).on('beforeChange', function (e, date) {
        $('.datepicker_end').bootstrapMaterialDatePicker('setMinDate', date);
    });
});