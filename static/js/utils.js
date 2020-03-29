function check_for_empty_arrary(arrary){
    for(let i=0; i < arrary.length; i++){
                if(arrary[i] === ""){
                    return false
                }
            }
    return true
}

function showErrorMessage(message) {
    $("#errorMessageModal").modal('show');
    document.getElementById('error_message').innerHTML = message;
}

function showSuccessMessage(message) {
    $("#successMessageModal").modal('show');
    document.getElementById('success_message').innerHTML = message;
}

/*
    A method that takes method(GET, POST) , URL and data
    as parameters and returns a promise that can be acted upon
 */
function AJAXPromise(method, URL) {
    let data = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
    let processData = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : true;
    let contentType = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] :
        'application/x-www-form-urlencoded; charset=UTF-8';

    return new Promise(function (resolve, reject) {
        $.ajax({
            type: method,
            url: URL,
            data: data,
            processData: processData,
            contentType: contentType,
            success: function success(data) {
                resolve(data);
            }, error: function error(data) {
                reject(data);
            }
        });
    });
}

if (typeof (String.prototype.trim) === "undefined") {
    String.prototype.trim = function () {
        return String(this).replace(/^\s+|\s+$/g, '');
    };
}

function initiateDatePicker(id) {
    $('#' + id).flatpickr({dateFormat: "m/d/Y",});
}

function initiateDatePickerJquery(id) {
    $('#' + id).datepicker();
}

function defaultDateSetter(from_id, to_id) {
    $today = new Date();
    $yesterday = new Date($today);
    $yesterday.setDate($today.getDate() - 1);
    let $dd = $yesterday.getDate();
    let $mm = $yesterday.getMonth() + 1; //January is 0!

    let $yyyy = $yesterday.getFullYear();
    if ($dd < 10) {
        $dd = '0' + $dd
    }
    if ($mm < 10) {
        $mm = '0' + $mm
    }
    $yesterday = $mm + '/' + $dd + '/' + $yyyy;

    $date = new Date();
    $today = new Date($date);
    $today.setDate($date.getDate());
    let $day = $today.getDate();
    let $month = $today.getMonth() + 1; //January is 0!

    let $year = $today.getFullYear();
    if ($day < 10) {
        $day = '0' + $day
    }
    if ($month < 10) {
        $month = '0' + $month
    }
    $today = $month + '/' + $day + '/' + $year;

    let from = $yesterday;
    let to = $today;
    $("#" + from_id).val(from);
    $("#" + to_id).val(to);
}

function defaultDateSetterForClassification(from_id, to_id) {
    $today = new Date();
    $yesterday = new Date($today);
    $yesterday.setDate($today.getDate() - 1);
    let $dd = $yesterday.getDate();
    let $mm = $yesterday.getMonth() + 1; //January is 0!

    let $yyyy = $yesterday.getFullYear();
    if ($dd < 10) {
        $dd = '0' + $dd
    }
    if ($mm < 10) {
        $mm = '0' + $mm
    }
    $yesterday = $yyyy + '-' + $mm + '-' + $dd;

    $date = new Date();
    $today = new Date($date);
    $today.setDate($date.getDate());
    let $day = $today.getDate();
    let $month = $today.getMonth() + 1; //January is 0!

    let $year = $today.getFullYear();
    if ($day < 10) {
        $day = '0' + $day
    }
    if ($month < 10) {
        $month = '0' + $month
    }
    $today = $year + '-' + $month + '-' + $day;

    let from = $yesterday;
    let to = $today;
    $("#" + from_id).val(from);
    $("#" + to_id).val(to);
}

var decodeHTML = function (html) {
	var txt = document.createElement('textarea');
	txt.innerHTML = html;
	return txt.value;
};

function validateStringParams() {
    for (let i = 0; i < arguments.length; i++) {
        if (arguments[i] === null) {
            return false;
        }
        else if (typeof arguments[i] === 'undefined' || arguments[i].length === 0 || arguments[i].trim() === "") {
            return false;
        }

    }
    return true;
}
