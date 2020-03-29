$(function () {
    let add_edit_flag = 0;//0 = add , 1 = edit
    let editor;
    $('.ui.checkbox')
        .checkbox();

    $(document).on("click", ".show_image_modal", function () {
        $('#image_modal_view').modal('show');
    });
    $(document).on("click", ".close_image_modal_view", function () {
        $('#image_modal_view').modal('hide');
    });

    $(document).on("click", ".add_notification", function () {
        add_edit_flag = 0;
        editor.setData("");
        $('.notification-header').html("Send Notification");
        $('#add_notification_view').modal('show');
    });
    $(document).on("click", ".close_add_notification_modal_view", function () {
        $('#add_notification_view').modal('hide');
    });

    $(document).on("click", "#put_notification_button", function () {
        let notification_message = editor.getData();
        if (notification_message.length === 0) {
            showErrorMessage("Please enter some text");
        } else {
            if (add_edit_flag == 0) {
                let data = {
                    'csrfmiddlewaretoken': $("#csrf_token").val(),
                    'message': notification_message
                };
                AJAXPromise("POST", "/put_notification_message/", data).then((success_data) => {
                    showSuccessMessage("Notification Added");
                    location.reload(true);
                }, (error) => {
                    showErrorMessage(error.responseJSON.message);
                });
            } else {
                let id = $("#edit_notification_id").val().toString();
                let data = {
                    'csrfmiddlewaretoken': $("#csrf_token").val(),
                    'id': id,
                    'message': notification_message
                };
                AJAXPromise("POST", "/update_notification_message/", data).then((success_data) => {
                    showSuccessMessage("Notification Edited");
                    location.reload(true);
                }, (error) => {
                    showErrorMessage(error.responseJSON.message);
                });
            }
        }
    });

    $(document).on("click", ".delete_notification", function () {
        $(".loader-results").addClass("active");
        $(".add_notification").hide();

        let id = $(this).attr('id');
        let data = {
            'csrfmiddlewaretoken': $("#csrf_token").val(),
            'id': id
        };
        AJAXPromise("POST", "/delete_notification_message/", data).then((success_data) => {
            $(".loader-results").removeClass("active");
            $(".add_notification").show();
            location.reload(true);
        }, (error) => {
            showErrorMessage(error.responseJSON.message);
        });
    });

    $(document).on("click", ".edit_notification", function () {
        let id = $(this).attr('name').toString();
        let message = $(this).parent().prev().children('.message_content').html().toString();
        $("#edit_notification_id").val(id);
        $('.notification-header').html("Edit Notification");
        editor.setData(message);
        $('#add_notification_view').modal('show');
        add_edit_flag = 1;//1 refers to make edit request
    });

    ClassicEditor
        .create(document.getElementById("notification_message"), {
            toolbar: ['Heading', '|', 'bold', 'italic', 'link', '|', 'bulletedList', 'numberedList', 'blockQuote', '|', 'undo', 'redo', '|'],
            link: {
                // Automatically add target="_blank" and rel="noopener noreferrer" to all external links.
                addTargetToExternalLinks: true,
                // Let the users control the "download" attribute of each link.
                decorators: [
                    {
                        mode: 'manual',
                        label: 'Downloadable',
                        attributes: {
                            download: 'download'
                        }
                    }
                ]
            }
        })
        .then(newEditor => {
            editor = newEditor;
        })
        .catch(error => {
            console.error(error);
        });
});