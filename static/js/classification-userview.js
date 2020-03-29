$(function () {
    $('.ui.dropdown')
        .dropdown();

    $('.ui.checkbox')
        .checkbox();

    defaultDateSetterForClassification("datepickerFromClassificationUserview", "datepickerToClassificationUserview");

    $('.classification_userview_recommendation_submit_normalized_name.ui.search')
        .search({
            apiSettings: {
                url: '/classification/recommendations_normalized_name/?search_term_normalized_name={query}',
            },
            fields: {
                title: 'title',
                description: 'data'
            },
            maxResults: 100
        });

    $('.classification_userview_recommendation_view_normalized_name.ui.search')
        .search({
            apiSettings: {
                url: '/classification/recommendations_normalized_name/?search_term_normalized_name={query}',
            },
            maxResults: 100
        });
    $('.ui.form')
        .form({
            fields: {
                classification_recommendation_submit_normalized_name: {
                    identifier: 'classification_recommendation_submit_normalized_name',
                    rules: [
                        {
                            type: 'empty',
                            prompt: 'Normalized Name cannot be empty'
                        }
                    ]
                },
                classification_userview_suggested_l3_submit: {
                    identifier: 'classification_userview_suggested_l3_submit',
                    rules: [
                        {
                            type: 'empty',
                            prompt: 'Suggested L3 category cannot be empty'
                        }
                    ]
                },
                classification_userview_comments_by_user: {
                    identifier: 'classification_userview_comments_by_user',
                    rules: [
                        {
                            type: 'empty',
                            prompt: 'Comments cannot be empty'
                        }
                    ]
                },
                recommendation_value_normalized_name_for_bulk: {
                    identifier: 'recommendation_value_normalized_name_for_bulk',
                    rules: [
                        {
                            type: 'empty',
                            prompt: 'Please select the Normalized Supplier Name from the listed recommendations'
                        }
                    ]
                },
                classification_userview_review_check: {
                    identifier: 'classification_userview_review_check',
                    rules: [
                        {
                            type: 'checked',
                            prompt: 'Please check the Checkbox'
                        }
                    ]
                }
            }
        })
    ;

    $(document).on("click", "#invoice_number_selection", function () {
        $("#classification_userview_recommendation_view_invoice_number").removeClass("hidden");
        $(".classification_userview_recommendation_view_normalized_name").removeClass("hidden").addClass("hidden");
        $(".classification_userview_view_search").removeClass("hidden");
        $("#search_type").val("ofa_invoice_number");
        $("#recommendation_type_suggest_l3").val("Invoice Number");
    });

    $(document).on("click", "#normalized_name_selection", function () {
        $(".classification_userview_recommendation_view_normalized_name").removeClass("hidden");
        $("#classification_userview_recommendation_view_invoice_number").removeClass("hidden").addClass("hidden");
        $(".classification_userview_view_search").removeClass("hidden");
        $("#search_type").val("normalized_vendor_name");
        $("#recommendation_type_suggest_l3").val("Normalized Name");
    });

    $(document).on("change", ".classification_recommendation_submit", function () {
        $("#recommendation_value_normalized_name_for_bulk").val("");
    });

    $(document).on("change", "#classification_userview_suggested_l3_submit_on_change_homepage", function () {
        $("#normalized_name_classification_bulk").val($("#classification_userview_l3_span_bulk_suggestion").text());
        $("#l3_dropdown_items").val($("#classification_userview_l3_span_bulk_suggestion").text());
        $("#l3_dropdown_items_default").text($("#classification_userview_l3_span_bulk_suggestion").text());
    });

    $(document).on("change", "#l3_dropdown_items", function () {
        $("#normalized_name_classification_bulk").val($("#l3_dropdown_items_default").text());
        $("#classification_userview_suggested_l3_submit_on_change_homepage").val($("#l3_dropdown_items_default").text());
        $("#classification_userview_l3_span_bulk_suggestion").text($("#l3_dropdown_items_default").text());
    });


    $(document).on("change", "#classification_userview_suggested_l3_submit_on_change_view", function () {
        $("#l3_dropdown_items_modify").val($("#classification_userview_l3_span_modify_l3").text());
        $("#l3_dropdown_items_default_modify").text($("#classification_userview_l3_span_modify_l3").text());
    });

    $(document).on("change", "#l3_dropdown_items_modify", function () {
        $("#classification_userview_suggested_l3_submit_on_change_view").val($("#l3_dropdown_items_default_modify").text());
        $("#classification_userview_l3_span_modify_l3").text($("#l3_dropdown_items_default_modify").text());
    });


    $(document).on("change", "#classification_userview_suggested_l3_submit_on_change_edit", function () {
        $("#l3_dropdown_items_edit").val($("#classification_userview_l3_span_edit_bulk_or_line").text());
        $("#l3_dropdown_items_default_edit").text($("#classification_userview_l3_span_edit_bulk_or_line").text());
    });

    $(document).on("change", "#l3_dropdown_items_edit", function () {
        $("#classification_userview_suggested_l3_submit_on_change_edit").val($("#l3_dropdown_items_default_edit").text());
        $("#classification_userview_l3_span_edit_bulk_or_line").text($("#l3_dropdown_items_default_edit").text());
    });


    $(document).on("click", "#classification_userview_search_suggest_submit", function () {
        $('.loader-results-classification-userview-view-suggest').addClass('active');
        let from = $("#datepickerFromClassificationUserview").val();
        let to = $("#datepickerToClassificationUserview").val();
        let category = $("#search_selection_dropdown_bulk_or_line").val();
        let checked_values = [];
        $.each($("input[name='status_classification_userview']:checked"), function () {
            checked_values.push($(this).val());
        });
        if (from === "" || to === "") {
            showErrorMessage("Please select date range");
        } else if (checked_values.length === 0) {
            showErrorMessage("Please slect status");
        } else if (category === "") {
            showErrorMessage("Please choose the category");
        } else {
            let data = {
                'csrfmiddlewaretoken': $("#csrf_token").val(),
                'from_date': from,
                'to_date': to,
                'status': checked_values,
                'category': category
            };
            AJAXPromise("POST", "/classification/get_user_submitted_suggested_category_data/", data).then((success_data) => {
                $(".span-class").removeClass('hidden');
                $('#classification_userview_suggestion_view_details').html(success_data);
                $('.loader-results-classification-userview-view-suggest').removeClass('active');
            }, (error) => {
                $('.loader-results-classification-userview-view-suggest').removeClass('active');
                showErrorMessage(error.responseJSON.message);
            });
        }

    });

    $(document).on("click", ".result", function () {
        if ($(this).closest('div[class^="results"]').hasClass("normalized")) {
            $("#recommendation_value_normalized_name_for_bulk").val($(this).find(".content").last()["0"].children[1].childNodes["0"].data);
        }
    });

    $(document).on("click", ".withdraw_classification_userview_suggestion", function () {
        let id = $(this).attr('id');
        let category = $("#category_for_reuse").val();
        let data = {
            'csrfmiddlewaretoken': $("#csrf_token").val(),
            'id': id,
            'category': category
        };
        AJAXPromise("POST", "/classification/withdraw_classification_userview_suggestion/", data).then((success_data) => {
            showSuccessMessage(success_data.message);
            if (category !== "Bulk Edits") {
                $('#table_classification_userview_suggest_view_details').find('tr#' + id).find('td:eq(7)').html('withdrawn');
                $('#table_classification_userview_suggest_view_details').find('tr#' + id).find('td:eq(14)').html('No Modifications Allowed');
            } else {
                $('#table_classification_userview_suggest_view_details_bulk').find('tr#' + id).find('td:eq(2)').html('withdrawn');
                $('#table_classification_userview_suggest_view_details_bulk').find('tr#' + id).find('td:eq(10)').html('No Modifications Allowed');
            }

        }, (error) => {
            showErrorMessage(error.responseJSON.message);
        });
    });

    $(document).on("click", ".edit_classification_userview_suggestion_modal", function () {
        let id = $(this).attr('id');
        let category = $("#category_for_reuse").val();
        let data = {
            'csrfmiddlewaretoken': $("#csrf_token").val(),
            'id': id,
            'category': category
        };
        AJAXPromise("POST", "/classification/edit_classification_userview_suggestion_modal/", data).then((success_data) => {
            $("#edit_suggested_l3_data_userview").html(success_data);
            $('#edit_modal_classification_userview').modal('show');
        }, (error) => {
            showErrorMessage(error.responseJSON.message);
        });
    });

    $(document).on("click", ".edit_classification_userview_suggestion", function () {
        let id = $("#classification_userview_modal_id").val();
        let new_l3_category = $("#classification_userview_l3_span_edit_bulk_or_line").text();
        let comments_by_user = $("#classification_comment_by_user_userview").val();
        let category = $("#category_for_reuse_edit").val();
        let data = {
            'csrfmiddlewaretoken': $("#csrf_token").val(),
            'id': id,
            'new_l3_category': new_l3_category,
            'comments_by_user': comments_by_user,
            'category': category
        };
        AJAXPromise("POST", "/classification/edit_classification_userview_suggestion/", data).then((success_data) => {
            if (category !== "Bulk Edits") {
                $('#table_classification_userview_suggest_view_details').find('tr#' + id).find('td:eq(6)').html(new_l3_category);
                $('#table_classification_userview_suggest_view_details').find('tr#' + id).find('td:eq(11)').html(success_data.submitted_date);
                $('#table_classification_userview_suggest_view_details').find('tr#' + id).find('td:eq(9)').html(comments_by_user);
            } else {
                $('#table_classification_userview_suggest_view_details_bulk').find('tr#' + id).find('td:eq(1)').html(new_l3_category);
                $('#table_classification_userview_suggest_view_details_bulk').find('tr#' + id).find('td:eq(6)').html(success_data.submitted_date);
                $('#table_classification_userview_suggest_view_details_bulk').find('tr#' + id).find('td:eq(4)').html(comments_by_user);
            }

            $('#edit_modal_classification_userview').modal('hide');
            showSuccessMessage("Edit Successful");
        }, (error) => {
            showErrorMessage(error.responseJSON.message);
        });
    });

    $(document).on("click", ".classification_userview_view_search", function () {
        $(".loader-results-classification-userview-view").addClass("active");
        let search_type = $("#search_type").val();
        let search_type_value = "";
        if (search_type === 'ofa_invoice_number') {
            search_type_value = $("#classification_userview_recommendation_view_invoice_number").val();
        } else {
            search_type_value = $("#classification_userview_recommendation_view_normalized_name").val();
        }
        let data = {
            'csrfmiddlewaretoken': $("#csrf_token").val(),
            'search_type': search_type,
            'search_type_value': search_type_value
        };
        AJAXPromise("POST", "/classification/classification_userview_view_search/", data).then((success_data) => {
            $(".span-class-search-es").removeClass("hidden");
            $("#classification_userview_view_details").html(success_data);
            $(".loader-results-classification-userview-view").removeClass("active");
        }, (error) => {
            $(".loader-results-classification-userview-view").removeClass("active");
            showErrorMessage(error.responseJSON.message);
        });
    });

    $(document).on("click", "#classification_userview_modify_l3_modal_button", function () {
        let $row = $(this).closest("tr");
        let $td = $row.find("td");
        let td_values = [];
        $.each($td, function () {
            td_values.push($(this).text());
        });
        let data = {
            'csrfmiddlewaretoken': $("#csrf_token").val(),
            'td_values': td_values
        };
        AJAXPromise("POST", "/classification/show_classification_userview_modify_l3_modal/", data).then((success_data) => {
            $("#classification_userview_modify_l3_data").html(success_data);
            $("#classification_userview_modify_l3_modal").modal("show");
        }, (error) => {
            showErrorMessage(error.responseJSON.message);
        });
    });

    $(document).on("click", ".classification_userview_modify_l3", function () {
        let source = $("#classification_userview_source_suggest_l3").val();
        let normalized_name = $("#classification_userview_normalized_name_suggest_l3").val();
        let invoice_number = $("#classification_userview_invoice_number_suggest_l3").val();
        let invoice_line_number = $("#classification_userview_invoice_line_no_suggest_l3").val();
        let invoice_line_description = $("#classification_userview_invoice_line_description_suggest_l3").val();
        let spend = $("#classification_userview_spend_value_suggest_l3").val();
        let suggested_l3_value = $("#classification_userview_l3_span_modify_l3").text();
        let current_l3_value = $("#classification_userview_current_l3_value").val();
        let comment_by_user = $("#classification_userview_comment_by_user_userview_suggest_l3").val();
        let chart_of_accounts = $("#classification_userview_chart_of_accounts").val();
        let recommendation_type = $('#recommendation_type_suggest_l3').val();
        if (suggested_l3_value === "Select l3 category") {
            showErrorMessage("Please select an L3 category");
        } else {
            if (current_l3_value === suggested_l3_value) {
                showErrorMessage("Current L3 Category and Suggested L3 Category cannot be same.");
            } else if (comment_by_user === "") {
                showErrorMessage("Please Provide valid Comments!")
            } else {
                let data = {
                    'csrfmiddlewaretoken': $("#csrf_token").val(),
                    'new_l3_value': suggested_l3_value,
                    'source': source,
                    'normalized_name': normalized_name,
                    'invoice_number': invoice_number,
                    'invoice_line_number': invoice_line_number,
                    'invoice_line_description': invoice_line_description,
                    'spend': spend,
                    'current_l3_value': current_l3_value,
                    'comment_by_user': comment_by_user,
                    'recommendation_type': recommendation_type,
                    'chart_of_accounts': chart_of_accounts
                };
                AJAXPromise("POST", "/classification/classification_userview_modify_l3_submit/", data).then((success_data) => {
                    $("#classification_userview_modify_l3_modal").modal("hide");
                    showSuccessMessage("Suggested Submitted Succesfully");
                }, (error) => {
                    $("#classification_userview_modify_l3_modal").modal("hide");
                    showErrorMessage(error.responseJSON.message);
                });
            }
        }

    });

});