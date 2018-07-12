function Archive(){
  var link = $("#link").val();

  $.post("archive", {"link": link}, function(res){
    console.log(res);
  });
}

// $(function(){});
