/*
Description: The module is used to obtain data on applications
Filename: app-information.js
Created Date: 7/1/2013
 */
var serviceModule=(function(){
    var log=new Log('app service');
    var DEFAULT_FIELD_EMPTY_MSG='Not Specified';

    function AppService(){
        this.instance=null;
        this.user=null;
    }

    AppService.prototype.init=function(context,session){
        this.instance=context.module('application');
    };

    AppService.prototype.getApplications=function(username){
        var result=this.instance.getApplications(username);

        if(result.error){
            log.info('Unable to obtain applications of the provided user: '+username);
            throw result.message;
        }

        return processAppsList(result.applications);
    };

    AppService.prototype.addApplication=function(options){

        var result= this.instance.addApplication(options.username,options.application,options.tier,
        options.callbackUrl,options.description);

        log.info(result);
    };

    /*
    Used to process the applications array
     */
    var processAppsList=function(apps){
        log.info(apps);

        var app;

        //Go through each app in the array
        for(var index in apps){
            app=apps[index];

            //Inspect each property
            for(var key in app){

                //Assign a default value if a value is not found
                 if((app[key]==null)||(typeof app[key] ==undefined)){
                     app[key]=DEFAULT_FIELD_EMPTY_MSG;
                 }
            }
        }

        return apps;
    };

    return{
        AppService:AppService
    }

})();