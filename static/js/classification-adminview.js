$(function () {
    initiateDatePicker("datepickerFromClassificationAdminView");
    initiateDatePicker("datepickerToClassificationAdminView");

    $('.ui.checkbox')
        .checkbox()
    ;
    $('.ui.dropdown')
        .dropdown();
});

function approve_selected(data) {
    AJAXPromise("POST", "/classification/approve_selected_l3/", data).then(() => {
        location.reload(true);
        $('.loader-results').removeClass('active');
    }, (error) => {
        $('.loader-results').removeClass('active');
        $('#classification_adminview_approval_table tr').removeClass('selected');
        showErrorMessage(error.responseJSON.message);
    });
}

function reject_selected(data) {
    AJAXPromise("POST", "/classification/reject_selected_l3/", data).then(() => {
        location.reload(true);
        $('.loader-results').removeClass('active');
    }, (error) => {
        $('.loader-results').removeClass('active');
        $('#classification_adminview_approval_table tr').removeClass('selected');
        showErrorMessage(error.responseJSON.message);
    });
}

$(function () {

    $(document).on("change", "#classification_adminview_suggested_l3_submit_on_change_view", function () {
        $("#l3_dropdown_items_admin_approve").val($("#classification_userview_l3_span_admminview").text());
        $("#l3_dropdown_items_default_admin_approve").text($("#classification_userview_l3_span_admminview").text());
    });

    $(document).on("change", "#l3_dropdown_items_admin_approve", function () {
        $("#classification_adminview_suggested_l3_submit_on_change_view").val($("#l3_dropdown_items_default_admin_approve").text());
        $("#classification_userview_l3_span_admminview").text($("#l3_dropdown_items_default_admin_approve").text());
    });

    $(document).on("change", "#classification_adminview_suggested_l3_submit_on_change_view_bulk", function () {
        $("#l3_dropdown_items_admin_approve_bulk").val($("#classification_userview_l3_span_adminview_bulk").text());
        $("#l3_dropdown_items_default_admin_approve_bulk").text($("#classification_userview_l3_span_adminview_bulk").text());
    });

    $(document).on("change", "#l3_dropdown_items_admin_approve_bulk", function () {
        $("#classification_adminview_suggested_l3_submit_on_change_view_bulk").val($("#l3_dropdown_items_default_admin_approve_bulk").text());
        $("#classification_userview_l3_span_adminview_bulk").text($("#l3_dropdown_items_default_admin_approve_bulk").text());
    });


    $(document).on("click", "#adminViewSubmitClassification", function () {
        let from = $('#datepickerFromClassificationAdminView').val();
        let to = $('#datepickerToClassificationAdminView').val();
        let category = $("#search_selection_dropdown_bulk_or_line").val();
        let checked_values = [];
        $.each($("input[name='status_classification_adminview']:checked"), function () {
            checked_values.push($(this).val());
        });
        if (from === "" || to === "") {
            defaultDateSetter("datepickerFromClassificationAdminView", "datepickerToClassificationAdminView");
            from = $('#datepickerFromClassificationAdminView').val();
            to = $('#datepickerToClassificationAdminView').val();
        }
        if (checked_values.length === 0) {
            showErrorMessage("Please select the Status");
        } else if (category === "") {
            showErrorMessage("Please select category");
        } else {
            let data = {
                'csrfmiddlewaretoken': $("#csrf_token").val(),
                'from_date': from,
                'to_date': to,
                'status': checked_values,
                'category': category
            };

            AJAXPromise("POST", "/classification/get_user_modified_l3_data/", data).then((success_data) => {
                $(".span-class-classification-adminview").removeClass('hidden');
                $('#l3_category_details_classification_adminview').html(success_data);
                $('.loader-results').removeClass('active');
            }, (error) => {
                $('.loader-results').removeClass('active');
                showErrorMessage(error.responseJSON.message);
            });
        }
    });

    $(document).on("click", ".approve_supplier_modal_classification_adminview", function () {
        let $row = $(this).closest("tr");
        let $td = $row.find("td");
        let td_values = [];
        let id = $(this).attr('id');
        $.each($td, function () {
            td_values.push($(this).text());
        });
        let category = $("#category_for_adminview").val();
        let data = {
            'csrfmiddlewaretoken': $("#csrf_token").val(),
            'td_values': td_values,
            'id': id,
            'category': category
        };
        AJAXPromise("POST", "/classification/show_approve_supplier_modal_classification/", data).then((success_data) => {
            $('#l3_details_classification').html(success_data);
            $('#approval_modal_classification_adminview').modal('show');
        }, (error) => {
            $('.loader-results').removeClass('active');
            showErrorMessage(error.responseJSON.message);
        });
    });

    $(document).on("click", ".approve_supplier_clasification_adminview", function () {
        let category = $('#category_for_bulk_adminview').val();
        let data = {};
        let id = $('#classification_adminview_approve_id').val();
        var length_of_comment = 0;
        if (category !== "Bulk Edits") {

            let admin_suggested_l3_category = $('#classification_userview_l3_span_admminview').text();
            let comment_by_admin = $('#classification_adminview_comment_by_user_adminview_suggest_l3').val();
            let user_l3_category = $('#classification_adminview_suggested_l3_category').val();
            let user = $("#classification_adminview_submitted_by").val();
            let request_status = $("#classification_adminview_request_status").val();
            let source = $("#classification_adminview_source_suggest_l3").val();
            let invoice_number = $("#classification_adminview_invoice_number_suggest_l3").val();
            let normalized_name = $("#classification_adminview_normalized_name_suggest_l3").val();
            let invoice_line_number = $("#classification_adminview_invoice_line_no_suggest_l3").val();
            let submitted_date = $("#classification_adminview_submitted_date").val();
            let account_code = $("#classification_adminview_account_code").val();
            length_of_comment = comment_by_admin.length;
            data = {
                'csrfmiddlewaretoken': $("#csrf_token").val(),
                'id': id,
                'admin_suggested_l3_category': admin_suggested_l3_category,
                'comment_by_admin': comment_by_admin,
                'user_l3_category': user_l3_category,
                'user': user,
                'request_status': request_status,
                'source': source,
                'invoice_number': invoice_number,
                'normalized_name': normalized_name,
                'invoice_line_number': invoice_line_number,
                'submitted_date': submitted_date,
                'chart_of_accounts': account_code,
                'category': category
            };
        } else {
            let admin_suggested_l3_category = $('#classification_userview_l3_span_adminview_bulk').text();
            let normalized_name = $("#classification_adminview_normalized_name_bulk").val();
            let suggested_l3 = $("#classification_adminview_suggested_l3_bulk").val();
            let submitted_by = $("#classification_adminview_submitted_by_bulk").val();
            let submitted_date = $("#classification_adminview_submitted_date_bulk").val();
            let comment_by_admin = $("#classification_adminview_admin_comments_bulk").val();
            let request_status = $("#classification_adminview_request_status_bulk").val();
            length_of_comment = comment_by_admin.length;
            data = {
                'id': id,
                'admin_suggested_l3_category': admin_suggested_l3_category,
                'normalized_name': normalized_name,
                'user_l3_category': suggested_l3,
                'user': submitted_by,
                'submitted_date': submitted_date,
                'comment_by_admin': comment_by_admin,
                'request_status': request_status,
                'category': category
            }
        }
        if (length_of_comment !== 0) {
            AJAXPromise("POST", "/classification/approve_l3_category/", data).then((success_data) => {
                $('#approval_modal_classification_adminview').modal('hide');
                if (category !== "Bulk Edits") {
                    $('#classification_adminview_approval_table').find('tr#' + id).find('td:eq(15)').html(`<button class="ui button edit_approval_classification_adminview" id="` + id + `" type="submit">Edit Approval</button> &nbsp &nbsp <button class="ui button edit_classification_adminview" id="` + id + `" type="submit">Edit</button>`);
                    $('#classification_adminview_approval_table').find('tr#' + id).find('td:eq(9)').html(success_data.approved_l3_category);
                    $('#classification_adminview_approval_table').find('tr#' + id).find('td:eq(7)').html(success_data.approval_status);
                    $('#classification_adminview_approval_table').find('tr#' + id).find('td:eq(11)').html(success_data.comment_by_admin);
                    $('#classification_adminview_approval_table').find('tr#' + id).find('td:eq(14)').html(success_data.approved_date);
                } else {
                    $('#classification_adminview_approval_table_bulk').find('tr#' + id).find('td:eq(11)').html(`<button class="ui button edit_approval_classification_adminview" id="` + id + `" type="submit">Edit Approval</button> &nbsp &nbsp <button class="ui button edit_classification_adminview" id="` + id + `" type="submit">Edit</button>`);
                    $('#classification_adminview_approval_table_bulk').find('tr#' + id).find('td:eq(4)').html(success_data.approved_l3_category);
                    $('#classification_adminview_approval_table_bulk').find('tr#' + id).find('td:eq(2)').html(success_data.approval_status);
                    $('#classification_adminview_approval_table_bulk').find('tr#' + id).find('td:eq(6)').html(success_data.comment_by_admin);
                    $('#classification_adminview_approval_table_bulk').find('tr#' + id).find('td:eq(10)').html(success_data.approved_date);
                }

            }, (error) => {
                $('.loader-results').removeClass('active');
                showErrorMessage(error.responseJSON.message);
            });
        } else {
            showErrorMessage("please provide valid comments");
        }
    });

    $(document).on("click", ".reject_supplier_modal_classification_adminview", function () {
        let $row = $(this).closest("tr");
        let $td = $row.find("td");
        let td_values = [];
        let id = $(this).attr('id');
        $.each($td, function () {
            td_values.push($(this).text());
        });
        let category = $("#category_for_adminview").val();
        let data = {
            'csrfmiddlewaretoken': $("#csrf_token").val(),
            'td_values': td_values,
            'id': id,
            'category': category
        };
        AJAXPromise("POST", "/classification/show_reject_l3_modal/", data).then((success_data) => {
            $('#rejection_reason_l3').html(success_data);
            $('#rejection_modal_classification_adminview').modal('show');
        }, (error) => {
            $('.loader-results').removeClass('active');
            showErrorMessage(error.responseJSON.message);
        });
    });

    $(document).on("click", ".reject_l3_classification_adminview", function () {
        let id = $('#classification_reject_reason_id').val();
        let comment_by_admin = $('#admin_comment_reject_classification_adminview').val();
        let user = $("#user_name_adminview_classification").val();
        let request_status = $("#request_status_adminview_classification").val();
        let user_l3_category = $("#user_l3_category_adminview_classification").val();
        let category = $("#category_for_adminview").val();
        if (comment_by_admin.length !== 0) {
            let data = {
                'csrfmiddlewaretoken': $("#csrf_token").val(),
                'comment_by_admin': comment_by_admin,
                'id': id,
                'user': user,
                'request_status': request_status,
                'user_l3_category': user_l3_category,
                'category': category
            };
            AJAXPromise("POST", "/classification/reject_l3_data/", data).then((success_data) => {
                $('#rejection_modal_classification_adminview').modal('hide');
                if (category !== "Bulk Edits") {
                    $('#classification_adminview_approval_table').find('tr#' + id).find('td:eq(15)').html(`<button class="ui button edit_approval_classification_adminview" id="` + id + `" type="submit">Edit Approval</button> &nbsp &nbsp <button class="ui button edit_classification_adminview" id="` + id + `" type="submit">Edit</button>`);
                    $('#classification_adminview_approval_table').find('tr#' + id).find('td:eq(7)').html(success_data.approval_status);
                    $('#classification_adminview_approval_table').find('tr#' + id).find('td:eq(11)').html(success_data.comment_by_admin);
                    $('#classification_adminview_approval_table').find('tr#' + id).find('td:eq(14)').html(success_data.approved_date);
                    $('#classification_adminview_approval_table').find('tr#' + id).find('td:eq(9)').html("NA");
                } else {
                    $('#classification_adminview_approval_table_bulk').find('tr#' + id).find('td:eq(11)').html(`<button class="ui button edit_approval_classification_adminview" id="` + id + `" type="submit">Edit Approval</button> &nbsp &nbsp <button class="ui button edit_classification_adminview" id="` + id + `" type="submit">Edit</button>`);
                    $('#classification_adminview_approval_table_bulk').find('tr#' + id).find('td:eq(2)').html(success_data.approval_status);
                    $('#classification_adminview_approval_table_bulk').find('tr#' + id).find('td:eq(6)').html(success_data.comment_by_admin);
                    $('#classification_adminview_approval_table_bulk').find('tr#' + id).find('td:eq(10)').html(success_data.approved_date);
                    $('#classification_adminview_approval_table_bulk').find('tr#' + id).find('td:eq(4)').html("NA");
                }


            }, (error) => {
                $('.loader-results').removeClass('active');
                showErrorMessage(error.responseJSON.message);
            });
        } else {
            showErrorMessage("please provide valid comments");
        }
    });

    $(document).on("click", ".edit_classification_adminview", function () {
        let $row = $(this).closest("tr");
        let $td = $row.find("td");
        let td_values = [];
        let id = $(this).attr('id');
        $.each($td, function () {
            td_values.push($(this).text());
        });
        let category = $("#category_for_adminview").val();
        let data = {
            'csrfmiddlewaretoken': $("#csrf_token").val(),
            'td_values': td_values,
            'id': id,
            'category': category
        };
        let function_call = "";
        let details_modal = "";
        let approve_or_reject_modal = "";
        if (category === "Bulk Edits") {
            status = td_values[2]
        } else {
            status = td_values[7]
        }
        if (status != 'rejected') {
            function_call = "show_approve_supplier_modal_classification";
            details_modal = "l3_details_classification";
            approve_or_reject_modal = "approval_modal_classification_adminview";
        } else {
            function_call = "show_reject_l3_modal";
            details_modal = "rejection_reason_l3";
            approve_or_reject_modal = "rejection_modal_classification_adminview";
        }
        AJAXPromise("POST", "/classification/" + function_call + "/", data).then((success_data) => {
            $('#' + details_modal).html(success_data);
            $('#' + approve_or_reject_modal).modal('show');
        }, (error) => {
            $('.loader-results').removeClass('active');
            showErrorMessage(error.responseJSON.message);
        });
    });

    $(document).on("click", ".edit_approval_classification_adminview", function () {
        let $row = $(this).closest("tr");
        let $td = $row.find("td");
        let td_values = [];
        let id = $(this).attr('id');
        $.each($td, function () {
            td_values.push($(this).text());
        });
        let category = $("#category_for_adminview").val();
        let data = {
            'csrfmiddlewaretoken': $("#csrf_token").val(),
            'td_values': td_values,
            'id': id,
            'category': category
        };
        let function_call = "";
        let details_modal = "";
        let approve_or_reject_modal = "";
        if (category === "Bulk Edits") {
            status = td_values[2]
        } else {
            status = td_values[7]
        }
        if (status != 'rejected') {
            function_call = "show_reject_l3_modal";
            details_modal = "rejection_reason_l3";
            approve_or_reject_modal = "rejection_modal_classification_adminview";
        } else {
            function_call = "show_approve_supplier_modal_classification";
            details_modal = "l3_details_classification";
            approve_or_reject_modal = "approval_modal_classification_adminview";
        }

        AJAXPromise("POST", "/classification/" + function_call + "/", data).then((success_data) => {
            $('#' + details_modal).html(success_data);
            $('#' + approve_or_reject_modal).modal('show');
        }, (error) => {
            $('.loader-results').removeClass('active');
            showErrorMessage(error.responseJSON.message);
        });

    });
});