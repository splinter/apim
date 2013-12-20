$(function () {
    var CONTAINER='swagger-ui-container';
    var CONTAINER_ID='#'+CONTAINER;
    var DATA_DISCOVERYURL_KEY='apimStoreApiDiscoveryurl';
    var SWAGGER_SUPPORTED_SUBMIT_METHODS=['get', 'post', 'put', 'delete', 'options'];
    var SWAGGER_API_KEY_NAME='authorization';
    var SWAGGER_SUPPORT_HEADER_PARAMS=true;
    var SWAGGER_DOC_EXPANSION='none';

    var discoveryUrl = $(CONTAINER_ID).data(DATA_DISCOVERYURL_KEY) || null;

    //Support for IE
    var console = (typeof console == undefined) ? {log: function (msg) {
    }} : console;

    //Do not load swagger if there is no discovery URL
    if (!discoveryUrl) {
        console.log('Unable to locate discoveryUrl');
        return;
    }

    window.swaggerUi = new SwaggerUi({
        discoveryUrl:discoveryUrl,
        dom_id:CONTAINER,
        apiKeyName: SWAGGER_API_KEY_NAME,
        supportHeaderParams: SWAGGER_SUPPORT_HEADER_PARAMS,
        supportedSubmitMethods: SWAGGER_SUPPORTED_SUBMIT_METHODS,
        onComplete: function(swaggerApi, swaggerUi){
            if(console) {
                console.log("Loaded SwaggerUI");
                console.log(swaggerApi);
                console.log(swaggerUi);
            }
           // $('ul.endpoints').show();
        },
        onFailure: function(data) {
            if(console) {
                console.log("Unable to Load SwaggerUI");
                console.log(data);
            }
        },
        docExpansion: SWAGGER_DOC_EXPANSION
    });
    window.swaggerUi.load();


});
