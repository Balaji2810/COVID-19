$(function () {

    $.datepicker.setDefaults(
        $.extend($.datepicker.regional[''])
    );

    initiateDatePickerJquery("datepickerFromKnownMappings");
    initiateDatePickerJquery("datepickerToKnownMappings");
    initiateDatePickerJquery("datepickerFromKnownMappingsUploads");
    initiateDatePickerJquery("datepickerToKnownMappingsUploads");

    $('.ui.checkbox')
        .checkbox();

    $(document).ready(function () {
        $('input[type=file]').on('change', function (event) {
            let name = event.target.files[0].name;
            $("#file_text_known_mapppings").val(name);
        });

    });

    $(document).on("click", "#knownmappings_get_results", function () {
        $('.loader-results').addClass('active');
        let from = $('#datepickerFromKnownMappings').val();
        let to = $('#datepickerToKnownMappings').val();
        let checked_values = [];
        $.each($("input[name='status_knownmappings']:checked"), function () {
            checked_values.push($(this).val());
        });
        if (from === "" || to === "") {
            defaultDateSetter("datepickerFromKnownMappings", "datepickerToKnownMappings");
            from = $('#datepickerFromKnownMappings').val();
            to = $('#datepickerToKnownMappings').val();
        }
        if (checked_values.length === 0) {
            showErrorMessage("Please select Status");
        } else {
            let data = {
                'csrfmiddlewaretoken': $("#csrf_token").val(),
                'from_date': from,
                'to_date': to,
                'status': checked_values
            };
            AJAXPromise("POST", "/gcplantern/get_requested_job_data/", data).then((success_data) => {
                $(".span-class").removeClass('hidden');
                $('#knownmappings_sync_details').html(success_data);
                $('.loader-results').removeClass('active');
            }, (error) => {
                $('.loader-results').removeClass('active');
                showErrorMessage(error.responseJSON.message);
            });
        }
    });

    $(document).on("click", "#knownmappings_get_upload_results", function () {
        $('.loader-results-uploads').addClass('active');
        let from = $('#datepickerFromKnownMappingsUploads').val();
        let to = $('#datepickerToKnownMappingsUploads').val();
        if (from === "" || to === "") {
            defaultDateSetter("datepickerFromKnownMappingsUploads", "datepickerToKnownMappingsUploads");
            from = $('#datepickerFromKnownMappingsUploads').val();
            to = $('#datepickerToKnownMappingsUploads').val();
        }
        let data = {
            'csrfmiddlewaretoken': $("#csrf_token").val(),
            'from_date': from,
            'to_date': to
        };
        AJAXPromise("POST", "/gcplantern/get_requested_uploads_data/", data).then((success_data) => {
            $(".span-class-uploads").removeClass('hidden');
            $('#knownmappings_upload_details').html(success_data);
            $('.loader-results-uploads').removeClass('active');
        }, (error) => {
            $('.loader-results-uploads').removeClass('active');
            showErrorMessage(error.responseJSON.message);
        });
    });

    $(document).on("click", "#run_impact_analysis_job", function () {
        let comments = $('#comments_by_user_known_mappings_impact_analysis').val();
        if (comments === "") {
            showErrorMessage("Comments cannot be empty. Please provide a valid comment.");
        } else {
            let data = {
                'csrfmiddlewaretoken': $("#csrf_token").val(),
                'comments': comments
            };
            AJAXPromise("POST", "/gcplantern/run_impact_analysis_job/", data).then((success_data) => {
                showSuccessMessage(success_data.message);
            }, (error) => {
                showErrorMessage(error.responseJSON.message);
            });
        }
    });

    $(document).on("click", "#impact_analysis", function () {
        $("#impact_analysis_modal").modal('show');
    });

    $(document).on("click", ".approve_impact_analysis", function () {
        let id = $("#impact_analysis_report_id").val();
        if (id === "") {
            showErrorMessage("User made a Bad request. Please reload the page and try again");
        } else {
            let data = {
                'csrfmiddlewaretoken': $("#csrf_token").val(),
                'id': id,
                'status': "pending deployment"
            };
            AJAXPromise("POST", "/gcplantern/approve_or_reject_impact_analysis/", data).then((success_data) => {
                $(".impact_analysis_report_data_view").addClass("hidden");
                showSuccessMessage(success_data.message);
            }, (error) => {
                showErrorMessage(error.responseJSON.message);
            });
        }

    });

    $(document).on("click", ".reject_impact_analysis", function () {
        let id = $("#impact_analysis_report_id").val();
        if (id === "") {
            showErrorMessage("User made a Bad request. Please reload the page and try again");
        } else {
            let data = {
                'csrfmiddlewaretoken': $("#csrf_token").val(),
                'id': id,
                'status': "rejected impact analysis"
            };
            AJAXPromise("POST", "/gcplantern/approve_or_reject_impact_analysis/", data).then((success_data) => {
                $(".impact_analysis_report_data_view").addClass("hidden");
                showSuccessMessage(success_data.message);
            }, (error) => {
                showErrorMessage(error.responseJSON.message);
            });
        }

    });

});