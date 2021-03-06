/*
Description:The class is used to override the default query provider functions for the mysql driver
Filename: query.provider.js
Created Date: 15/10/2013
 */

var queryProvider=function(){

    var dbScriptManager=require('/modules/data/common/db.script.manager.js').dbScriptManagerModule().getInstance();

    var MYSQL_DRIVER='mysql';
    /*
    The function builds a CREATE sql statement based on the provided schema
     */
    function create(schema){
       var query=dbScriptManager.find(MYSQL_DRIVER,schema.table);
        return query;
    }

    return{
        create:create
    }
};


