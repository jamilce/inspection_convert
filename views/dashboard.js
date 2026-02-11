function getInfo() {
    return "dashboard.html";
}
var ChartType = {
    Line: "line",
    Doughunt: 'doughnut',
    Bar: 'bar'
};
var FromToDateEnum = {
    From: "",
    To: ""
}
function onLoad() {
    $.get(routes.dashboard, function (data) {
        $('#mainSection').html(data);

        if (lsUser.RoleID == EmployeeRole.Department_Staff) {
            $('.dashboardForInspectors').show();
            ChartsObject.GetCounts();
            ChartsObject.GetAuditType();
            ChartsObject.GetRiskLevel();
        }
        else if (lsUser.RoleID == EmployeeRole.Department_Head) {
            $('.dashboardForHead').show();
            var dt = GetFromDate();
            ChartsObject.GetEstablishmentVisitsInfo_forDeptHead(dt.From, dt.To);
            ChartsObject.GetInpectorDetailForDeptHead('', '');
            if (lsUser.DeptID == '4') {
                $('#VetAndAgriDept').show();
                ChartsObject.DountChart('donut_chart_Agri', [2]);
                ChartsObject.DountChart('donut_chart_Vet', [4]);
            } else {
                ChartsObject.DountChart('donut_chart', GetDeptIDs_Array());
            }

        }
        else if (lsUser.RoleID == EmployeeRole.Directors) {
            console.log('for Directors');
            $('.dashboardForDirectors').show();
            ChartsObject.DountChart('donut_chart_Env_d', [1]);
            ChartsObject.DountChart('donut_chart_Vet_d', [4]);
            ChartsObject.DountChart('donut_chart_Fish_d', [3]);
            ChartsObject.DountChart('donut_chart_Agri_d', [2]);
            ChartsObject.DirectorDashboard.GetInpectorDetail('', '');
            ChartsObject.GetInpectorDetailForDeptHead('', '');
            var dt = GetFromDate();
            ChartsObject.GetEstablishmentVisitsInfo_forDeptHead(dt.From, dt.To);
        }
        pleaseWait(false);
    });
}

function GetDeptIDs() {
    if (lsUser.RoleID == 1) return '1,2,3,4';
    return lsUser.DeptID == '4' ? '2,4' : lsUser.DeptID;
}
function GetDeptIDs_Array() {
    return lsUser.DeptID == '4' ? [2, 4] : [lsUser.DeptID];
}
var i = 0;
var ChartsObject = {

    DirectorDashboard: {
        GetInpectorDetail: function (FromDate, ToDate) {
            var deptID = '1,2,3,4';
            FetchService('POST', config.GetInspectorsDetailCounts,
                JSON.stringify({ CatIDs: deptID, FromDate: FromDate, ToDate: ToDate }), true, function (res) {
                    if (res.IsSuccess) {
                        console.log(res);
                        ChartsObject.GetInspectorsDetailCounts_Markup(res.ResponseData);
                    }
                }, true);
        }

    },
    GetInpectorDetailForDeptHead: function (FromDate, ToDate) {
        var deptID = GetDeptIDs();
        FetchService('POST', config.GetInspectorsDetailCounts,
            JSON.stringify({ CatIDs: deptID, FromDate: FromDate, ToDate: ToDate }), true, function (res) {
                if (res.IsSuccess) {
                    console.log(res);
                    ChartsObject.GetInspectorsDetailCounts_Markup(res.ResponseData);
                }
            }, true);
    },
    GetEstablishmentVisitsInfo_forDeptHead: function (FromDate, ToDate) {
        var deptID = GetDeptIDs();
        FetchService('POST', config.GetEstablishmentVisitsInfo,
            JSON.stringify({ CatIDs: deptID, FromDate: FromDate, ToDate: ToDate }), true, function (res) {
                if (res.IsSuccess) {
                    console.log(res);
                    ChartsObject.GetEstablishmentVisitsInfo_forDeptHead_Markup(res.ResponseData);
                }
            }, false);
    },
    GetEstablishmentVisitsInfo_forDeptHead_Markup: function (res) {
        var row = [];
        var column = [
            { "name": "number", "title": '#', "breakpoints": "xs sm", "style": { "minWidth": 5 } },
            // { "name": "DepartmentName", "title": Util.getTrans('_department'), "breakpoints": "xs md" },
            { "name": "TradeLicense", "title": Util.getTrans('_licenseNo') },
            { "name": "EstablishmentName", "title": Util.getTrans('_establishment'), "breakpoints": "xs sm md", },
            { "name": "SubCatagory", "title": Util.getTrans('_type'), "breakpoints": "xs sm md" },
            { "name": "Emirate", "title": Util.getTrans('_emirate') },
            //{ "name": "GPS", "title": Util.getTrans('_cordinates'), "breakpoints": "xs sm md" },            
            { "name": "TotalAudits", "title": Util.getTrans('_audits'), "breakpoints": "xs sm md" },
            { "name": "TotalInspection", "title": Util.getTrans('_inspection'), "breakpoints": "xs sm md" },
            { "name": "TotalVisit", "title": Util.getTrans('_total'), "breakpoints": "xs sm md" },
            { "name": "PercentageOfCommitment", "title": Util.getTrans('_commitmentPercentage'), "breakpoints": "xs sm md" },
            { "name": "Rating", "title": Util.getTrans('_rating'), "breakpoints": "xs sm md" },
            //{ "name": "action", "title": Util.getTrans('_action'), "breakpoints": "xs sm md" }
        ];
        if (lsUser.DeptID == Departments.Environmental_Audit_Section) {
            column.splice(5, 0, { "name": "TotalAssessment", "title": Util.getTrans('_taqeem'), "breakpoints": "xs sm md" });
        }
        res.forEach(function (v, i) {
            var gps = v.Lat_X == '0' || v.Lat_X == '' || v.Lat_X == null ? '' : '<a target="_blank" href="https://www.google.com/maps?daddr=' + v.Lat_X + ',' + v.Lng_Y + '"><img src = "images/google-maps.png" width = "15"></a> '
            row.push({
                "number": i + 1,
                // "DepartmentName": v.DepartmentNameAr,
                "TradeLicense": v.TradeLicense,
                "EstablishmentName": '<a href="javascript:;" data-id="' + v.EstablishmentID + '" onclick="ChartsObject.GetEstablishmentVisitsAndViolation(this)">' + v.EstablishmentName + '</a>',
                "Emirate": '<span>' + v.Emirate + ' </span>' + gps,
                "SubCatagory": v.SubCatagory,
                //"GPS":,
                "TotalAssessment": v.TotalAssessment,
                "TotalAudits": v.TotalAudits,
                "TotalInspection": v.TotalInspection,
                "TotalVisit": v.TotalVisit,
                "PercentageOfCommitment": v.PercentageOfCommitment,
                "Rating": v.Rating

                //"action": '<button  type="button" ' + Util.ToolTip('_update') + '   data-id="' + v.ID + '" onclick="GetUpdateEstab(this)" class="btn btn-warning btn-circle-sm waves-effect waves-circle waves-float">\
                //            <i class= "material-icons"> edit</i>\
                //        </button>\
                //        ',

            });
        });
        $('.GetEstablishmentVisitsInfo').footable({
            "paging": {
                "enabled": true
            },
            "filtering": {
                "enabled": true,
                "position": "center"
            },
            "sorting": {
                "enabled": true
            },
            "columns": column,
            "rows": row,
            "empty": Util.getTrans('_noResultFound'),
        });
        FooTable.get('.GetEstablishmentVisitsInfo').pageSize(20);
    },

    GetInspectorsDetailCounts_Markup: function (res) {
        var row = [];
        var column = [
            { "name": "number", "title": '#', "breakpoints": "xs sm", "style": { "minWidth": 5 } },
            // { "name": "DepartmentName", "title": Util.getTrans('_department'), "breakpoints": "xs md" },
            { "name": "Employee", "title": Util.getTrans('_employees'), "breakpoints": "xs sm md", },
            { "name": "PendingTask", "title": Util.getTrans('_pendingItem') },
            { "name": "CompletedTask", "title": Util.getTrans('_completedItem'), "filterable": false },
            { "name": "Audits", "title": Util.getTrans('_audits'), "breakpoints": "xs sm md" },
            { "name": "Inspection", "title": Util.getTrans('_inspection'), "breakpoints": "xs sm md" },
            { "name": "LowRisk", "title": Util.getTrans('_lowRisk'), "breakpoints": "xs sm md" },
            { "name": "MediumRisk", "title": Util.getTrans('_mediumRisk'), "breakpoints": "xs sm md" },
            { "name": "HighRisk", "title": Util.getTrans('_highRisk'), "breakpoints": "xs sm md" },
            { "name": "Pending_incident", "title": "pending incident", "breakpoints": "xs sm md" },
            { "name": "completed_incident", "title": "completed incident", "breakpoints": "xs sm md" },
            //{ "name": "action", "title": Util.getTrans('_action'), "breakpoints": "xs sm md" }
        ];
        if (lsUser.DeptID == Departments.Environmental_Audit_Section) {
            column.splice(4, 0, { "name": "Taqeem", "title": Util.getTrans('_taqeem'), "breakpoints": "xs sm md" });
        }
        res.forEach(function (v, i) {
            row.push({
                "number": i + 1,
                // "DepartmentName": v.DepartmentNameAr,
                "Employee": v.Employee_Name,
                "PendingTask": v.PendingTask,
                "CompletedTask": v.CompletedTask,
                "Audits": v.Audits,
                "Taqeem": v.Taqeem,
                "Inspection": v.Inspection,
                "LowRisk": v.LowRisk,
                "MediumRisk": v.MediumRisk,
                "HighRisk": v.HighRisks,
                "Pending_incident": v.Pending_incident,
                "completed_incident": v.completed_incident

                //"action": '<button  type="button" ' + Util.ToolTip('_update') + '   data-id="' + v.ID + '" onclick="GetUpdateEstab(this)" class="btn btn-warning btn-circle-sm waves-effect waves-circle waves-float">\
                //            <i class= "material-icons"> edit</i>\
                //        </button>\
                //        ',

            });
        });
        $('.GetInspectorsDetailCounts').footable({
            "paging": {
                "enabled": true
            },
            "filtering": {
                "enabled": true,
                "position": "center"
            },
            "sorting": {
                "enabled": true
            },
            "columns": column,
            "rows": row,
            "empty": Util.getTrans('_noResultFound'),
        });
        FooTable.get('.GetInspectorsDetailCounts').pageSize(20);

    },
    GetEstablishmentVisitsAndViolation: function (e) {
        var estabID = e.dataset.id;
        FetchService('POST', config.GetEstablishmentVisitsAndViolation,
            JSON.stringify({ EstablishmentID: estabID, DepartmentID: lsUser.DeptID }), true, function (res) {
                if (res.IsSuccess) {
                    console.log(res);
                    var html = '<div class="clearfix">';
                    res.ResponseData.forEach(function (v) {
                        html += '<div class="col-lg-4 col-md-4 col-sm-6 col-xs-12">\
                                    <div class="card" >\
                                        <div class="header">\
                                            <h2>\
                                                '+ v.VisitDate + '<small>' + Util.getTrans('_createdDate') + '</small>\
                                            </h2>\
                                            <ul class="header-dropdown m-r--5">\
                                            </ul>\
                                        </div>\
                                        <div class="body">';
                        v.objTop3ViolationModel.forEach(function (val) {
                            html += ' <div> ' + val.ViolationAr + '</div>';
                        });
                        html += '</div>\
                                    </div>\
                                </div>';
                    });

                    html += '</div>';
                    ShowModal('#model_AuditDetail');
                    $('#ubody_AuditDetail').html(html);

                }
            }, true);
    },
    GetCounts: function () {
        var data = JSON.parse(ss.allcount);
        $('.ServiceCount_inboxCount').html(data.ServiceCount.inboxCount);
        $('.ServiceCount_pendingCount').html(data.ServiceCount.DelayedTask);
        $('.ServiceCount_completedCount').html(data.ServiceCount.completedCount);
        $('.ServiceCount_UnreadCount').html(data.ServiceCount.UnreadCount);
        $('.ServiceCount_CompletedAsTeamPlayer').html(data.ServiceCount.CompletedAsTeamPlayer);
        $('.ServiceCount_All').html(data.ServiceCount.DelayedTask + data.ServiceCount.completedCount + data.ServiceCount.CompletedAsTeamPlayer);

        $('.BalaghatCount_inboxCount').html(data.BalaghatCount.inboxCount);
        $('.BalaghatCount_pendingCount').html(data.BalaghatCount.DelayedTask);
        $('.BalaghatCount_completedCount').html(data.BalaghatCount.completedCount);
        $('.BalaghatCount_UnreadCount').html(data.BalaghatCount.UnreadCount);

        $('.BalaghatCount_All').html(data.BalaghatCount.inboxCount + data.BalaghatCount.DelayedTask + data.BalaghatCount.completedCount);
    },
    GetAuditType: function () {
        // debugger;
        // if (!$('#collapseOne_3').hasClass('in')) { 
        FetchService('POST', config.GetServiceByAuditType,
            JSON.stringify({ lang: lsUser.inslang }), true, function (res) {
                if (res.IsSuccess) {
                    ChartsObject.ChartsDetails(res, 'chart_AuditType', ChartType.Doughunt);
                }
            }, false);
        // }
    },
    GetRiskLevel: function () {
        // debugger;
        // if (!$('#collapseOne_3').hasClass('in')) { 
        FetchService('POST', config.GetServiceByRisklevel,
            JSON.stringify({ lang: lsUser.inslang }), true, function (res) {
                if (res.IsSuccess) {
                    ChartsObject.ChartsDetails(res, 'chart_Risklevel', ChartType.Doughunt, ["#8BC34A", "#FF9800", "#ff625f"]);
                }
            }, false);
        // }
    },
    DountChart: function (divId, deptIDs) {
        FetchService('POST', config.GetTotalItem_Dashboard, JSON.stringify({ DeptID: deptIDs }), false, function (res) {
            var r = res.ResponseData;
            console.log(res.ResponseData);
            configdb = {
                type: 'doughnut',
                data: {
                    datasets: [{
                        data: [r.LateTask, r.PendingTask, r.CompletedTask],
                        backgroundColor: ['rgb(233, 30, 99)', 'rgb(255, 152, 0)', 'rgb(0, 150, 136)'],
                    }],
                    labels: [Util.getTrans('_lateTask') + " - " + r.LateTask, Util.getTrans('_inProgress') + " - " + r.PendingTask,
                    Util.getTrans('_completedTask') + " - " + r.CompletedTask],
                },
                options: {
                    responsive: true,
                    legend: {
                        position: 'bottom',
                        fontFamily: "Verdana, 'Droid Arabic Kufi', Fallback, sans-serif",
                        display: true,
                        fullWidth: true,
                        labels: {
                            fontSize: 12,
                            fontColor: '#000',
                            fontFamily: 'moccaeFont, Fallback, sans-serif',
                        },
                    }
                }
            };
            i++;
            var ctx = document.getElementById(divId).getContext('2d');
            var charta = new Chart(ctx, configdb);

            //Morris.Donut({
            //    element: element,
            //    data: [
            //        {
            //            label: Util.getTrans('_lateTask'),
            //            value: r.LateTask
            //        }, {
            //            label: Util.getTrans('_inProgress'),
            //            value: r.PendingTask
            //        }, {
            //            label: Util.getTrans('_completedTask'),
            //            value: r.CompletedTask
            //        }],
            //    colors: ['rgb(233, 30, 99)', 'rgb(255, 152, 0)', 'rgb(0, 150, 136)'],
            //    formatter: function (y) {
            //        return y;
            //    }
            //});
        });
    },
    ChartsDetails: function (r, chartID, TypeChart, bgColor) {
        //debugger;
        // $('#pie_chart_myTask').hide();
        //r = JSON.parse(r);
        console.log(r);
        var configdb = null;
        var arr = [];
        var stateName = [];
        bgColor = bgColor != undefined ? bgColor : ["#ff625f", "#93c548", "#92bccf", "#febd01", "#f55e00", '#3ea2cf', "#6b6acf"];
        //debugger;
        $.each(r.ResponseData, function (key, c) {
            stateName.push(c.stateName + " - " + c.count + "");
            arr.push(c.count);
        });
        //var labels = ls.agriApp_lang == "ar" ? ["الفجيرة", "رأس الخيمة", "ام القيوين", "عجمان", "الشارقة", "دبي", "أبوظبي"].reverse()
        //            : ["Abu Dhabi", "Dubai", "Sharjah", "Ajman", "Umm Al Quwain", "Ras Al Khaima", "Fujairah"];

        configdb = {
            //type: 'doughnut',
            type: TypeChart,
            data: {
                datasets: [{
                    data: arr,
                    backgroundColor: i % 2 == 0 ? bgColor : bgColor.reverse(),
                }],
                labels: stateName,
                //labels: labels
            },
            options: {
                responsive: true,
                defaultFontFamily: "Verdana, 'Droid Arabic Kufi', Fallback, sans-serif",
                legend: {
                    position: 'right',
                    fontFamily: "Verdana, 'Droid Arabic Kufi', Fallback, sans-serif",
                    display: true,
                    fullWidth: true,
                    // reverse: true,
                    labels: {
                        fontColor: '#000',
                        defaultFontFamily: "Verdana, 'Droid Arabic Kufi', Fallback, sans-serif",
                    }
                }
            }
        };
        i++;
        var ctx = document.getElementById(chartID).getContext('2d');
        var charta = new Chart(ctx, configdb);
        charta.config.options.defaultFontFamily = "Verdana, 'Droid Arabic Kufi', Fallback, sans-serif";
        charta.update();
    },
};
function OpenDateRangePopUp(type) {
    Util.updateFromToDates();
    var template = $('.DateRange_Template').html();
    template = template.replace('{type}', type);

    $('#body_notificationList').html(template);
    ShowModal('#mdModalNotification');
}
function SearchDate(type) {

    var fromDate = $('#start_ChangeDate').val();
    var toDate = $('#to_ChangeDate').val();
    if (fromDate != '') {
        if (type == "establishment") {
            ChartsObject.GetEstablishmentVisitsInfo_forDeptHead(fromDate, toDate);
        } else if (type == "inspector") {
            ChartsObject.GetInpectorDetailForDeptHead(fromDate, toDate);
        }
    }
}

function GetFromDate() {
    var currDate = Util.getDateForTextbox(new Date().toLocaleString());
    var lastYear = parseInt(currDate.split('-')[0]) - 1
    lastYear = lastYear + "-" + currDate.split('-')[1] + "-" + currDate.split('-')[2];

    FromToDateEnum.From = $('#start_ChangeDate').val() || lastYear;
    FromToDateEnum.To = $('#to_ChangeDate').val() || Util.getDateForTextbox(new Date());
    return FromToDateEnum;
}