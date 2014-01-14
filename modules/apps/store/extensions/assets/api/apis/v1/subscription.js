var resource = (function () {

    var SubscriptionService;
    var subsApi;

    var log = new Log('subscription-api');

    SubscriptionService = require('/extensions/assets/api/services/subscription.js').serviceModule;
    subsApi = new SubscriptionService.SubscriptionService();

    subsApi.init(jagg, session);

    /*
     Subscribes the given application to an API with the provided details
     */
    var addSubscription = function (context) {
        var parameters = context.request.getAllParameters();
        var subscription = {};
        subscription['apiName'] = parameters.apiName;
        subscription['apiVersion'] = parameters.apiVersion;
        subscription['apiTier'] = parameters.apiTier;
        subscription['apiProvider'] = parameters.apiProvider;
        subscription['appName']=parameters.appName;
        subscription['user']='admin'; //TODO: Get the user from the session or as a request parameter?

        var result=subsApi.addSubscription(subscription);

        log.info(result);

        return result;
    };


    return{
        post: addSubscription
    }

})();