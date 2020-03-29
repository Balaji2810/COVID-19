$(function () {

    let table_config = $('#simulation_table_id').DataTable({
        "scrollX": true,
        buttons: ['copy', 'excel', 'colvis'],
        "order": [[7, "desc"]],
        "pageLength": 50
    });
    table_config.buttons().container()
        .appendTo($('div.eight.column:eq(0)', table_config.table().container()));
});