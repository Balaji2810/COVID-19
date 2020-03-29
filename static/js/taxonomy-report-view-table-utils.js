$(function () {

    let table_config = $('#table-taxonomy-report-view').DataTable({
        lengthChange: false,
        buttons: ['copy', 'excel'],
        "pageLength": 50,
    });

    table_config.buttons().container()
        .appendTo($('div.eight.column:eq(0)', table_config.table().container()));
});