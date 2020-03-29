function modify_detailed(year,region,source,commodity,records)
{
  //alert(year+" "+region+" "+records+" "+commodity);
  document.getElementById("year").innerHTML=year;
  document.getElementById("region").innerHTML=region;
  document.getElementById("source").innerHTML=source;
  document.getElementById("commodity").innerHTML=commodity;
  document.getElementById("records").innerHTML=records;
  document.getElementById("new_value").value="";
  document.getElementById("update_btn").onclick = function(){update_btn_clicked(year,region,source,commodity);};
  $('#detailed_modal').modal({
            selector: {
                close: '.actions .button',
                deny: '.actions .negative, .actions .deny, .actions .cancel, .close'
        },
        closable  : false,
        onDeny    : function(){
          // I would like to have this function run when the user
          // clicks the close icon

          return false;
        },
        onApprove : function() {

        }
      }).modal('show');


}

function update_btn_clicked(year,region,source,commodity)
{
  records = document.getElementById("new_value").value;
  if(records=="" || !(Number.isInteger(parseInt(records))))
  {
    alert("Invalid Input!!");
    return;
  }
  document.getElementById("update_btn").className = "ui loading button";
  document.getElementById("update_cancel").disabled = true;
  document.getElementById("update_btn").disabled = true;
  //alert('/lantern_ml/api/update_prod_sync?year='+year+'&region='+region+'&source='+source+'&commodity='+commodity+'&records='+records);
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      v = JSON.parse(this.responseText);
      if(v['code']=='1')
      {
        location.reload();
      }
      else {
        document.getElementById("update_cancle").disabled = false;
      }
    }
  };
  xhttp.open("GET",'/lantern_ml/api/update_prod_sync?year='+year+'&region='+region+'&source='+source+'&commodity='+commodity+'&records='+records, true);
  xhttp.send();
  
}

function sync_cnfm(opt)
{
  if(opt==1)
  {
    document.getElementById("sync_msg").innerHTML="All the data in the Test Version will be synced with the Prod Version.";
    document.getElementById("sync_head").innerHTML="Sync Prod Version from Test Version";
    document.getElementById("sync_btn").onclick = function(){sync_btn_clicked('/lantern_ml/api/prod2test/');};
  }
  else {
    document.getElementById("sync_msg").innerHTML="All the data in the Prod Version will be synced with the Test Version";
    document.getElementById("sync_head").innerHTML="Sync Test Version from Prod Version";
    document.getElementById("sync_btn").onclick = function(){sync_btn_clicked('/lantern_ml/api/test2prod/');};
  }


  $('#sync').modal({
            selector: {
                close: '.actions .button',
                deny: '.actions .negative, .actions .deny, .actions .cancel, .close'
        },
        closable  : false,
        onDeny    : function(){
          // I would like to have this function run when the user
          // clicks the close icon

          return false;
        },
        onApprove : function() {

        }
      }).modal('show');
}

function sync_btn_clicked(str)
{
  document.getElementById("sync_btn").className = "ui loading button";
  document.getElementById("sync_cancel").disabled = true;
  document.getElementById("sync_btn").disabled = true;

  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      v = JSON.parse(this.responseText);
      if(v['code']=='1')
      {
        location.reload();
      }
      else {
        document.getElementById("sync_cancle").disabled = false;
      }
    }
  };
  xhttp.open("GET",str, true);
  xhttp.send();

}

$(document).ready(function () {

  var table =  $('#table-job-status').DataTable({
        "lengthMenu": [[10, 25, 50], [10, 20, 30]]
    });

    $('#filter_year').dropdown(
        {
            onChange: function (value) {
                table.column(0).search(value).draw();

            }
        }
    );

    $('#filter_source').dropdown(
        {
            onChange: function (value) {
                table.column(2).search(value).draw();

            }
        }
    );

    $('#filter_commodity').dropdown(
        {
            onChange: function (value) {
                table.column(3).search(value).draw();

            }
        }
    );

    $('#filter_region').dropdown(
        {
            onChange: function (value) {

                table.column(1).search(value).draw();

            }
        }
    );
});
