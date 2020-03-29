$(function () {

    let $row = $('.multiple_field');

    $(document).on('click',"#addButton", function () {
        let len = $(".multiple_field").length;
        if (len <= 10) {
            let $newRow = $row.clone();
            $newRow.prop('supplier_name_userview' + len);
            $newRow.prop('removeButton' + len);
            $newRow.insertAfter('.multiple_field:last');
            $newRow.find('input').each(function () {
                this.value = '';
            });
            $(".supplier_name_userview.ui.search").search({
                apiSettings: {
                    url: '/gcplantern/recomendations_supplier_name/?search_term_supplier={query}'
                },
                maxResults: 100
            });
        }
        else {
            alert("You can't add more than 10 oracle supplier names");
        }
    });

    $(document).on('click',".removeButton", function () {
        let $currentRow = $(this).closest('.multiple_field');
        if ($currentRow.index() === 0) {
            // don't remove first row
            alert("You can't remove first row");
        } else {
            $currentRow.remove();
        }
    });
    $('.ui.checkbox').checkbox();

    $('.normalized_name_userview.ui.search')
        .search({
            apiSettings: {
                url: '/gcplantern/recomendations_normalized_name/?search_term={query}'
            },
            fields: {
                title: 'title',
                description: 'id'
            },
            maxResults: 100
        });

    $(document).on("click", "#user_view_get_results", function () {
        let from = $('#datepickerFromUserView').val();
        let to = $('#datepickerToUserView').val();
        let checked_values = [];
        $.each($("input[name='status_userview']:checked"), function () {
            checked_values.push($(this).val());
        });

        if (from === "" && to === "") {
            defaultDateSetterForClassification("datepickerFromUserView", "datepickerToUserView");
            from = $('#datepickerFromUserView').val();
            to = $('#datepickerToUserView').val();
        }

        if (checked_values.length === 0) {
            showErrorMessage("Please select status")
        } else {
            let data = {
                'csrfmiddlewaretoken': $("#csrf_token").val(),
                'from_date': from,
                'to_date': to,
                'status': checked_values
            };
            AJAXPromise("POST", "/gcplantern/get_user_submitted_supplier_data/", data).then((success_data) => {
                $(".span-class").removeClass('hidden');
                $('#user_supplier_details').html(success_data);
                $('.loader-results').removeClass('active');
            }, (error) => {
                $('.loader-results').removeClass('active');
                showErrorMessage(error.responseJSON.message);
            });
        }
    });

    $(".supplier_name_userview.ui.search").search({
        apiSettings: {
            url: '/gcplantern/recomendations_supplier_name/?search_term_supplier={query}'
        },
        maxResults: 100
    });

    $(document).on("click", "#userview_submit", function () {
        let supplier_names;
        supplier_names = $("input[name='supplier_name_userview_name[]']").map(function () {
            return $(this).val();
        }).get();
        let supplier_id = $.MD5(supplier_names.toString());
        let normalized_name = $('#normalized_name_userview').val();
        let comments_by_user = $('#comments_by_user_userview').val();
        if (supplier_id === "") {
            showErrorMessage("Supplier Name to be selected only from the given list. No Custom Names are accepted!");
        } else {
            if ($('#review_check').is(':checked')) {
                let data = {
                    'csrfmiddlewaretoken': $("#csrf_token").val(),
                    'supplier_names': supplier_names,
                    'normalized_name': normalized_name,
                    'supplier_id': supplier_id,
                    'comments_by_user': comments_by_user
                };
                AJAXPromise("POST", "/gcplantern/submit_supplier_data/", data).then((success_data) => {
                    $("#user_view_get_results").click();
                    showSuccessMessage(success_data.message);
                }, (error) => {
                    showErrorMessage(error.responseJSON.message);
                });
            } else {
                showErrorMessage("CheckBox should be selected to ensure error check by user");
            }
        }
    });

    $(document).on("click", ".withdraw_supplier_userview", function () {
        let id = $(this).attr('id');
        let data = {
            'csrfmiddlewaretoken': $("#csrf_token").val(),
            'id': id
        };
        AJAXPromise("POST", "/gcplantern/withdraw_supplier_data/", data).then((success_data) => {
            showSuccessMessage(success_data.message);
            $('#table_id_userview').find('tr#' + id).find('td:eq(3)').html('withdrawn');
            $('#table_id_userview').find('tr#' + id).find('td:eq(9)').html('No Modifications Allowed');
        }, (error) => {
            showErrorMessage(error.responseJSON.message);
        });
    });

    $(document).on("click", ".edit_supplier_modal_userview", function () {
        let id = $(this).attr('id');
        let data = {
            'csrfmiddlewaretoken': $("#csrf_token").val(),
            'id': id
        };
        AJAXPromise("POST", "/gcplantern/edit_supplier_data_modal/", data).then((success_data) => {
            $("#supplier_details_modal_userview").html(success_data);
            $('#edit_modal_userview').modal('show');
        }, (error) => {
            showErrorMessage(error.responseJSON.message);
        });
    });

    $(document).on("click", ".edit_supplier_userview", function () {
        let supplier_id = $("#supplier_id_modal_userview").val();
        let suggested_normalized_name = $("#user_normalized_name_userview").val();
        let comments_by_user = $("#comment_by_user_userview").val();
        let data = {
            'csrfmiddlewaretoken': $("#csrf_token").val(),
            'supplier_id': supplier_id,
            'suggested_normalized_name': suggested_normalized_name,
            'comments_by_user': comments_by_user
        };
        AJAXPromise("POST", "/gcplantern/edit_supplier_data/", data).then((success_data) => {
            $('#table_id_userview').find('tr#' + supplier_id).find('td:eq(1)').html(suggested_normalized_name);
            $('#table_id_userview').find('tr#' + supplier_id).find('td:eq(4)').html(success_data.submitted_date);
            $('#table_id_userview').find('tr#' + supplier_id).find('td:eq(6)').html(comments_by_user);
            $('#edit_modal_userview').modal('hide');
            showSuccessMessage("Edit Successful");
        }, (error) => {
            showErrorMessage(error.responseJSON.message);
        });
    });

});
