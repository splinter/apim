/*
 Description: The script is used to manage the keys for a given application subscription
 Filename: key.js
 Created Date: 20/1/2014
 */
var serviceModule = (function () {

    var log = new Log('keyservice');

    function KeyService() {
        this.instance = null;
    }

    KeyService.prototype.init = function (context, session) {
        this.instance = context.module('manager').getAPIStoreObj();
        this.subModule = context.module('subscription');
    };

    /*
     options.apiProvider
     options.apiName
     options.apiVersion
     options.appContext
     options.appName
     options.username
     options.keyType
     options.callbackUrl
     */
    KeyService.prototype.generateAPIKey = function (options) {
        var result = this.instance.getKey(options.apiProvider,
            options.apiName,
            options.apiVersion,
            options.appContext,
            options.appName,
            options.username,
            options.keyType,
            options.callbackUrl);

        return result.key;
    };

    /*
     options.username:
     options.appName:
     options.keyType
     options.callbackUrl
     options.accessAllowDomains
     options.validityTime
     */
    KeyService.prototype.generateApplicationKey = function (options) {
        //log.info()
        log.info(options);
       // var result = this.instance.getApplicationKey(options.username, options.appName, options.keyType, options.callbackUrl,
       //     options.accessAllowDomains, options.validityTime);

        var result = this.subModule.generateApplicationKey( options.appName,options.username, options.keyType, options.callbackUrl,
             options.accessAllowDomains, options.validityTime);

        return result.key;
    };

    /*
     options.username
     options.appName
     options.keyType
     options.oldAccessToken
     options.accessAllowDomains
     options.clientId = consumerKey
     options.clientSecret = consumerSecret
     options.validityTime
     */
    KeyService.prototype.refreshToken = function (options) {
        log.info('***************');
        log.info(options);
        var result = this.subModule.refreshToken(options.username,
            options.appName,
            options.keyType,
            options.oldAccessToken,
            options.accessAllowDomains,
            options.clientId,
            options.clientSecret,
            options.validityTime);

        log.info(key);
        return result.key;
    };

    /*
     options.oldAccessToken
     options.accessAllowDomains
     */
    KeyService.prototype.updateAccessAllowDomains = function (options) {
        log.info(options);
        var accessAllowDomains = this.subModule.updateAccessAllowDomains(options.accessToken,
            options.accessAllowDomains);

        log.info(accessAllowDomains);
    };

    return{
        KeyService: KeyService
    }

})();