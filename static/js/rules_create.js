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

    $(document).on("change", "#rule_class", function () {
        $('.loader-results').addClass('active');
        let class_type = $("#rule_class").val();
        $(".multiple_field").slice(1).remove();
        const field_dropdown_rules = $("#field_dropdown_rules");
        field_dropdown_rules.dropdown('clear');
        field_dropdown_rules.find("option:gt(0)").remove();
        if (class_type !== "CLASS 2") {
            $(".add_div").removeClass("hidden");
        } else {
            $(".add_div").addClass("hidden");
            $("#rule_operator").val("");
            $(".operator_div").addClass("hidden");
        }
        let data = {
            'csrfmiddlewaretoken': $("#csrf_token").val(),
            'class_type': class_type
        }
        AJAXPromise("POST", "/rules/load_rule_type/", data).then((success_data) => {
            const rule_type_dropdown = $("#rule_type");
            rule_type_dropdown.dropdown('clear');
            rule_type_dropdown.find("option:gt(0)").remove();
            let value = "";
            for (let rule_type in success_data.rule_types) {
                const option = $("<option/>");
                option.attr("value", success_data.rule_types[rule_type]).text(success_data.rule_types[rule_type]);
                rule_type_dropdown.append(option);
                value = success_data.rule_types[rule_type]
            }
            if (class_type !== "CLASS 2") {
                document.getElementById('rule_type').selectedIndex = "1";
                rule_type_populate();
            }

            $('.loader-results').removeClass('active');
        }, (error) => {
            $('.loader-results').removeClass('active');
            showErrorMessage(error.responseJSON.message);
        });
    });

    $(document).on("change", "#rule_type", function () {
        $('.loader-results').addClass('active');
        let class_type = $("#rule_class").val();
        let rule_type = $("#rule_type").val();
        if (rule_type) {
            let data = {
                'csrfmiddlewaretoken': $("#csrf_token").val(),
                'rule_type': rule_type
            }
            AJAXPromise("POST", "/rules/load_fields/", data).then((success_data) => {
                const field_dropdown_rules = $("#field_dropdown_rules");
                field_dropdown_rules.dropdown('clear');
                field_dropdown_rules.find("option:gt(0)").remove();
                for (let count in success_data.fields) {
                    const option = $("<option/>");
                    option.attr("value", success_data.fields[count]).text(success_data.fields[count]);
                    field_dropdown_rules.append(option);
                }
                $("#rule_type_id").val(success_data.rule_type_id);
                if (class_type !== "CLASS 2") {
                    $(".add_div").removeClass("hidden");
                } else {
                    $(".add_div").removeClass("hidden").addClass("hidden");
                    $("#rule_operator").val("");
                    $(".operator_div").addClass("hidden");
                }
                $('.loader-results').removeClass('active');
            }, (error) => {
                $('.loader-results').removeClass('active');
                showErrorMessage(error.responseJSON.message);
            });
        }
    });

    function rule_type_populate() {
        $('.loader-results').addClass('active');
        let class_type = $("#rule_class").val();
        let rule_type = $("#rule_type").val();
        if (rule_type) {
            let data = {
                'csrfmiddlewaretoken': $("#csrf_token").val(),
                'rule_type': rule_type
            }
            AJAXPromise("POST", "/rules/load_fields/", data).then((success_data) => {
                const field_dropdown_rules = $("#field_dropdown_rules");
                field_dropdown_rules.dropdown('clear');
                field_dropdown_rules.find("option:gt(0)").remove();
                for (let count in success_data.fields) {
                    const option = $("<option/>");
                    option.attr("value", success_data.fields[count]).text(success_data.fields[count]);
                    field_dropdown_rules.append(option);
                }
                $("#rule_type_id").val(success_data.rule_type_id);
                if (class_type !== "CLASS 2") {
                    $(".add_div").removeClass("hidden");
                } else {
                    $(".add_div").removeClass("hidden").addClass("hidden");
                    $("#rule_operator").val("");
                    $(".operator_div").addClass("hidden");
                }
                if (class_type === "CLASS 4") {
                    let optionValues = [];

                    $('#field_dropdown_rules option').each(function () {
                        optionValues.push($(this).val());
                    });
                    if (optionValues.length > 1) {
                        document.getElementById('field_dropdown_rules').selectedIndex = "1";
                    }
                }
                $('.loader-results').removeClass('active');
            }, (error) => {
                $('.loader-results').removeClass('active');
                showErrorMessage(error.responseJSON.message);
            });
        }
    }

    $(document).on('click', "#create_rule", function () {
        $('.loader-results').addClass('active');
        let class_type = $("#rule_class").val();
        if (class_type) {
            let rule_type = $("#rule_type").val();
            let fields;
            fields = $("select[name='field_dropdown_rules_name[]']").map(function () {
                return $(this).val();
            }).get();
            let field_values;
            field_values = $("input[name='field_value_name[]']").map(function () {
                return $(this).val();
            }).get();
            let operator = $("#rule_operator").val();
            let commodity = $("#commodity_value").val();
            let rule_type_id = $("#rule_type_id").val();
            let comments = $("#comments_for_rule").val();
            if (fields.length === 1) {
                operator = "No Operator";
            }

            if ((rule_type && operator && commodity && comments !== "") && (check_for_empty_arrary(fields) && check_for_empty_arrary(field_values) && (field_values.length === fields.length))) {
                let data = {
                    'csrfmiddlewaretoken': $("#csrf_token").val(),
                    'rule_type': rule_type,
                    'class_type': class_type,
                    'fields': fields,
                    'field_values': field_values,
                    'operator': operator,
                    'commodity': commodity,
                    'rule_type_id': rule_type_id,
                    'comments': comments
                };
                AJAXPromise("POST", "/rules/create_rule_on_click/", data).then((success_data) => {
                    $('.loader-results').removeClass('active');
                    showSuccessMessage("Rule Created with id " + success_data.rule_id + "");
                }, (error) => {
                    $('.loader-results').removeClass('active');
                    showErrorMessage(error.responseJSON.message);
                });
            } else {
                $('.loader-results').removeClass('active');
                showErrorMessage("Please enter all the required values");
            }

        } else {
            $('.loader-results').removeClass('active');
            showErrorMessage("please select the CLASS");
        }
    });
});