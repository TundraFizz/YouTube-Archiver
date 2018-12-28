$(function(){
var socket = io();

socket.on("update", function(msg){
  if(msg.length == 0){
    $("#download-queue-base").css("display", "none");
    return;
  }

  var html = ejs.render(`
  <% for(var i of downloadQueue){ %>
    <tr>
      <td><img src="<%= i.thumb %>" style="height: 40px;"></td>
      <td><%= i.title    %></td>
      <td><%= i.progress %>%</td>
    </tr>
  <% } %>
  `, {"downloadQueue": msg});

  $("#download-queue").html(html);
  $("#download-queue-base").css("display", "block");
});

socket.on("update2", function(msg){
  var html = ejs.render(`
  <% for(var i of library){ %>
    <tr>
      <td><img src="<%= i.pathImage %>" style="height: 40px;"></td>
      <td><%= i.title %></td>
      <td><a href="<%= i.pathVideo %>" target="_blank"><%= i.pathVideo %></a></td>
      <!-- <td><%= i.duration  %></td> -->
    </tr>
  <% } %>
  `, {"library": msg});

  $("#library").html(html);
});

socket.on("admin", function(msg){
  console.log(msg);
});

socket.on("alert", function(msg){
  alert(msg);
});

$("#submit").click(function(){
  var url = $("#url").val();
  socket.emit("archive", {"url": url});
});

});
