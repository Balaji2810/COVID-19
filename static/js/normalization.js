$(function () {
    initiateDatePicker("datepickerFrom");
    initiateDatePicker("datepickerTo");

    $('.ui.checkbox')
        .checkbox()
    ;
});

/*
td_values in the below onClick calls have the table column values. Example listed below.
td_values = ["supplier_name", "Suggested Normalized_name", "Approved Normalized Name", "Request Status",
                        "Submitted Date", "Submitted By", "Comments By User", "Comments By Admin", "Approved Date"]
*/
function approve_selected(data) {
    AJAXPromise("POST", "/gcplantern/approve_selected_suppliers/", data).then(() => {
        location.reload(true);
        $('.loader-results').removeClass('active');
    }, (error) => {
        $('.loader-results').removeClass('active');
        $('#table_id tr').removeClass('selected');
        showErrorMessage(error.responseJSON.message);
    });
}

function reject_selected(data) {
    AJAXPromise("POST", "/gcplantern/reject_selected_suppliers/", data).then(() => {
        location.reload(true);
        $('.loader-results').removeClass('active');
    }, (error) => {
        $('.loader-results').removeClass('active');
        $('#table_id tr').removeClass('selected');
        showErrorMessage(error.responseJSON.message);
    });
}

$(function () {

    $(document).on("click", "#adminViewSubmit", function () {
        let from = $('#datepickerFrom').val();
        let to = $('#datepickerTo').val();
        let checked_values = [];
        $.each($("input[name='status']:checked"), function () {
            checked_values.push($(this).val());
        });
        if (from === "" || to === "") {
            defaultDateSetter("datepickerFrom", "datepickerTo");
            from = $('#datepickerFrom').val();
            to = $('#datepickerTo').val();
        }
        if (checked_values.length === 0) {
            showErrorMessage("Please select the Status");
        } else {
            let data = {
                'csrfmiddlewaretoken': $("#csrf_token").val(),
                'from_date': from,
                'to_date': to,
                'status': checked_values
            };

            AJAXPromise("POST", "/gcplantern/get_user_modified_supplier_data/", data).then((success_data) => {
                $(".span-class").removeClass('hidden');
                $('#supplier_details').html(success_data);
                $('.loader-results').removeClass('active');
            }, (error) => {
                $('.loader-results').removeClass('active');
                showErrorMessage(error.responseJSON.message);
            });
        }
    });


    $(document).on("click", ".edit", function () {
        let $row = $(this).closest("tr");
        let $td = $row.find("td");
        let td_values = [];
        let id = $(this).attr('id');
        $.each($td, function () {
            td_values.push($(this).text());
        });
        let data = {
            'csrfmiddlewaretoken': $("#csrf_token").val(),
            'td_values': td_values,
            'id': id
        };
        let function_call = "";
        let details_modal = "";
        let approve_or_reject_modal = "";
        if (td_values[3] != 'rejected') {
            function_call = "show_approve_supplier_modal";
            details_modal = "supplier_details_modal";
            approve_or_reject_modal = "approval_modal";
        } else {
            function_call = "show_reject_supplier_modal";
            details_modal = "rejection_reason_modal";
            approve_or_reject_modal = "rejection_modal";
        }
        AJAXPromise("POST", "/gcplantern/" + function_call + "/", data).then((success_data) => {
            $('#' + details_modal).html(success_data);
            $('#' + approve_or_reject_modal).modal('show');
        }, (error) => {
            $('.loader-results').removeClass('active');
            showErrorMessage(error.responseJSON.message);
        });
    });

    $(document).on("click", ".edit_approval", function () {
        let $row = $(this).closest("tr");
        let $td = $row.find("td");
        let td_values = [];
        let id = $(this).attr('id');
        $.each($td, function () {
            td_values.push($(this).text());
        });
        let data = {
            'csrfmiddlewaretoken': $("#csrf_token").val(),
            'td_values': td_values,
            'id': id
        };
        let function_call = "";
        let details_modal = "";
        let approve_or_reject_modal = "";
        if (td_values[3] != 'rejected') {
            function_call = "show_reject_supplier_modal";
            details_modal = "rejection_reason_modal";
            approve_or_reject_modal = "rejection_modal";
        } else {
            function_call = "show_approve_supplier_modal";
            details_modal = "supplier_details_modal";
            approve_or_reject_modal = "approval_modal";
        }

        AJAXPromise("POST", "/gcplantern/" + function_call + "/", data).then((success_data) => {
            $('#' + details_modal).html(success_data);
            $('#' + approve_or_reject_modal).modal('show');
        }, (error) => {
            $('.loader-results').removeClass('active');
            showErrorMessage(error.responseJSON.message);
        });

    });

    $(document).on("click", ".approve_supplier_modal", function () {
        let $row = $(this).closest("tr");
        let $td = $row.find("td");
        let td_values = [];
        let id = $(this).attr('id');
        $.each($td, function () {
            td_values.push($(this).text());
        });
        let data = {
            'csrfmiddlewaretoken': $("#csrf_token").val(),
            'td_values': td_values,
            'id': id
        }
        AJAXPromise("POST", "/gcplantern/show_approve_supplier_modal/", data).then((success_data) => {
            $('#supplier_details_modal').html(success_data);
            $('#approval_modal').modal('show');
        }, (error) => {
            $('.loader-results').removeClass('active');
            showErrorMessage(error.responseJSON.message);
        });
    });

    $(document).on("click", ".reject_supplier_modal", function () {
        let $row = $(this).closest("tr");
        let $td = $row.find("td");
        let td_values = [];
        let id = $(this).attr('id');
        $.each($td, function () {
            td_values.push($(this).text());
        });
        let data = {
            'csrfmiddlewaretoken': $("#csrf_token").val(),
            'td_values': td_values,
            'id': id
        };
        AJAXPromise("POST", "/gcplantern/show_reject_supplier_modal/", data).then((success_data) => {
            $('#rejection_reason_modal').html(success_data);
            $('#rejection_modal').modal('show');
        }, (error) => {
            $('.loader-results').removeClass('active');
            showErrorMessage(error.responseJSON.message);
        });
    });
    $(document).on("click", ".approve_supplier", function () {
        let id = $('#supplier_id_modal').val();
        let admin_suggested_normalized_name = $('#modified_normalized_name').val();
        let comment_by_admin = $('#admin_comment').val();
        let user_normalized_name = $('#user_normalized_name').val();
        let supplier_name = $("#supplier_name").val();
        let submitted_date = $("#submitted_date").val();
        let submitted_by = $("#submitted_by").val();
        let request_status = $("#request_status").val();
        let data = {
            'csrfmiddlewaretoken': $("#csrf_token").val(),
            'admin_normalized_name': admin_suggested_normalized_name,
            'comment_by_admin': comment_by_admin,
            'supplier_id': id,
            'user_normalized_name': user_normalized_name,
            'supplier_name': supplier_name,
            'submitted_date': submitted_date,
            'submitted_by': submitted_by,
            'request_status': request_status
        };

        AJAXPromise("POST", "/gcplantern/approve_supplier/", data).then((success_data) => {
            $('#approval_modal').modal('hide');
            $('#table_id').find('tr#' + id).find('td:eq(9)').html(`<button class="ui button edit_approval" id="` + id + `" type="submit">Edit Approval</button> &nbsp &nbsp <button class="ui button edit" id="` + id + `" type="submit">Edit</button>`);
            $('#table_id').find('tr#' + id).find('td:eq(2)').html(success_data.approved_normalized_name);
            $('#table_id').find('tr#' + id).find('td:eq(3)').html(success_data.approval_status);
            $('#table_id').find('tr#' + id).find('td:eq(7)').html(success_data.comment_by_admin);
            $('#table_id').find('tr#' + id).find('td:eq(8)').html(success_data.approved_date);

        }, (error) => {
            $('.loader-results').removeClass('active');
            showErrorMessage(error.responseJSON.message);
        });
    });

    $(document).on("click", ".reject_supplier", function () {
        let id = $('#supplier_id_modal_reject').val();
        let comment_by_admin = $('#admin_comment_reject').val();
        let user = $("#user_name_admin_view").val();
        let request_status = $("#request_status_admin_view").val();
        let data = {
            'csrfmiddlewaretoken': $("#csrf_token").val(),
            'comment_by_admin': comment_by_admin,
            'supplier_id': id,
            'user': user,
            'request_status': request_status
        };

        AJAXPromise("POST", "/gcplantern/reject_supplier/", data).then((success_data) => {
            $('#rejection_modal').modal('hide');
            $('#table_id').find('tr#' + id).find('td:eq(9)').html(`<button class="ui button edit_approval" id="` + id + `" type="submit">Edit Approval</button> &nbsp &nbsp <button class="ui button edit" id="` + id + `" type="submit">Edit</button>`);
            $('#table_id').find('tr#' + id).find('td:eq(3)').html(success_data.approval_status);
            $('#table_id').find('tr#' + id).find('td:eq(7)').html(success_data.comment_by_admin);
            $('#table_id').find('tr#' + id).find('td:eq(8)').html(success_data.approved_date);

        }, (error) => {
            $('.loader-results').removeClass('active');
            showErrorMessage(error.responseJSON.message);
        });
    });

    $(document).on("click", "#percentage_source", function () {
        let checked_values = [];
        $.each($("input[name='source']:checked"), function () {
            checked_values.push($(this).val());
        });
        if (checked_values.length === 0) {
            showErrorMessage("please select the source");
        } else {
            let data = {
                'csrfmiddlewaretoken': $("#csrf_token").val(),
                'values': checked_values
            };
            AJAXPromise("POST", "/gcplantern/get_normalization_percentage/", data).then((success_data) => {
                $("#percentage_based_on_vendors").text(success_data['percentage_based_on_vendors']);
                $("#percentage_based_on_spend").text(success_data["percentage_based_on_spend"]);
            }, (error) => {
                showErrorMessage(error.responseJSON.message);
            });
        }
    });

});
