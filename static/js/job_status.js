$(document).ready(function () {

  var table =  $('#table-job-status').DataTable({
        "lengthMenu": [[10, 25, 50], [10, 20, 30]]
    });
    $('.ui.selection.dropdown.year').dropdown(
        {
            onChange: function (value) {
                table.column(1).search(value).draw();

            }
        }
    );
    $('.ui.selection.dropdown.month').dropdown(
        {
            onChange: function (value) {

                table.column(1).search(value).draw();

            }
        }
    );
});