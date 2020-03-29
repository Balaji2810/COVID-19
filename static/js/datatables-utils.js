$(function () {

    let table_config = $('#table_id').DataTable({
        lengthChange: false,
        buttons: ['copy', 'excel'],
        "pageLength": 50,
        "order": [[ 10, "asc" ]]
    });
    table_config.buttons().container()
        .appendTo($('div.eight.column:eq(0)', table_config.table().container()));

    $('#table_id').DataTable();
    $('#table_id tbody').on('click', 'tr', function () {
        $(this).toggleClass('selected active');
    });

    let table = $('#table_id').DataTable();

    $(document).on("click", "#approve_selected", function () {
        $('.loader-results').addClass('active');
        let table_data = table.rows('.selected').data();
        let length = table_data.length;
        let table_data_modified = [];
        for (let i = 0; i < length; i++) {
            let table_temp = [];
            table_temp.push(table_data[i]['DT_RowId']);
            table_temp.push(table_data[i]);
            table_data_modified.push(table_temp);
        }
        let data = {
            'csrfmiddlewaretoken': $("#csrf_token").val(),
            'table_data': table_data_modified,
            'length': length
        };
        approve_selected(data);
    });

    $(document).on("click", "#reject_selected", function () {
        $('.loader-results').addClass('active');
        let table_data = table.rows('.selected').data();
        let length = table_data.length;
        let table_data_modified = [];
        for (let i = 0; i < length; i++) {
            let table_temp = [];
            table_temp.push(table_data[i]['DT_RowId']);
            table_temp.push(table_data[i]);
            table_data_modified.push(table_temp);
        }
        let data = {
            'csrfmiddlewaretoken': $("#csrf_token").val(),
            'table_data': table_data_modified,
            'length': length
        };
        reject_selected(data);
    });
});