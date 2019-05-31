$(document).ready(function() {
  $('button').click(function(){
    var vendidos = [];
    $.each($("input[name='seleccionarChk']:checked"), function(){
      vendidos.push($(this).val());
    });
    $.ajax({
      url: '/registroSalida/nuevo',
      method: 'POST',
      contentType: 'application/json',
      data: JSON.stringify({vendidos: vendidos}),
      success: function(response){
        window.location.href=('/registroSalida/')
        //console.log(response);
      }
    });
  });
});
