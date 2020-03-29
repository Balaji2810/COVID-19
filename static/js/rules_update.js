$(function () {

    $('.ui.dropdown')
        .dropdown();

    let $row = $('#multiple_field_id');

    $(document).on('click', "#addButton", function () {
        $(".operator_div").removeClass("hidden");
        let len = $(".multiple_field").length;
        let $newRow = $row.clone();
        $newRow.prop('field_dropdown_rules' + len);
        $newRow.prop('field_value' + len);
        $newRow.prop('removeButton' + len);
        $newRow.insertAfter('.multiple_field:last');
        $newRow.find('input').each(function () {
            this.value = '';
        });
        let field_value = '';
        $row.find('select').each(function () {
            field_value = this.value;
        });
        $newRow.find('select').each(function () {
            this.value = field_value;
        });
        $('.ui.dropdown')
            .dropdown();
    });

    $(document).on('click', ".removeButton", function () {
        let $currentRow = $(this).closest('.multiple_field');
        let fields;
            fields = $("select[name='field_dropdown_rules_name[]']").map(function () {
                return $(this).val();
            }).get();
        let select_count = $('.select_count').length;
        console.log(select_count);
         if (select_count === 2){
             $(".operator_div").addClass("hidden");
         }
        if ($currentRow.index() === 4) {
            // don't remove first row
            alert("You can't remove first row");
        } else {
            $currentRow.remove();
        }
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

    $(document).on("click", "#update_rule", function () {
        let rule_id = $("#rule_id_for_update").val();
        let rule_class = $("#rule_class").val();
        let rule_type = $("#rule_type").val();
        let commodity = $("#commodity_value").val();
        let operator = $("#rule_operator").val();
        let rule_type_id = $("#rule_type_id").val();
        let created_by = $("#created_by").val();
        let created_date = $("#created_date").val();
        let user_comments = $("#comments_for_rule").val().trim();
        if(user_comments.length != 0) {
            $('.loader-results-2').addClass('active');
            let fields;
            fields = $("select[name='field_dropdown_rules_name[]']").map(function () {
                return $(this).val();
            }).get();
            let field_values;
            field_values = $("input[name='field_value_name[]']").map(function () {
                return $(this).val();
            }).get();
            if (fields.length === 1) {
                operator = "No Operator";
            }
            if ((fields.length === field_values.length) && (operator !== "None" || operator !== '') && (check_for_empty_arrary(fields) && check_for_empty_arrary(field_values))) {
                let data = {
                    'csrfmiddlewaretoken': $("#csrf_token").val(),
                    'rule_id': rule_id,
                    'rule_class': rule_class,
                    'rule_type': rule_type,
                    'commodity': commodity,
                    'operator': operator,
                    'fields': fields,
                    'field_values': field_values,
                    'rule_type_id': rule_type_id,
                    'created_by': created_by,
                    'created_date': created_date,
                    'user_comments': user_comments
                };
                AJAXPromise("POST", "/rules/modify_rule/", data).then((success_data) => {
                    $('.loader-results-2').removeClass('active');
                    showSuccessMessage(success_data.message);
                }, (error) => {
                    $('.loader-results-2').removeClass('active');
                    showErrorMessage(error.responseJSON.message);
                });
            } else {
                $('.loader-results-2').removeClass('active');
                showErrorMessage("Please enter all the Required values");
            }
        }else{
            showErrorMessage("Please enter a valid comment");
        }
        });
});