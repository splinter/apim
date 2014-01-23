$(function () {

    /*
     The location of the templates used in the rendering
     */
    var API_SUBS_URL = '/store/resources/api/v1/subscription/';
    var API_TOKEN_URL = '/store/resources/api/v1/apptoken/a';
    var API_DOMAIN_URL='/store/resources/api/v1/domain/a';

    /*
     The containers in which the UI components will be rendered
     */
    var CONTROL_CONTAINER = '#subscription-control-panel';
    var SUBS_LIST_CONTAINER = '#subscription-list';

    var PROD_KEYS_CONTAINER = '#prod-token-view';
    var PROD_DOMAIN_CONTAINER = '#prod-domain-view';
    var SAND_KEYS_CONTAINER = '#sand-token-view';
    var SAND_DOMAIN_CONTAINER = '#sand-domain-view';


    var EV_APP_SELECT = 'eventAppSelection';
    var EV_SHOW_KEYS = 'eventShowKeys';
    var EV_HIDE_KEYS = 'eventHideKeys';
    var EV_REGENERATE_TOKEN = 'eventRegenerateToken';
    var EV_UPDATE_DOMAIN = 'eventUpdateDomain';
    var EV_GENERATE_PROD_TOKEN = 'eventGenerateProductionToken';
    var EV_GENERATE_SAND_TOKEN = 'eventGenerateSandboxToken';

    var APP_STORE={};

    /*
     The function returns the subscriptions of the given application
     */
    var findSubscriptionDetails = function (appName) {
        var apps = metadata.appsWithSubs;
        var app;
        for (var appIndex in apps) {
            app = apps[appIndex];

            if (app.name == appName) {
                return app.subscriptions;
            }
        }

        return [];
    };

    /*

     */
    var findAppDetails = function (appName) {
        var apps = metadata.appsWithSubs;
        var app;
        for (var appIndex in apps) {
            app = apps[appIndex];

            if (app.name == appName) {
                return app;
            }
        }

        return null;
    };


    var attachGenerateProdToken = function () {
        ///We need to prevent the afterRender function from been inherited by child views
        //otherwise this method will be invoked by child views
        //console.info('Attaching generate button');
        $('#btn-generate-Production-token').on('click', function () {
            var appName = $('#subscription-selection').val();
            var appDetails = findAppDetails(appName);
            var tokenRequestData = {};
            tokenRequestData['appName'] = appName;
            tokenRequestData['keyType'] = 'Production';
            tokenRequestData['accessAllowDomains'] = 'ALL';
            tokenRequestData['callbackUrl'] = appDetails.callbackUrl||'';
            tokenRequestData['validityTime'] = appDetails.prodValidityTime;
            $.ajax({
                type: 'POST',
                url: API_TOKEN_URL,
                data: tokenRequestData,
                success: function (data) {
                    var jsonData=JSON.parse(data);
                    APP_STORE.productionKeys=jsonData;
                    events.publish(EV_GENERATE_PROD_TOKEN,jsonData);
                }
            });
        });
    };

    var attachGenerateSandToken = function () {

        $('#btn-generate-Sandbox-token').on('click', function () {
            var appName = $('#subscription-selection').val();
            var appDetails=findAppDetails(appName);
            var tokenRequestData = {};
            tokenRequestData['appName'] = appName;
            tokenRequestData['keyType'] = 'Sandbox';
            tokenRequestData['accessAllowDomains'] = 'ALL';
            tokenRequestData['callbackUrl'] = appDetails.callbackUrl||'';
            tokenRequestData['validityTime'] = appDetails.prodValidityTime;
            $.ajax({
                type: 'POST',
                url: API_TOKEN_URL,
                data: tokenRequestData,
                success: function (data) {
                    var jsonData=JSON.parse(data);
                    APP_STORE.sandboxKeys=jsonData;
                    events.publish(EV_GENERATE_SAND_TOKEN,jsonData);
                }
            });

        });
    };

    /*
    The function sets up the production domain update button to
    send an update request to the remote api
     */
    var attachUpdateProductionDomains=function(){

        $('#btn-Production-updateDomains').on('click',function(){
            var allowedDomains=$('#input-Production-allowedDomains').val();
            console.info(JSON.stringify(APP_STORE.productionKeys));
            var domainUpdateData={};
            domainUpdateData['accessToken']=APP_STORE.productionKeys.accessToken;
            domainUpdateData['accessAllowedDomains']=allowedDomains;

            console.info('***Domain Update Data****');
            console.info(JSON.stringify(domainUpdateData));
            $.ajax({
               type:'PUT',
               url:API_DOMAIN_URL,
               contentType:'application/json',
               data:JSON.stringify(domainUpdateData),
               success:function(data){
                    console.info('Domain updated successfully');
               }
            });
        });
    };

    var attachUpdateSandboxDomains=function(){

        $('#btn-Sandbox-updateDomains').on('click',function(){
            var allowedDomains=$('#input-Sandbox-allowedDomains').val();
            console.info(JSON.stringify(APP_STORE.productionKeys));
            var domainUpdateData={};
            domainUpdateData['accessToken']=APP_STORE.sandboxKeys.accessToken;
            domainUpdateData['accessAllowedDomains']=allowedDomains;

            console.info('***Sanbox Domain Update Data***');
            console.info(JSON.stringify(domainUpdateData));
            $.ajax({
                type:'PUT',
                url:API_DOMAIN_URL,
                contentType:'application/json',
                data:JSON.stringify(domainUpdateData),
                success:function(data){
                    console.info('Domain updated successfully');
                }
            });
        });
    };

    /*
    The function listens for the user to check and uncheck the show keys checkbox
    and then broadcasts the appropriate event
     */
    var attachShowCheckbox=function(){

         $('#input-checkbox-showkeys').change(function(){
             var isChecked=$('#input-checkbox-showkeys').prop('checked');
             console.info('Show Keys: '+isChecked);
             APP_STORE['showKeys']=isChecked;
         });
    };


    events.register(EV_APP_SELECT);
    events.register(EV_SHOW_KEYS);
    events.register(EV_REGENERATE_TOKEN);
    events.register(EV_GENERATE_PROD_TOKEN);
    events.register(EV_UPDATE_DOMAIN);
    events.register(EV_GENERATE_SAND_TOKEN);

    /*
     Keys View
     The default view which prompts the user to generate a key
     */

    //Production view
    Views.extend('view', {
        id: 'defaultProductionKeyView',
        container: PROD_KEYS_CONTAINER,
        partial: 'subscriptions/sub-keys-generate',
        beforeRender: function (data) {
            data['environment'] = Views.translate('Production');
        },
        afterRender: attachGenerateProdToken,
        subscriptions: [EV_APP_SELECT]
    });

    Views.extend('defaultProductionKeyView', {
        id: 'visibleProductionKeyView',
        partial: 'subscriptions/sub-keys-visible',
        subscriptions: [EV_SHOW_KEYS, EV_GENERATE_PROD_TOKEN],
        resolveRender: function () {
            //If the user has ticked show keys render the view
            return true;
        },
        afterRender: function () {
        }
    });

    Views.extend('defaultProductionKeyView', {
        id: 'hiddenProductionKeyView',
        disabled: true,
        subscriptions: [EV_HIDE_KEYS],
        resolveRender: function () {
            //If the user has clicked the show keys then do not render
            return true;
        },
        afterRender: function () {
        }
    });

    //Sandbox view
    Views.extend('defaultProductionKeyView', {
        id: 'defaultSandboxKeyView',
        container: SAND_KEYS_CONTAINER,
        afterRender: attachGenerateSandToken,
        beforeRender: function (data) {
            data['environment'] = Views.translate('Sandbox');
        }
    });

    Views.extend('defaultSandboxKeyView', {
        id: 'visibleSandboxKeyView',
        partial: 'subscriptions/sub-keys-visible',
        afterRender: function () {
        },
        subscriptions: [EV_SHOW_KEYS, EV_GENERATE_SAND_TOKEN]
    });

    /*
     Domain View
     */

    //Production view
    Views.extend('view', {
        id: 'defaultProductionDomainView',
        container: PROD_DOMAIN_CONTAINER,
        partial: 'subscriptions/sub-domain-token',
        beforeRender:function(data){
          data['environment']=Views.translate('Production');
        },
        subscriptions: [EV_APP_SELECT],
        afterRender: function () {
        }
    });

    Views.extend('defaultProductionDomainView', {
        id: 'updateProductionDomainView',
        partial: 'subscriptions/sub-domain-update',
        subscriptions: [EV_GENERATE_PROD_TOKEN],
        afterRender:attachUpdateProductionDomains
    });

    //Sandbox view
    Views.extend('defaultProductionDomainView', {
        id: 'defaultSandboxDomainView',
        container: SAND_DOMAIN_CONTAINER,
        beforeRender:function(data){
          data['environment']=Views.translate('Sandbox');
        },
        afterRender: function () {
        }
    });

    Views.extend('defaultSandboxDomainView', {
        id: 'updateSandboxDomainVIew',
        partial: 'subscriptions/sub-domain-update',
        afterRender: attachUpdateSandboxDomains,
        subscriptions: [EV_GENERATE_SAND_TOKEN]
    });

    /*
     API Subscription listing view
     */
    Views.extend('view', {
        id: 'defaultAPISubscriptionsView',
        container: SUBS_LIST_CONTAINER,
        partial: 'subscriptions/sub-listing',
        beforeRender: function (data) {
            var appName = data.appName;
            data['subscriptions'] = findSubscriptionDetails(appName);
        },
        subscriptions: [EV_APP_SELECT],
        afterRender: function () {
        }
    });


    /*
     Control panel containing the Show Keys checkbox
     -Rendered when the user selects an application
     */

    Views.extend('view', {
        id: 'keyControlPanelView',
        container: CONTROL_CONTAINER,
        partial: 'subscriptions/sub-control-panel',
        subscriptions: [EV_APP_SELECT],
        afterRender: attachShowCheckbox
    });


    var defaultAppName = $('#subscription-selection').val();
    events.publish(EV_APP_SELECT, {appName: defaultAppName});

    //Connect the events
    $('#subscription-selection').on('change', function () {
        var appName = $('#subscription-selection').val();
        APP_STORE={};
        APP_STORE['appName']=appName;
        APP_STORE['appDetails']=findAppDetails(appName);
        APP_STORE['productionKeys']=null;
        APP_STORE['sandboxKeys']=null;
        events.publish(EV_APP_SELECT, {appName: appName});
    });


});