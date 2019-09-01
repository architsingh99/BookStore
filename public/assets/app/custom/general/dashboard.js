"use strict";

// Class definition
var KTDashboard = function() {
    var dashboardStatsAndCounts = function() {
        if (!KTUtil.getByID('managersCount') 
        && !KTUtil.getByID('boostersCount') 
        && !KTUtil.getByID('customersCount') 
        && !KTUtil.getByID('assistantsCount') ) {
            return;
        }
        console.log('12', window.location.protocol, window.location.host, `${window.location.protocol}//${window.location.host}/`);
        var $customerCountBody = $('#customersCount').children('.kt-portlet__body');
        var $boosterCountBody = $('#boostersCount').children('.kt-portlet__body');
        var $managersCountBody = $('#managersCount').children('.kt-portlet__body');
        var $assistantsCountBody = $('#assistantsCount').children('.kt-portlet__body');
        $.ajax({
            type: 'GET',
            url: `dashboard/recordcounts`,
            data: {},
            success: function(response){
                $customerCountBody.html(response.data.customers);
                $boosterCountBody.html(response.data.boosters);
                $managersCountBody.html(response.data.managers);
                $assistantsCountBody.html(response.data.assistants);
            }
        });

    }
    
    var customerRegistrationShare = function() {        
        if (!KTUtil.getByID('kt_chart_cus_reg_share')) {
            return;
        }

        var randomScalingFactor = function() {
            return Math.round(Math.random() * 100);
        };

        $.ajax({
            type: 'GET',
            url: `admin/dashboard/recordcounts`,
            data: {},
            beforeSend: function(){

            },
            success: function(result){
                var total = 0;
                var strLegand = '';
                var dataArray = Array();
                var colorArray = Array();
                var labelArray = Array();
                result.data.forEach(function (item) { 
                    dataArray.push(item.count);
                    if(item.name=='teacher'){
                        colorArray.push(KTApp.getStateColor('danger'));
                    }

                    if(item.name=='student'){
                        colorArray.push(KTApp.getStateColor('brand'));
                    }

                    if(item.name=='parent'){
                        colorArray.push(KTApp.getStateColor('success'));
                    }

                    if(item.name=='principle'){
                        colorArray.push(KTApp.getStateColor('warning'));
                    }

                    labelArray.push(item.name);
                    total = parseInt(total) + parseInt(item.count);
                });
                
                for(var i=0; i<dataArray.length; i++){
                    var percent = parseFloat((parseInt(dataArray[i])/parseInt(total))*100);
                    var strLegand = strLegand + '<div class="kt-widget14__legend"><span class="kt-widget14__bullet kt-bg-success"></span><span class="kt-widget14__stats">'+percent+'% '+labelArray[i]+'</span></div>';
                }
                $('#total_user_count').html(total);
                $('#user_share_legend').html(strLegand);
                var config = {
                    type: 'doughnut',
                    data: {
                        datasets: [{
                            data: dataArray,
                            backgroundColor: colorArray
                        }],
                        labels: labelArray
                    },
                    options: {
                        cutoutPercentage: 75,
                        responsive: true,
                        maintainAspectRatio: false,
                        legend: {
                            display: false,
                            position: 'top',
                        },
                        title: {
                            display: false,
                            text: 'Technology'
                        },
                        animation: {
                            animateScale: true,
                            animateRotate: true
                        },
                        tooltips: {
                            enabled: true,
                            intersect: false,
                            mode: 'nearest',
                            bodySpacing: 5,
                            yPadding: 10,
                            xPadding: 10, 
                            caretPadding: 0,
                            displayColors: false,
                            backgroundColor: KTApp.getStateColor('brand'),
                            titleFontColor: '#ffffff', 
                            cornerRadius: 4,
                            footerSpacing: 0,
                            titleSpacing: 0
                        }
                    }
                };
        
                var ctx = KTUtil.getByID('kt_chart_cus_reg_share').getContext('2d');
                var myDoughnut = new Chart(ctx, config);
            }
        });

        
    }

    /*author count section start*/
    var authorRegistrationShare = function() {        
        if (!KTUtil.getByID('kt_chart_author_reg_share')) {
            return;
        }

        var randomScalingFactor = function() {
            return Math.round(Math.random() * 100);
        };

        $.ajax({
            type: 'GET',
            url: `dashboard/getallAuthorCount`,
            data: {},
            beforeSend: function(){

            },
            success: function(result){
                var total = 0;
                var strLegand = '';
                var dataArray = Array();
                var colorArray = Array();
                var labelArray = Array();
                 result.data.forEach(function (item) {
                   
                    dataArray.push(result.data.length);
                    if(item.status=='Inactive'){
                        colorArray.push(KTApp.getStateColor('danger'));
                    }
                    colorArray.push(KTApp.getStateColor('success'));
                    labelArray.push(item.title);
                    total = parseInt(result.data.length);
                });
                for(var i=0; i<dataArray.length; i++){
                    var percent = parseFloat((parseInt(dataArray[i])/parseInt(total))*100);
                    var strLegand = strLegand + '<div class="kt-widget14__legend"><span class="kt-widget14__bullet kt-bg-success"></span><span class="kt-widget14__stats"> '+labelArray[i]+'</span></div>';
                }
                $('#total_author_count').html(total);
                $('#user_author_legend').html(strLegand);
                var config = {
                    type: 'doughnut',
                    data: {
                        datasets: [{
                           data: dataArray,
                            backgroundColor: colorArray
                        }],
                        labels: labelArray
                    },
                    options: {
                        cutoutPercentage: 75,
                        responsive: true,
                        maintainAspectRatio: false,
                        legend: {
                            display: false,
                            position: 'top',
                        },
                        title: {
                            display: false,
                            text: 'Technology'
                        },
                        animation: {
                            animateScale: true,
                            animateRotate: true
                        },
                        tooltips: {
                            enabled: true,
                            intersect: false,
                            mode: 'nearest',
                            bodySpacing: 5,
                            yPadding: 10,
                            xPadding: 10, 
                            caretPadding: 0,
                            displayColors: false,
                            backgroundColor: KTApp.getStateColor('brand'),
                            titleFontColor: '#ffffff', 
                            cornerRadius: 4,
                            footerSpacing: 0,
                            titleSpacing: 0
                        }
                    }
                };
        
                var ctx = KTUtil.getByID('kt_chart_author_reg_share').getContext('2d');
                var myDoughnut = new Chart(ctx, config);
            }
        });

        
    }

    //genre count section start
    var genreRegistrationShare = function() {        
        if (!KTUtil.getByID('kt_chart_genre_reg_share')) {
            return;
        }

        var randomScalingFactor = function() {
            return Math.round(Math.random() * 100);
        };

        $.ajax({
            type: 'GET',
            url: `dashboard/getallGenreCount`,
            data: {},
            beforeSend: function(){

            },
            success: function(result){
                var total = 0;
                var strLegand = '';
                var dataArray = Array();
                var colorArray = Array();
                var labelArray = Array();
                 result.data.forEach(function (item) {
                   
                    dataArray.push(result.data.length);
                    if(item.status=='Inactive'){
                        colorArray.push(KTApp.getStateColor('danger'));
                    }
                    colorArray.push(KTApp.getStateColor('success'));
                    labelArray.push(item.title);
                    total = parseInt(result.data.length);
                });
                for(var i=0; i<dataArray.length; i++){
                    var percent = parseFloat((parseInt(dataArray[i])/parseInt(total))*100);
                    var strLegand = strLegand + '<div class="kt-widget14__legend"><span class="kt-widget14__bullet kt-bg-success"></span><span class="kt-widget14__stats"> '+labelArray[i]+'</span></div>';
                }
                $('#total_genre_count').html(total);
                $('#user_genre_legend').html(strLegand);
                var config = {
                    type: 'doughnut',
                    data: {
                        datasets: [{
                           data: dataArray,
                            backgroundColor: colorArray
                        }],
                        labels: labelArray
                    },
                    options: {
                        cutoutPercentage: 75,
                        responsive: true,
                        maintainAspectRatio: false,
                        legend: {
                            display: false,
                            position: 'top',
                        },
                        title: {
                            display: false,
                            text: 'Technology'
                        },
                        animation: {
                            animateScale: true,
                            animateRotate: true
                        },
                        tooltips: {
                            enabled: true,
                            intersect: false,
                            mode: 'nearest',
                            bodySpacing: 5,
                            yPadding: 10,
                            xPadding: 10, 
                            caretPadding: 0,
                            displayColors: false,
                            backgroundColor: KTApp.getStateColor('brand'),
                            titleFontColor: '#ffffff', 
                            cornerRadius: 4,
                            footerSpacing: 0,
                            titleSpacing: 0
                        }
                    }
                };
        
                var ctx = KTUtil.getByID('kt_chart_genre_reg_share').getContext('2d');
                var myDoughnut = new Chart(ctx, config);
            }
        });

        
    }
    
    

    return {
        // Init demos
        init: function() {
            dashboardStatsAndCounts();
            customerRegistrationShare();
            authorRegistrationShare();
            genreRegistrationShare();
            
            // demo loading
            var loading = new KTDialog({'type': 'loader', 'placement': 'top center', 'message': 'Loading ...'});
            loading.show();

            setTimeout(function() {
                loading.hide();
            }, 3000);
        }
    };
}();

// Class initialization on page load
jQuery(document).ready(function() {
    KTDashboard.init();
});