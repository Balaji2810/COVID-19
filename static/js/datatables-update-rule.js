$(function () {
    $('#rule_transactions_table').DataTable({
        "scrollX": true,
        buttons: ['copy', 'excel'],
        "pageLength": 50
    });

});