$(document).ready(function() {
    getAppointments();
    btnSwitch();

    $("#btnNew").click(function () {
        $("#btnAdd").show();
        $("#btnCancel").show();
        $("#appointmentForm").show();
        $("#btnNew").hide();
    });

    $("#submitForm").validate({


        rules: {

            appointmentDate: {

                required: true,
            },

            appointmentTime: {
                required: true,

            },
            appointmentDescription: {
                required: true
            }
        },
        messages: {
            appointmentDate: "Please choose date",
            appointmentTime: "Please enter time.",
            appointmentDescription: "Please enter a description.",
        },
        errorElement: 'div',
        errorLabelContainer: '.alert-danger',

        submitHandler: function (form) {

            var txtDate = $("#appointmentDate").val();
            var txtTime = $("#appointmentTime").val();
            var txtDescription = $("#appointmentDescription").val();
            data = {
                txtDate: txtDate,
                txtTime: txtTime,
                txtDescription: txtDescription
            };

            myAjaxCall("http://localhost:8082/appointment/insertAppointment.pl",
                data,
                "POST",
                updateTableData);
        }
    });

    $("#btnCancel").click(function () {
        btnSwitch();
        $("#btnNew").show();
    });

    $("#btnSearch").click(function () {

        var searchData = $("#appointmentSearch").val();
        data = {searchData: searchData};
        myAjaxCall("http://localhost:8082/appointment/searchAppointment.pl", data, "GET", loadOnSuccess);
    });

    $('.datepicker').datepicker({
        format: 'mm/dd/yyyy',
        startDate: '-1d',
        todayHighlight: true,
        autoclose: true,
    });

    $('#appointmentTime').timepicker();

    function updateTableData(date, time, desc) {
    	var tableData = "";
        tableData += '<tr>';
        tableData += '<td>' + date + '</td>';
        tableData += '<td>' +time + '</td>';
        tableData += '<td>' + desc + '</td>';
        tableData += '</tr>';
		$('#results').append(tableData);
        btnSwitch();
        $("#btnNew").show();
		
    }

    function btnSwitch() {
        $("#appointmentForm").hide();
        $("#btnAdd").hide();
		$("#sucess-alert").hide();
        $("#btnCancel").hide();
    };

    function getAppointments(data) {
        myAjaxCall("http://localhost:8082/appointment/searchAppointment.pl", "", "GET", loadOnSuccess);
    }

    function loadOnSuccess(data) {
        if (data.length == 0) {
            failure();
        }
        else {
            var tableData = "";
            $.each(data, function (index, item) {
                var datetime = data[index].datetime.split(' ');
                tableData += '<tr>';
                tableData += '<td>' + datetime[0] + '</td>';
                tableData += '<td>' + datetime[1] + '</td>';
                tableData += '<td>' + item.description + '</td>';
                tableData += '</tr>';
            });
            $('#results').html(tableData);
			
        }
    }


    function failure() {
        var noDataError = 'No Appointment scheduled in the System. Please Enter Appointment/s';
        $('#displayAppointment').html(noDataError);
    }

    function myAjaxCall(url, data, method, callback) {
        $.ajax({
            url: url,
            type: method,
            dataType: "JSON",
            data: data,
            success: function (res) {
                if(res.msg === "success"){
                    updateTableData(data.txtDate, data.txtTime, data.txtDescription);
					$("#sucess-alert").show();			
					
				}
                else
                    loadOnSuccess(res);
            },
            error: failure
        });
    }

});
