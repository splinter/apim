$(function(){
    window.swaggerUi = new SwaggerUi({
        discoveryUrl:"http://10.100.0.146:8280/testapi2/1.0.0",
        dom_id:"swagger-ui-container",
        apiKeyName: "authorization",
        supportHeaderParams: true,
        supportedSubmitMethods: ['get', 'post', 'put', 'delete', 'options'],
        onComplete: function(swaggerApi, swaggerUi){
            if(console) {
                console.log("Loaded SwaggerUI");
                console.log(swaggerApi);
                console.log(swaggerUi);
            }
            $('ul.endpoints').show();
        },
        onFailure: function(data) {
            if(console) {
                console.log("Unable to Load SwaggerUI");
                console.log(data);
            }
        },
        docExpansion: "none"
    });
    window.swaggerUi.load();
});
