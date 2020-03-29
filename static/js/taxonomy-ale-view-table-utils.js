$(function () {

    let table_config = $('#table-taxonomy-ale-view').DataTable({
        "bDestroy": true,
        buttons: ['copy', 'excel'],
        "pageLength": 50,
        "LengthMenu": [[50, 100 , 500, 1000, 5000, -1], [50, 100, 500, 1000, 5000, "All"]],
        "DisplayLength" : 10,
        "language":{
            "emptyTable":"Unable to fetch taxonomy data for the selected criteria"
        },
        "sDom": "<'ui stackable grid'"+
        "<'row'"+
        "<'three wide column'B>"+
        "<'right aligned content ten wide column'l>"+
        "<'right aligned content three wide column'f>"+
        ">"+
        "<'row dt-table'"+
        "<'sixteen wide column'tr>"+
        ">"+
        "<'row'"+
        "<'seven wide column'i>"+
        "<'right aligned nine wide column'p>"+
        ">"+
        ">"
    });

    table_config.buttons().container()
        .appendTo($('div.eight.column:eq(0)', table_config.table().container()));
});