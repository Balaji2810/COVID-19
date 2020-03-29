$(function () {

    $('.ui.checkbox')
        .checkbox()
    ;

    $('.ui.dropdown')
        .dropdown();
});

function approve_or_reject_selected(data) {
    AJAXPromise("POST", "/rules/approve_or_reject_multiple/", data).then((success_data) => {
        $('.loader-results').removeClass('active');
        $('#table_id tr').removeClass('selected');
        location.reload(true);
        showSuccessMessage(success_data.message);

    }, (error) => {
        $('.loader-results').removeClass('active');
        $('#table_id tr').removeClass('selected');
        showErrorMessage(error.responseJSON.message);
    });
}

function turn_in_review(data) {
    AJAXPromise("POST", "/rules/turn_in_review/", data).then((success_data) => {
        $('.loader-results').removeClass('active');
        $('#table_id tr').removeClass('selected');
        location.reload(true);
        showSuccessMessage(success_data.message);

    }, (error) => {
        $('.loader-results').removeClass('active');
        $('#table_id tr').removeClass('selected');
        showErrorMessage(error.responseJSON.message);
    });
}

$(function () {

    $(document).on("change", "#classification_userview_suggested_l3_submit_on_change_homepage", function () {
        $("#commodity_value").val($("#classification_userview_l3_span_bulk_suggestion").text());
        $("#l3_dropdown_items").val($("#classification_userview_l3_span_bulk_suggestion").text());
        $("#l3_dropdown_items_default").text($("#classification_userview_l3_span_bulk_suggestion").text());
    });

    $(document).on("change", "#l3_dropdown_items", function () {
        $("#commodity_value").val($("#l3_dropdown_items_default").text());
        $("#classification_userview_suggested_l3_submit_on_change_homepage").val($("#l3_dropdown_items_default").text());
        $("#classification_userview_l3_span_bulk_suggestion").text($("#l3_dropdown_items_default").text());
    });

    $(document).on("click", "#ruleViewSubmit", function () {
        $('.loader-results').addClass('active');
        let from = $('#datepickerFrom').val();
        let to = $('#datepickerTo').val();
        let rule_type = $("#search_selection_dropdown_rules").val();
        let custom_fields = $("#custom_fields").val();
        let custom_fields_values = $("#custom_search_fields_values").val();
        let rule_id = $("#rule_id_search").val();
        let commodity = $("#commodity_value").val();
        let date_category = $("#date_type_rules").val();
        let checked_values = [];
        $.each($("input[name='rule_status']:checked"), function () {
            checked_values.push($(this).val());
        });
        if (checked_values.length === 0) {
            showErrorMessage("Please select the Status");
        } else {
            let data = {
                'csrfmiddlewaretoken': $("#csrf_token").val(),
                'from_date': from,
                'to_date': to,
                'status': checked_values,
                'category': rule_type,
                'commodity': commodity,
                'custom_fields': custom_fields,
                'custom_fields_values': custom_fields_values,
                'rule_id': rule_id,
                'date_category': date_category
            };

            AJAXPromise("POST", "/rules/get_rules/", data).then((success_data) => {
                $(".span-class").removeClass('hidden');
                $('#rule_details').html(success_data);
                $('.loader-results').removeClass('active');
            }, (error) => {
                $('.loader-results').removeClass('active');
                showErrorMessage(error.responseJSON.message);
            });
        }
    });

    $(document).on("click", ".approve_rule", function () {
        $('.loader-results').addClass('active');
        let transaction_id = this.id;
        let data = {
            'csrfmiddlewaretoken': $("#csrf_token").val(),
            'transaction_id': transaction_id,
            'operation': 'Approved'
        };
        AJAXPromise("POST", "/rules/approve_or_reject_rule/", data).then((success_data) => {
            $("#initial_rule_submit").click();
            showSuccessMessage("Rule " + transaction_id + " Approved");
            $('.loader-results').removeClass('active');
        }, (error) => {
            $('.loader-results').removeClass('active');
            showErrorMessage(error.responseJSON.message);
        });
    });

    $(document).on("click", ".reject_rule", function () {
        $('.loader-results').addClass('active');
        let transaction_id = this.id;
        let data = {
            'csrfmiddlewaretoken': $("#csrf_token").val(),
            'transaction_id': transaction_id,
            'operation': 'Rejected'
        };
        AJAXPromise("POST", "/rules/approve_or_reject_rule/", data).then((success_data) => {
            $("#initial_rule_submit").click();
            showSuccessMessage("Rule " + transaction_id + " Rejected");
            $('.loader-results').removeClass('active');
        }, (error) => {
            $('.loader-results').removeClass('active');
            showErrorMessage(error.responseJSON.message);
        });
    });

    $(document).on("click", "#initial_rule_submit", function () {
        $('.loader-results').addClass('active');
        let data = {
            'csrfmiddlewaretoken': $("#csrf_token").val()
        }
        AJAXPromise("POST", "/rules/initial_submit/", data).then((success_data) => {
            $(".span-class").removeClass('hidden');
            $('#rule_details').html(success_data);
            $('.loader-results').removeClass('active');
        }, (error) => {
            $('.loader-results').removeClass('active');
            showErrorMessage(error.responseJSON.message);
        });
    });

    $(document).on("change", "#date_type_rules", function () {
        let value = $(this).val();
        if (value === "Last 3 Months" || value === "Last 6 months") {
            $('.loader-results').addClass('active');
            let data = {
                'csrfmiddlewaretoken': $("#csrf_token").val(),
                'date_type': value
            }
            AJAXPromise("POST", "/rules/bring_results_by_date/", data).then((success_data) => {
                $(".span-class").removeClass('hidden');
                $('#rule_details').html(success_data);
                $('.loader-results').removeClass('active');

            }, (error) => {
                $('.loader-results').removeClass('active');
                showErrorMessage(error.responseJSON.message);
            });
        }
    });
    $(document).on("click", "#approve_all_rules", function () {
        let data = {
            'csrfmiddlewaretoken': $("#csrf_token").val(),
            'operation': 'Approved'
        }
        AJAXPromise("POST", "/rules/approve_or_reject_all_rules/", data).then((success_data) => {
            showSuccessMessage(success_data.message);
            $("#initial_rule_submit").click();
            $('.loader-results').removeClass('active');

        }, (error) => {
            $('.loader-results').removeClass('active');
            showErrorMessage(error.responseJSON.message);
        });
    });

    $(document).on("click", "#reject_all_rules", function () {
        let data = {
            'csrfmiddlewaretoken': $("#csrf_token").val(),
            'operation': 'Rejected'
        }
        AJAXPromise("POST", "/rules/approve_or_reject_all_rules/", data).then((success_data) => {
            showSuccessMessage(success_data.message);
            $("#initial_rule_submit").click();
            $('.loader-results').removeClass('active');

        }, (error) => {
            $('.loader-results').removeClass('active');
            showErrorMessage(error.responseJSON.message);
        });
    });

});