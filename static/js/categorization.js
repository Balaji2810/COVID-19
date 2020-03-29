$(function () {

    $('.ui.checkbox')
        .checkbox()
    ;

    $('.ui.dropdown')
        .dropdown();
});

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

    $(document).on("click", "#initial_categorization_submit", function () {
        $('.loader-results').addClass('active');
        let data = {
            'csrfmiddlewaretoken': $("#csrf_token").val()
        }
        AJAXPromise("POST", "/categorization/initial_submit/", data).then((success_data) => {
            $(".span-class").removeClass('hidden');
            $('#categorization_details').html(success_data);
            $('.loader-results').removeClass('active');
        }, (error) => {
            $('.loader-results').removeClass('active');
            showErrorMessage(error.responseJSON.message);
        });
    });

    $(document).on("click", "#categorizationViewSubmit", function () {
        $('.loader-results').addClass('active');
        let from = $('#datepickerFrom').val();
        let to = $('#datepickerTo').val();
        let gl_account = $("#search_selection_dropdown_gl_account").val();
        let custom_fields = $("#custom_fields").val();
        let custom_fields_values = $("#custom_search_fields_values").val();
        let invoice_number = $("#invoice_number_search").val();
        let commodity = $("#commodity_value").val();
        let date_category = $("#date_type_categorization").val();
        if (from === "" || to === "") {
            showErrorMessage("Please select the Date");
        } else {
            let data = {
                'csrfmiddlewaretoken': $("#csrf_token").val(),
                'from_date': from,
                'to_date': to,
                'gl_account': gl_account,
                'commodity': commodity,
                'custom_fields': custom_fields,
                'custom_fields_values': custom_fields_values,
                'invoice_number': invoice_number,
                'date_category': date_category
            };

            AJAXPromise("POST", "/categorization/get_transactions/", data).then((success_data) => {
                $(".span-class").removeClass('hidden');
                $('#categorization_details').html(success_data);
                $('.loader-results').removeClass('active');
            }, (error) => {
                $('.loader-results').removeClass('active');
                showErrorMessage(error.responseJSON.message);
            });
        }
    });
});