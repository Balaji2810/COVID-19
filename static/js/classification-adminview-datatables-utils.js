$(function () {

    let table_config = $('#classification_adminview_approval_table').DataTable({
        lengthChange: false,
        buttons: ['copy', 'excel'],
        "order": [[ 16, "asc" ]]
    });
    table_config.buttons().container()
        .appendTo($('div.eight.column:eq(0)', table_config.table().container()));

    $('#classification_adminview_approval_table').DataTable();
    $('#classification_adminview_approval_table tbody').on('click', 'tr', function () {
        $(this).toggleClass('selected active');
    });

    let table = $('#classification_adminview_approval_table').DataTable();

    $(document).on("click", "#approve_selected_classification_adminview", function () {
        $('.loader-results').addClass('active');
        let table_data = table.rows('.selected').data();
        let length = table_data.length;
        let table_data_modified = [];
        let category = $("#category_for_adminview").val();
        for (let i = 0; i < length; i++) {
            let table_temp = [];
            table_temp.push(table_data[i]['DT_RowId']);
            table_temp.push(table_data[i]);
            table_data_modified.push(table_temp);
        }
        let data = {
            'csrfmiddlewaretoken': $("#csrf_token").val(),
            'table_data': table_data_modified,
            'length': length,
            'category': category
        };
        approve_selected(data);
    });

    $(document).on("click", "#reject_selected_classification_adminview", function () {
        $('.loader-results').addClass('active');
        let table_data = table.rows('.selected').data();
        let length = table_data.length;
        let table_data_modified = [];
        let category = $("#category_for_adminview").val();
        for (let i = 0; i < length; i++) {
            let table_temp = [];
            table_temp.push(table_data[i]['DT_RowId']);
            table_temp.push(table_data[i]);
            table_data_modified.push(table_temp);
        }
        let data = {
            'csrfmiddlewaretoken': $("#csrf_token").val(),
            'table_data': table_data_modified,
            'length': length,
            'category': category
        };
        reject_selected(data);
    });
});