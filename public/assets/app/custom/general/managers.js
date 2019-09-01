"use strict";

// Class definition
var KTManagers = function() {    
    var getmanagersList = function() {
        var loading = new KTDialog({'type': 'loader', 'placement': 'top center', 'message': 'Loading ...'});
        $.ajax({
            type: 'GET',
            url: `http://${window.location.host}/managers`,
            data: {},
            beforeSend: function(){                
                loading.show();
            },
            success: function(result){
                loading.hide();
                var str = '<div class="row">';
                $.each(result.data, function(index, provider){
                    //alert(provider.name + ' | ' + provider.logo);
                    str += '<div class="col-lg-3"><a href="javascript:;" class="selectionBankProvider" data-id="'+provider.id+'"><img src="'+provider.logo+'" alt="'+provider.name+'"/></a></div>';
                });
                str += '<div class="row">';
                $('#providerContainer .modal-body').html(str);
            }
        });
    }

    var getBankProviderDetail = function(providerID) {
        var loading = new KTDialog({'type': 'loader', 'placement': 'top center', 'message': 'Loading ...'});
        $.ajax({
            type: 'GET',
            url: `http://${window.location.host}/accounts/getbankproviderdetail/${providerID}`,
            data: {},
            beforeSend: function(){                
                loading.show();
            },
            success: function(result){
                loading.hide();
                var str = '';
                $('#providerContainer .modal-body').html(str);
            }
        });
    }
    return {
        // Init demos
        init: function() {
            if($('#ctrlBankProviders').length > 0){
                $(document).on('click', '#ctrlBankProviders', function(){
                    getBankProvidersList();
                });
            }
            $(document).on('click', '.selectionBankProvider', function(){
                var providerID = $(this).attr('data-id');
                getBankProviderDetail(providerID);
            });
        }
    };
}();

// Class initialization on page load
jQuery(document).ready(function() {
    KTManagers.init();
});