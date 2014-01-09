$(function(){
    console.info('Loaded list app logic');

    var TABLE_NAME='tableApps';

    //source:http://www.editablegrid.net/en

    var appsGrid=new EditableGrid('editableTableApps');
    var editableGridConfig={metadata: [
        {name: "Name" , datatype:"string" , editable:true},
        {name:"Tier",datatype:"string", editable:true},
        {name:"Callback URL", datatype:"string", editable:true},
        {name:"Description" , datatype:"string", editable:true}
    ]};
    appsGrid.load(editableGridConfig);
    appsGrid.attachToHTMLTable(TABLE_NAME);
    appsGrid.renderGrid();
});