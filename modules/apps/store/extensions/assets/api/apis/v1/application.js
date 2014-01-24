var resource = (function () {
    var log = new Log('application-api');

    var addApplication = function (context) {

        log.info('Adding an application');
        var parameters = context.request.getAllParameters();

        for (var key in parameters) {
            log.info(key + ' ' + parameters[key]);
        }

        var AppService = require('/extensions/assets/api/services/app.js').serviceModule;

        appApi = new AppService.AppService();

        appApi.init(jagg, session);

        var result = appApi.addApplication({
            username: 'admin',
            application: parameters.appName,
            tier: parameters.appTier,
            callbackUrl: parameters.appCallbackUrl,
            description: parameters.appDescription
        });

        return result;
    };

    var deleteApplication = function (context) {

        var AppService = require('/extensions/assets/api/services/app.js').serviceModule;

        appApi = new AppService.AppService();

        appApi.init(jagg, session);

        //var isRemoved=appApi.deleteApplication()

        return {isRemoved: false};
    };

    var updateApplication = function (context) {
        var parameters = request.getContent();

        var AppService = require('/extensions/assets/api/services/app.js').serviceModule;

        appApi = new AppService.AppService();

        appApi.init(jagg, session);

        var result=appApi.updateApplication({
            newAppName:parameters.newAppName,
            oldAppName:parameters.oldAppName,
            username:'admin',
            tier:parameters.tier,
            callbackUrl:parameters.callbackUrl,
            description:parameters.description
        });

        return result;
    };

    return{
        post: addApplication,
        delete: deleteApplication,
        put:updateApplication
    }

})();
