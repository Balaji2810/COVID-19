$(function () {

    let table_config = $('#table_id').DataTable({
        "scrollX": true,
        lengthChange: false,
        buttons: ['copy', 'excel', 'colvis'],
        "order": [[33, "desc"]],
        "pageLength": 50
    });
    table_config.buttons().container()
        .appendTo($('div.eight.column:eq(0)', table_config.table().container()));

    $('#table_id').DataTable();
    $('#table_id tbody').on('click', 'tr', function () {
        $(this).toggleClass('selected active');
    });

    let table = $('#table_id').DataTable();

    function get_table_data() {
        let table_data = table.rows('.selected').data();
        let length = table_data.length;
        let table_data_modified = [];
        for (let i = 0; i < length; i++) {
            let table_temp = [];
            table_temp.push(table_data[i][1]);
            table_temp.push(table_data[i][4]);
            table_data_modified.push(table_temp);
        }
        return [table_data_modified , length]
    }

    $(document).on("click", "#approve_selected", function () {
        $('.loader-results').addClass('active');
        let [table_data_modified, length] = get_table_data();
        let data = {
            'csrfmiddlewaretoken': $("#csrf_token").val(),
            'table_data': table_data_modified,
            'length': length,
            'operation': 'Approved'
        };
        approve_or_reject_selected(data);
    });

    $(document).on("click", "#reject_selected", function () {
        $('.loader-results').addClass('active');
        let [table_data_modified, length] = get_table_data();
        let data = {
            'csrfmiddlewaretoken': $("#csrf_token").val(),
            'table_data': table_data_modified,
            'length': length,
            'operation': "Rejected"
        };
        approve_or_reject_selected(data);
    });

    $(document).on("click", "#turn_in_review", function () {
        $('.loader-results').addClass('active');
        let [table_data_modified, length] = get_table_data();
        let data = {
            'csrfmiddlewaretoken': $("#csrf_token").val(),
            'table_data': table_data_modified,
            'length': length
        };
        turn_in_review(data);
    });
});