/*
Description: The module is used to obtain data on applications
Filename: app-information.js
Created Date: 7/1/2013
 */
var serviceModule=(function(){
    var log=new Log('app service');

    function AppService(){
        this.instance=null;
        this.user=null;
    }

    AppService.prototype.init=function(context,session){
        this.instance=context.module('application');
    };

    AppService.prototype.getApplications=function(username){
        var result=this.instance.getApplications(username);
        return processAppsList(result);
    };

    AppService.prototype.addApplication=function(options){

        var result= this.instance.addApplication(options.username,options.application,options.tier,
        options.callbackUrl,options.description);
    };

    var processAppsList=function(apps){
        return [];
    };

    return{
        AppService:AppService
    }

})();