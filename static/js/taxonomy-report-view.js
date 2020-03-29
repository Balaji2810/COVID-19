let level_data = {};

function clearLevel() {
    for (let index=0; index<arguments.length; index++){
        $(arguments[index][0]).find('option').remove().end().append('<option value="">' + arguments[index][1] + '</option>');
    }

}

function setDataToDropdown(level, data, sort) {
    if (sort) {
        data.sort(function (a, b) {
            return (a.toLowerCase() < b.toLowerCase()) ? -1 : 1;
        });
    }
    for (let field of data) {
        const option = $("<option/>");
        option.attr("value", field).text(field);
        $(level).append(option);
    }
}


function loadTaxonomyData() {
    AJAXPromise("GET", "/taxonomy/get_taxonomies_report_view/").then((success_data) => {
        success_data = success_data.data;
        let accounts = [];

        for (let index = 0; index < success_data.length; index++) {

            let level_1 = success_data[index]['level_1'];
            let level_2 = success_data[index]['level_2'];
            let level_3 = success_data[index]['level_3'];

            level_data[level_1] = level_data[level_1] ? level_data[level_1] : {};
            level_data[level_1][level_2] =
                level_data[level_1][level_2] ? level_data[level_1][level_2] : {};
            level_data[level_1][level_2][level_3] =
                level_data[level_1][level_2][level_3] ? level_data[level_1][level_2][level_3] : {};

            if (success_data[index]['account'] && success_data[index]['account'] !== "") {
                accounts.push(success_data[index]['account']);
            }

        }
        accounts = [...new Set(accounts)];
        clearLevel(["#level-1","Level 1"],["#level-2","Level 2"],["#level-3","Level 3"]);
        let first_level_data = Object.keys(level_data);
        setDataToDropdown('#level-1', first_level_data, true);

        clearLevel(['#account', 'Default Account']);
        setDataToDropdown('#account', accounts, true);

        let status = ['Active', 'InActive'];

        clearLevel(['#status', 'Status']);
        setDataToDropdown('#status', status, false);


    }, (error) => {
        $(".loader-results-taxonomy").removeClass("active");
        showErrorMessage(error.message);
    });

}

$(function () {
    loadTaxonomyData();
    $('.taxonomy.dropdown').dropdown({
        'clearable':true,
        'ignoreCase':true,
        'sortSelect':true
    });

    $(document).on("click", "#search-taxonomy", function () {

        $(".span-class-taxonomy-reportview").removeClass('hidden');
        $(".loader-results-taxonomy").addClass("active");
        let level_3_taxonomy = $("#level-3").val();
        let level_2_taxonomy = $("#level-2").val();
        let level_1_taxonomy = $("#level-1").val();
        let account = $("#account").val();
        let status = $("#status").val();

        let data = {
            'csrfmiddlewaretoken': $("#csrf_token").val(),
            'level_3_taxonomy': level_3_taxonomy,
            'level_2_taxonomy':level_2_taxonomy,
            'level_1_taxonomy':level_1_taxonomy,
            'account': account,
            'status': status
        }

        AJAXPromise("POST", "/taxonomy/load_report_view_table/", data).then((taxonomy_data) => {
            $(".span-class-taxonomy-reportview").removeClass('hidden');
            $("#taxonomy-report-view").html(taxonomy_data);
            $(".loader-results-taxonomy").removeClass("active");
        }, (error) => {
            $(".loader-results-taxonomy").removeClass("active");
            showErrorMessage(error.message);
        });
    });

    $(document).on("change", "#level-1", function () {
        let level_one_selected_value = $(this).val();

        clearLevel(['#level-2', 'Level 2']);
        clearLevel(['#level-3', 'Level 3']);

        if (level_one_selected_value === "") {
            return;
        }

        let second_level_data = Object.keys(level_data[level_one_selected_value]);

        setDataToDropdown('#level-2', second_level_data, true);

    });

    $(document).on("change", "#level-2", function () {

        let level_one_selected_value = $("#level-1").val();
        let level_two_selected_value = $(this).val();

        clearLevel(['#level-3', 'Level 3']);

        if (level_one_selected_value === "" || level_two_selected_value === "") {
            return;
        }

        let third_level_data = Object.keys(level_data[level_one_selected_value][level_two_selected_value]);
        setDataToDropdown('#level-3', third_level_data, true);


    })

});