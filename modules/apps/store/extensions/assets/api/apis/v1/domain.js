var resource=(function(){

    var log=new Log('domain-api');


    /*
    The function updates all of the domains
     */
    var updateDomains=function(context){

        var KeyService=require('/extensions/assets/api/services/key.js').serviceModule;

        var keyApi=new KeyService.KeyService();

        keyApi.init(jagg,session);

    };

    return{
        put:updateDomains
    };

})();