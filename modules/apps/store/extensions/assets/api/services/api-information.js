var serviceModule = (function () {

    var log = new Log();

    var QUERY_PARAM_PROVIDER = 'provider';
    var QUERY_PARAM_ASSET = 'name';
    var QUERY_PARAM_VERSION = 'version';
    var TEMPLATE_METHOD_INDEX = 1;
    var TEMPLATE_AUTH_INDEX = 2;
    var TEMPLATE_THROTTLE_INDEX = 3;
    var TEMPLATE_AUTH_DEFAULT = 'Any';
    var TEMPLATE_THROTTLE_DEFAULT = 'Unlimited';
    var URI_MAP_KEY_TIER = 'tier';
    var URI_MAP_KEY_AUTH = 'authType';
    var URI_MAP_KEY_TIERDESCRIPTION = 'tierDescription';


    function APIInformationService() {
        this.instance = null;
        this.user = null;

    }

    APIInformationService.prototype.init = function (context, session) {
        this.instance = context.module('api');
    };

    APIInformationService.prototype.getAPIDescription = function (assetProvider, assetName, assetVersion, ofUser) {
        var query = getQuery(assetProvider, assetName, assetVersion);
        var user = ofUser || this.user;
        var apiDescription = this.instance.getAPIDescription(query, user);
        var tiersArray = this.getTiers().tiers;
        var tierMap = new TierMap(tiersArray);
        var uriTemplateMap = new UriTemplateMap(apiDescription.uriTemplates);

        addTierDescription(uriTemplateMap, tierMap);

        return createDescriptionObject(apiDescription,uriTemplateMap.toArray());
    };

    APIInformationService.prototype.getTiers = function () {
        var tiers = this.instance.getTiers();
        return tiers;
    };

    var getQuery = function (assetProvider, assetName, assetVersion) {
        var query = {};
        query[QUERY_PARAM_PROVIDER] = assetProvider;
        query[QUERY_PARAM_ASSET] = assetName;
        query[QUERY_PARAM_VERSION] = assetVersion;
        return query;
    };

    var API_CONTEXT_KEY='context';
    var API_VERSION_KEY='version';
    var API_URI_TEMPLATES_KEY='uriTemplates';

    var createDescriptionObject=function(apiDescription,uriTemplates){
        var map={};
        map[API_CONTEXT_KEY]=apiDescription.api.context;
        map[API_VERSION_KEY]=apiDescription.api.version;
        map[API_URI_TEMPLATES_KEY]=uriTemplates;

        return map;
    };

    function TierMap(tiersArray) {
        this.map = {};
        initTierMap(tiersArray, this.map);
    }

    TierMap.prototype.getTierDescription = function (tierName) {
        if (this.map.hasOwnProperty(tierName)) {
            return this.map[tierName];
        }
        return '';
    };

    /*
     The function goes through a tiers array and creates a map
     */
    var initTierMap = function (tiersArray, map) {
        var tier;
        for (var tierIndex in tiersArray) {
            tier = tiersArray[tierIndex];
            map[tier.tierName] = tier.tierDescription;
        }
    };

    function UriTemplateMap(uriTemplateObj) {
        this.map = {};
        initUriTemplates(uriTemplateObj, this.map);
    }

    UriTemplateMap.prototype.getMethodDetails = function (context, methodName) {

        //Check if the context exists
        if (!this.map.hasOwnProperty(context)) {
            return {};
        }

        //Check if a method exists
        if (this.map[context].hasOwnProperty(methodName)) {
            return this.map[context][methodName];
        }

        return {};
    };

    UriTemplateMap.prototype.setMethodDetails = function (context, methodName, prop, value) {

        if (!this.map.hasOwnProperty(context)) {
            return;
        }

        if (this.map[context].hasOwnProperty(methodName)) {

            this.map[context][methodName][prop] = value;
        }
    };

    UriTemplateMap.prototype.getMethodTypes = function (context) {
        var methods = [];
        for (var methodName in this.map[context]) {
            methods.push(methodName);
        }

        return methods;
    };

    UriTemplateMap.prototype.getContextEntries = function () {
        var contextEntries = [];

        for (var contextName in this.map) {
            contextEntries.push(contextName);
        }

        return contextEntries;
    };

    UriTemplateMap.prototype.toJSON = function () {
        return this.map;
    };

    /*
     The method converts the uriTemplateMap to an array
     */
    UriTemplateMap.prototype.toArray = function () {
        var templates = [];
        var methodDetails;
        for (var contextName in this.map) {
            methodDetails=this.getMethodArray(this.map[contextName]);
            templates.push({
                context: contextName,
                methodDetails: methodDetails
            });
        }

        return templates;
    };

    UriTemplateMap.prototype.getMethodArray=function(methodDetails){
        var methodDetailsArray=[];
        for(var methodName in methodDetails){
            methodDetailsArray.push({
                methodName:methodName,
                details:methodDetails[methodName]
            });
        }

        return methodDetailsArray;
    };


    var initUriTemplates = function (uriTemplateObj, map) {
        var uriTemplate;
        var context;

        for (var templateIndex in uriTemplateObj) {
            uriTemplate = uriTemplateObj[templateIndex];
            context = uriTemplate[0];

            if (!map.hasOwnProperty(context)) {
                map[context] = {};
            }

            //Templates with the same name will overwrite the existing entries
            initUriTemplateEntry(uriTemplate, map[context]);
        }
    };

    var initUriTemplateEntry = function (uriTemplateObj, map) {

        var methods = uriTemplateObj[TEMPLATE_METHOD_INDEX] ? uriTemplateObj[TEMPLATE_METHOD_INDEX].split(',') : [];
        var authTypes = uriTemplateObj[TEMPLATE_AUTH_INDEX] ? uriTemplateObj[TEMPLATE_AUTH_INDEX].split(',') : [];
        var throttleLimits = uriTemplateObj[TEMPLATE_THROTTLE_INDEX] ? uriTemplateObj[TEMPLATE_THROTTLE_INDEX].split(',') : [];
        var method;

        for (var methodIndex in methods) {
            method = methods[methodIndex];
            map[method] = {};
            map[method][URI_MAP_KEY_AUTH] = authTypes[methodIndex] ? authTypes[methodIndex] : TEMPLATE_AUTH_DEFAULT;
            map[method][URI_MAP_KEY_TIER] = throttleLimits[methodIndex] ? throttleLimits[methodIndex] : TEMPLATE_THROTTLE_DEFAULT;
            map[method][URI_MAP_KEY_TIERDESCRIPTION] = '';
        }
    };

    /*
     The function adds tier description data to the uri template map
     */
    var addTierDescription = function (uriTemplateMap, tierMap) {

        var methods;
        var contextEntries = uriTemplateMap.getContextEntries();
        var context;
        var tierDescription;
        var methodName;
        var methodDetails;

        log.info('Starting to add tier descriptions ');

        for (var contextIndex in contextEntries) {

            context = contextEntries[contextIndex];
            methods = uriTemplateMap.getMethodTypes(context);

            log.info('Adding tier information to ' + context);

            for (var methodIndex in methods) {

                methodName = methods[methodIndex];

                log.info('Adding tier information for method: ' + methodName);

                methodDetails = uriTemplateMap.getMethodDetails(context, methodName);
                tierDescription = tierMap.getTierDescription(methodDetails.tier);
                uriTemplateMap.setMethodDetails(context, methodName, URI_MAP_KEY_TIERDESCRIPTION, tierDescription);
            }
        }


    }

    return{
        APIInformationService: APIInformationService
    }
})();