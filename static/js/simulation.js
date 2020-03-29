$(function () {

    $('.ui.dropdown')
        .dropdown();

    $(document).on("click", "#run_simulation", function () {
        let comment = $("#simulate_comments").val();
        if ($.trim(comment) !== "") {
            let data = {
                'csrfmiddlewaretoken': $("#csrf_token").val(),
                'comments': comment
            }
            AJAXPromise("POST", "/simulation/run_simulation/", data).then((success_data) => {
                $('.loader-results').removeClass('active');
                showSuccessMessage(success_data.message);
            }, (error) => {
                $('.loader-results').removeClass('active');
                showErrorMessage(error.responseJSON.message);
            });
        } else {
            showErrorMessage("comments cannot be empty");
        }

    });

    $(document).on("click", "#rollback_changes", function () {
        let comment = $("#simulate_comments").val();
        if ($.trim(comment) !== "") {
            let data = {
                'csrfmiddlewaretoken': $("#csrf_token").val(),
                'comments': comment
            }
            AJAXPromise("POST", "/simulation/rollback_changes/", data).then((success_data) => {
                $('.loader-results').removeClass('active');
                showSuccessMessage(success_data.message);
            }, (error) => {
                $('.loader-results').removeClass('active');
                showErrorMessage(error.responseJSON.message);
            });

        } else {
            showErrorMessage("comments cannot be empty");
        }

    });

    $(document).on("click", "#accept_simulation", function () {
            let data = {
                'csrfmiddlewaretoken': $("#csrf_token").val(),
                'flag': 'approve'
            }
            AJAXPromise("POST", "/simulation/accept_or_reject_simulation/", data).then((success_data) => {
                $('.loader-results').removeClass('active');
                showSuccessMessage(success_data.message);
            }, (error) => {
                $('.loader-results').removeClass('active');
                showErrorMessage(error.responseJSON.message);
            });

    });

    $(document).on("click", "#reject_simulation", function () {

            let data = {
                'csrfmiddlewaretoken': $("#csrf_token").val(),
                'flag': 'reject'
            }
            AJAXPromise("POST", "/simulation/accept_or_reject_simulation/", data).then((success_data) => {
                $('.loader-results').removeClass('active');
                showSuccessMessage(success_data.message);
            }, (error) => {
                $('.loader-results').removeClass('active');
                showErrorMessage(error.responseJSON.message);
            });

    });

    $(document).on("click", "#simulation_submit", function () {
        $('.loader-results').addClass('active');
        let data = {
            'csrfmiddlewaretoken': $("#csrf_token").val()
        }
        AJAXPromise("POST", "/simulation/simulation_submit/", data).then((success_data) => {
            $(".span-class").removeClass('hidden');
            $('#simulation_details').html(success_data);
            $('.loader-results').removeClass('active');
        }, (error) => {
            $('.loader-results').removeClass('active');
            showErrorMessage(error.responseJSON.message);
        });
    });
});