$(document).on('click','#submit_sme_data',function(){
    showSuccessMessage("SME Data Successfully added")
    $('#sme_add_data').modal('hide')
})




$(document).ready(function () {
    $('.ui.modal')
        .modal();

    $("#ad").click(function () {
        $('#sme_add_data')
            .modal('show')
    });

});
