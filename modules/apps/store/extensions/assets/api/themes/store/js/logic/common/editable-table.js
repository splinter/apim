var Edtable;

$(function () {

    function EditableTable(configs) {
        init('#' + configs.tableContainer);
        this.resolve
    }

    var init = function (tableContainer) {

        var id;
        //Go through each row
        $(tableContainer + ' tr').each(function () {

            id = $(this).data('id');
            $(this).find('td').each(function () {
                var action = $(this).data('action');
                var resolveScript = "Edtable.resolve('" + id + "','" + action + "');";
                if (action) {
                    console.info('action: ' + action + ' for id: ' + id);
                    if (action == 'delete') {
                        $(this).html('<button class="btn btn-danger" onClick="' + resolveScript + '">Delete</button>');
                    }
                    else if (action == 'edit') {
                        $(this).html('<button class="btn" onClick="' + resolveScript + '">Edit</button>');
                    }

                }
            });
        });
    };


    Edtable = EditableTable;

    Edtable['resolve'] = function (id, action) {
        var tr = $('#row-' + id);
        if (action == 'delete') {
            //Delete the app with the provided id
            //Delete the selected row
            $('#row-' + id).remove();
        }
        else if (action == 'edit') {
            populateRow(id, tr);
        }
        else if (action == 'cancel') {
            resetRow(id, tr);
        }
        else if(action=='save'){
           //Perform a save operation
        }
    };

    var populateRow = function (id, tr) {

        $(tr).find('td').each(function () {
            console.info('editing');
            var td = this;
            var fieldType = $(td).data('field');
            var action = $(td).data('action');
            var transitionsString=$(td).data('transitions');
            var transitions;

            if (fieldType) {
                populateTextbox(td);
            }

            if(transitionsString){
                transitions=transitionsString.split(',');
                populateTransitions(id,td,transitions);
            }
        });
    };

    var populateTextbox = function (td) {
        //Save the existing value
        var existingValue = $(td).data('value');
        $(td).html('<input class="input-small" type="text" value="' + existingValue + '"/>');
    };

    var populateTransitions=function(id,td,transitions){
        var resolveScript;
        $(td).html('');
        for(var index in transitions){
            console.info('adding save and cancel');
            resolveScript = "Edtable.resolve('" + id + "','" + transitions[index] + "');";
            $(td).append('<button class="btn"  onClick="' + resolveScript + '">'+transitions[index]+'</button>')
        }
    }

    var resetRow = function (id, tr) {
        $(tr).find('td').each(function () {
            var td = this;
            var existingValue = $(td).data('value');
            var action=$(td).data('action');
            $(td).html(existingValue);
            var resolveScript = "Edtable.resolve('" + id + "','" + action + "');";
            if(action=='edit'){
                $(td).html('<button class="btn" onClick="' + resolveScript + '">Edit</button>');
            }
        });
    };


});