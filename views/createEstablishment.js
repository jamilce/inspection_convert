function getInfo() {
    return "createEstablishment";
}
var updateID = 0;

function onLoad() {
    $.get(routes.createEstablishment, function (data) {
        pleaseWait(true);
        $('#mainSection').html(data);
        setTimeout(function () {
            if (lsUser.RoleID != EmployeeRole.Department_Staff) {
                app.LoadDropdown_Departments('ddDepartment', Util.getTrans('selectText'), Util.getTrans('_department'));
            }
            else {
                $('.ddDepartment').hide();
            }
            app.LoadDropdown_Emirates('ddEmirate', Util.getTrans('selectText'), Util.getTrans('_emirate'));

            if (!isDualDepartmentHead()) {
                app.LoadDropdown('ddEstablishmentType', config.getEstablishmentType + lsUser.DeptID + "/0", null, true, Util.getTrans('_establishment'));
            }
            pleaseWait(false);
            SetTable_Establishment();
        }, 10);
    });
}

function onchange_ddDepartment(e) {
    var selectedVal = e.selectedOptions["0"].value;
    app.LoadDropdown('ddEstablishmentType', config.getEstablishmentType + selectedVal + "/0", null, true, Util.getTrans('_establishment'));

}

function AddNewEstablishment(e) {
    if ($('#ddDepartment').val() === "0" || $('#ddEmirate').val() === "0") {
        swal('', Util.getTrans('_requiredField'), 'warning');
        return false;
    }
    var DeptID = $('#ddDepartment').val() == null ? lsUser.DeptID : $('#ddDepartment').val();
    pleaseWait(true);
    var data = jQuery('#frmNewEst').serializeArray();
    data.push({ name: "ID", value: updateID });
    data.push({ name: "DeptID", value: DeptID });
    var url = config.AddNewEstablisment;
    PostData(url, data, function (d) {
        pleaseWait(false);
        console.log(JSON.stringify(d));
        if (d.IsSuccess) {
            Util.ResetForm('frmNewEst');

            if (updateID > 0) {
                Util.Notification(Util.getTrans('_updatedSuccessfull'), 'success');
            } else {
                Util.Notification(Util.getTrans('_estabAddedDone'), 'success');
            }
            if (parseInt(updateID) > 0) {
                SetTable_Establishment();
            }
            CancelUpdate();
        } else {
            Util.Notification(Util.getTrans('_errorMsg'), 'error');
            return false;
        }
    });

}

function SaearchEstablishment_Local() {
    var Search_CompanyName = $('#Search_CompanyName').val();
    var Search_LicenseNo = $('#Search_LicenseNo').val()
    if (Search_CompanyName != "" || Search_LicenseNo != "")
        SetTable_Establishment(Search_CompanyName, Search_LicenseNo);
}
function ClearEstablishment_Local() {
    $('#Search_CompanyName').val('');
    $('#Search_LicenseNo').val('');
    SetTable_Establishment();
}
function SetTable_Establishment(nameSearch, lisenceSearch) {

    var DeptID = (lsUser.RoleID != EmployeeRole.Directors && lsUser.RoleID != EmployeeRole.Admin) ? lsUser.DeptID : null;
    var row = [];
    var emirateID = $('#ddEmirate').val() === "0" ? null : $('#ddEmirate').val();
    lisenceSearch = lisenceSearch || "";
    nameSearch = nameSearch || "";
    var data = JSON.stringify({ "EmirateId": emirateID, "DeptID": DeptID, TradeLicenseNumber: lisenceSearch, NameAr: nameSearch, NameEn: nameSearch });

    var column = [
        { "name": "number", "title": '#', "breakpoints": "xs sm" },
        { "name": "tradeLicense", "title": Util.getTrans('_licenseNo'), "breakpoints": "xs md", },
        { "name": "name", "title": Util.getTrans('_Name'), "breakpoints": "xs sm md", "style": { "maxWidth": 250 } },
        { "name": "esttype", "title": Util.getTrans('_establishmentType') },
        { "name": "area", "title": Util.getTrans('_emirate'), "filterable": false },
        //{ "name": "email", "title": Util.getTrans('_email'), "breakpoints": "xs sm md" },
        { "name": "gps", "title": Util.getTrans('_location'), "breakpoints": "xs sm md" },
        { "name": "action", "title": Util.getTrans('_action'), "breakpoints": "xs sm md" }
    ];

    FetchService('post', config.GetEstablisment, data, true,
        function (res) {
            if (res.IsSuccess) {
                $('.table').html('');
                $.each(res.ResponseData, function (i, v) {
                    var gps = v.Lat_X === null || v.Lat_X == "0" ? "" : '<a target="_blank" href="https://www.google.com/maps?daddr=' + v.Lat_X + "," + v.Lng_Y + '"><img src="images/google-maps.png" width="15" /></a>';
                    var area = v.Area === undefined || v.Area == null ? "" : v.Area;
                    var DeleteButton = (lsUser.RoleID == EmployeeRole.Admin || lsUser.RoleID == EmployeeRole.Department_Head) ? '<button  type="button" ' + Util.ToolTip('_delete') + '   data-id="' + v.ID + '" onclick="DeleteEstablishment(this)" class="btn btn-warning btn-circle-sm waves-effect waves-circle waves-float"   >\
                            <i class= "material-icons"> close</i>\
                        </button>': "";
                    row.push({
                        "number": i + 1,
                        "esttype": v.EstablishmentTypeNameAr,
                        "tradeLicense": v.TradeLicenseNumber,
                        "area": v.EmirateAr + " - " + area,
                        "name": "<div>" + v.NameAr + "</div><div>" + v.NameEn + "</div>",
                        //"email": v.Email === null ? "" : v.Email + "-" + v.Mobile,
                        "gps": gps,
                        "action":  
                            '<button  type="button" ' + Util.ToolTip('_detail') + ' onclick="getEstablimentData(' + v.ID + ')" class= "btn btn-warning btn-circle-sm waves-effect waves-circle waves-float" >\
                             <i class= "material-icons"> assignment</i>\
                           </button> \
                            <button  type="button" ' + Util.ToolTip('_update') + ' data-id="' + v.ID + '" onclick = "GetUpdateEstab(this)" class= "btn btn-warning btn-circle-sm waves-effect waves-circle waves-float" >\
                            <i class= "material-icons"> edit</i>\
                        </button>\
                        '+ DeleteButton,

                    });
                });
                $('.table').footable({
                    "paging": {
                        "enabled": true
                    },
                    "filtering": {
                        "enabled": false,
                        "position": "center"
                    },
                    "sorting": {
                        "enabled": true
                    },
                    "columns": column,
                    "rows": row,
                    "empty": Util.getTrans('_noResultFound'),
                });
                FooTable.get('.table').pageSize(20);
                //$(".footable-filtering-search input[type=text]").attr("placeholder", Util.getTrans('_search'));
            }
        },true);

}

function DeleteEstablishment(e) {
    var data = e.dataset.id;

    FetchService('POST', config.IsEstablishmentHasAudits, JSON.stringify({ EstablishmentID: data }), true, function (r) {
        if (!r.IsSuccess && r.ResponseData !== 'OK') {
            swal({
                title: Util.getTrans('_delete'),
                text: Util.getTrans('_areYouSureDelete'),
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: Util.getTrans('_yes'),
                cancelButtonText: Util.getTrans('_no'),
                closeOnConfirm: true,
                closeOnCancel: true
            }, function (isConfirm) {
                if (isConfirm) {
                    FetchService('post', config.DeleteEstablisment, JSON.stringify({ ID: data }), true, function (r) {
                        if (r.IsSuccess) {
                            SetTable_Establishment();
                        }
                    }, true);
                }
            });
        }
        else {
            swal(Util.getTrans('_error'), Util.getTrans('_establishmentHasAudits_error'), 'error');
        }

    });
}

function GetUpdateEstab(e) {
    console.log(e.dataset.id);
    $('.btnAdd').html('check');
    updateID = e.dataset.id;
    var data = JSON.stringify({ ID: e.dataset.id });
    FetchService('post', config.GetEstablisment, data, true, GetUpdateEstabSuccess, true);
    $('.btnCancelUpdate').show();
}

function GetUpdateEstabSuccess(res_) {
    var res = res_.ResponseData[0];
    $("#ddDepartment").val(res.DeptID);
    app.LoadDropdown('ddEstablishmentType', config.getEstablishmentType + res.DeptID + "/0", null, true, Util.getTrans('_establishment'));
    $('#Email').val(res.Email);
    $('#Lat_X').val(res.Lat_X);
    $('#Lng_Y').val(res.Lng_Y);
    $('#Mobile').val(res.Mobile);
    $('#NameAr').val(res.NameAr);
    $('#NameEn').val(res.NameEn);
    $('#TradeLicenseNumber').val(res.TradeLicenseNumber);
    $('#Area').val(res.Area);
    $("#ddEmirate").val(res.EmirateId);
    $("#ddEstablishmentType").val(res.EstablishmentTypeID);

    Util.updateDropDown('ddEstablishmentType');
    Util.updateDropDown('ddDepartment');
    Util.updateDropDown('ddEmirate');

}

function CancelUpdate() {
    updateID = 0;
    $("#ddDepartment").val('0');
    $("#ddEmirate").val('0');
    $("#ddEstablishmentType").val('0');
    $('#Email').val('');
    $('#Lat_X').val('');
    $('#Lng_Y').val('');
    $('#Mobile').val('');
    $('#NameAr').val('');
    $('#NameEn').val('');
    $('#Area').val('');

    Util.updateDropDown('ddEstablishmentType');
    Util.updateDropDown('ddDepartment');
    Util.updateDropDown('ddEmirate');

    $('.btnCancelUpdate').hide();
}

function ShowMapPopUp() {
    $('#ubody').html('');
    var html = '<div class="">\
                    <input id="pac-input" class="control" type="text" placeholder="Search Box">\
                    <div id="mapCanvas" class="gmap2 animated fadeInTop">\
                    </div>\
                </div>';
    $('#ubody').html(html);

    LoadMap();

    ShowModal('#model_showDeatil');
}