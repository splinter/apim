var resource=(function(){

    var log=new Log('application-logic');

    var getApplications=function(context){

        var AppService = require('/extensions/assets/api/services/app.js').serviceModule;

        appApi = new AppService.AppService();

        appApi.init(jagg,session);

        return appApi.getApplications('admin');

    };

    return{
        get:getApplications
    }
})();