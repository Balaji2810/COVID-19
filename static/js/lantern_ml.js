$(function () {
    console.log("In Here");
    $('.ui.checkbox')
        .checkbox();

    $('.ui.dropdown')
        .dropdown();

    $('.ui.menu')
        .menu();


    $(document).on("click", "#menu_button", function () {
        $('.sidebar')
            .sidebar('toggle')
    });


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

    $(document).on("click", "#submit_new_request", function () {
        $('.loader-results').addClass('active');
        let data = {
            'csrfmiddlewaretoken': $("#csrf_token").val()
        };
        AJAXPromise("POST", "/lantern_ml/fetch_sample_data/", data).then((success_data) => {
            $(".span-class").removeClass('hidden');
            $('#sample_data').html(success_data);
            $('.loader-results').removeClass('active');
        }, (error) => {
            $('.loader-results').removeClass('active');
            showErrorMessage(error.responseJSON.message);
        });
    });

    // $(document).on("click", "#new_request_button", function () {
    //     let data = {
    //         'csrfmiddlewaretoken': $("#csrf_token").val(),
    //     };
    //     AJAXPromise("POST", "/lantern_ml/new_request/",data).then((success_data) => {
    //         console.log("DONE");
    //     }, (error) => {
    //         showErrorMessage(error.responseJSON.message);
    //     });
    // });
});