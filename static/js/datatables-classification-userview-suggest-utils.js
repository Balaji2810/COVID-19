$(function () {
    $('#table_classification_userview_suggest_view_details').DataTable({
        "pageLength": 50,
        "order": [[ 14, "asc" ]]
    });

    $('#table_classification_userview_suggest_view_details_bulk').DataTable({
        "pageLength": 50,
        "order": [[ 10, "asc" ]]
    });
});