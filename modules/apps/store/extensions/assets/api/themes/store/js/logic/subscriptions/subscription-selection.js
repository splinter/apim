$(function () {

    /*
     The location of the templates used in the rendering
     */
    var CONTROL_PANEL_TEMPLATE = '#subscription-control-panel-template';
    var SUBSCRIPTIONS_LIST_TEMPLATE = '#subscriptions-list-template';
    var SUBSCRIPTION_KEYS_TEMPLATE = '#subscriptions-keys-template';
    var API_SUBS_URL = '/store/resources/api/v1/subscription/';

    /*
     The containers in which the UI components will be rendered
     */
    var CONTROL_CONTAINER = '#subscription-control-panel';
    var SUBS_LIST_CONTAINER = '#subscription-list';
    var SUBS_KEYS_CONTAINER = '#subscription-keys';


    console.info('Listening for the selected subscription to be changed');

    $('#subscription-selection').on('change', function () {
        console.info('The user has changed the selection');

        loadUI();
        var selectedAppName = $('#subscription-selection').val();
        populateApisWithSub(selectedAppName);
    });

    /*
     The function loads the UI from the templates embedded in the page
     */
    var loadUI = function () {
        var controlPanelTemplate = Handlebars.compile($(CONTROL_PANEL_TEMPLATE).html());
        var subsListTemplate = Handlebars.compile(apiListTemplate);//$(SUBSCRIPTIONS_LIST_TEMPLATE).html());
        var keysTemplate = Handlebars.compile($(SUBSCRIPTION_KEYS_TEMPLATE).html());

        $(SUBS_LIST_CONTAINER).html('');
        $(CONTROL_CONTAINER).html('');

        $(CONTROL_CONTAINER).html(controlPanelTemplate());
        //$(SUBS_LIST_CONTAINER).html(subsListTemplate());
        //$(SUBS_KEYS_CONTAINER).html(keysTemplate());
    };

    /*
     The function deconstructs the UI when the user switches to working on a new subscription
     */
    var destroyUI = function () {

    };

    /*
     The function populates the list of APIs to which the app subscribes
     */
    var populateApisWithSub = function (appName) {
        $.ajax({
            url: API_SUBS_URL + appName,
            type: 'GET',
            success: function (data) {
                console.log('Successfully obtained the list of APIs');
                console.log(data);
                var apis = JSON.parse(data);
                //Clear the existing data
                $(SUBS_LIST_CONTAINER).html('');
                var subsListTemplate = Handlebars.compile(apiListTemplate);
                console.log(JSON.stringify(apis[0].apiName));
                var result = subsListTemplate(apis);
                //Display the data
                $(SUBS_LIST_CONTAINER).html(subsListTemplate(apis));
            }
        })
    };

    var apiListTemplate = '<hr/><h4>Subscribed APIs</h4><div class="row-fluid">{{#each .}}' +
        '<div class="span3 asset"> ' +
        '<div class="asset-icon">' +
        '<img src="/store/extensions/assets/api/themes/store/img/default_thumb.jpg"/>' +
        '</div>' +
        '<div class="asset-details">' +
        '<div class="asset-name">' +
        '{{apiName}}' +
        '</div>' +
        '</div>' +
        '</div>' +
        '{{/each}}</div>';
});