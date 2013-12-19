var log=new Log('apiconsole helpers');
var resources=function(page,meta){
    log.info('loading resources');
    return{
        js:['apiconsole.js']
    };
};