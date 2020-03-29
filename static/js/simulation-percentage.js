$(function () {
    setInterval(function () {
        let data = {
            'csrfmiddlewaretoken': $("#csrf_token").val(),
        }
        AJAXPromise("POST", "/simulation/get_percentage/", data).then((success_data) => {
            $('#percentage_bar').progress({
                percent: success_data.percentage
            });
        }, (error) => {
            showErrorMessage(error.responseJSON.message);
        });
    }, 20 * 1000);
});