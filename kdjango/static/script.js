var i = 1;


function TabTransition(id){
  
    try{
    var selectValidHouse = (id);
console.log(selectValidHouse);
   
    $('#auction').attr('name',selectValidHouse);
    $('#tender').attr('name',selectValidHouse);
    $('#negotiation').attr('name',selectValidHouse);
    $('#enquiriesOver').attr('name',selectValidHouse);
    $('#tenderClosing').attr('name',selectValidHouse);
    $('#deadlineSale').attr('name',selectValidHouse);
    $('#house').attr('name',selectValidHouse);
    $('#townhouse').attr('name',selectValidHouse);
    $('#unit').attr('name',selectValidHouse);
    $('#section').attr('name',selectValidHouse);
    $('#lifestyleDwelling').attr('name',selectValidHouse);
    $('#21days').attr('name',selectValidHouse);
    $('#28days').attr('name',selectValidHouse);
    $('#35days').attr('name',selectValidHouse);
    $('#42days').attr('name',selectValidHouse);
    $('#56days').attr('name',selectValidHouse);
    $('#autocomplete').attr('name',selectValidHouse);

    var dfd = $('#21days').attr('name')
    console.log(dfd);
    }

    finally{

    i++;
    console.log(i);
    //var nob = $("[class^=innerTab]");
    //var tab_id = nob[i];
    //console.log(nob)

    var nob = $("li[class^=tab-link]");
    var tab_id = nob[i];
    var nobcontent = $(tab_id).attr("data-tab");
    var nobcontent = $(tab_id).attr("data-tab");
    
    console.log(tab_id);
    
  //  console.log(nob[0]);
    var nut=document.getElementById("autocomplete").innerhtml='';
    document.getElementById("autocomplete").innerhtml='';
    

    $('ul.tabs li').removeClass('current');
    $('.tab-content').removeClass('current');


    $(nob[i]).addClass('current');
    $("#"+nobcontent).addClass('current');console.log(nobcontent);
    
    if (i==4) {
    
    
        var my_text = prompt('Thanks for registering your interest with Klaus. We are still in BETA mode but will get in touch soon! Please enter your email here')


        
        alert('Thankyou someone from Klaus will get in touch soon');
//$("[class^=autocomplete]".'property value')='';

var mess = $("[class^=autocomplete]");
$("[class^=autocomplete]").blur();    
setTimeout(function(){
 $("[class^=autocomplete]").val('')
 $("[class^=autocomplete]").focus();},10)

console.log(mess);

  i=0;
  console.log(i);
  $(nob[i]).addClass('current');
  var tab_id = nob[i];
  var nobcontent = $(tab_id).attr("data-tab");
    $("#"+nobcontent).addClass('current');console.log(nobcontent);

  };
  }
  }
$(document).ready(function (){
      console.log("{% url 'dash' %}")
//Changing oolour of user selected option
  $("#21days").click(function(){
    $("#28days").css("background", "white");
  })

 $("#28days").click(function(){
    $("#28days").css("background", "white");
  })

  $("#35days").click(function(){
    $("#35days").css("background", "white");
  })

   $("#42days").click(function(){
    $("#42days").css("background", "white");
  })

    $("#house").click(function(){
    $("#house").css("background", "white");
  })

  $("#townhouse").click(function(){
    $("#townhouse").css("background", "white");
  })

  $("#unit").click(function(){
    $("#unit").css("background", "white");
  })

  $("#section").click(function(){
    $("#section").css("background", "white");
  })

   $("#lifestyleDwelling").click(function(){
    $("#lifestyleDwelling").css("background", "white");
  })

  $("#auction").click(function(){
    $("#auction").css("background", "white");
  })

  $("#tender").click(function(){
    $("#tender").css("background", "white");
  })

  $("#negotiation").click(function(){
    $("#negotiation").css("background", "white");
  })

  $("#enquiriesOver").click(function(){
    $("#enquiriesOver").css("background", "white");
  })

  $("#deadlineSale").click(function(){
    $("#deadlineSale").css("background", "white");
  })

  $("#tenderClosing").click(function(){
    $("#tenderClosing").css("background", "white");
  })


$(function(){
  // Get the modal
var modal = document.getElementById('myModal');

// Get the button that opens the modal
var button21 = document.getElementById("21days");
var button28 = document.getElementById("28days");
var button35 = document.getElementById("35days");
var button42 = document.getElementById("42days");
var button56 = document.getElementById("56days");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks on the button, open the modal
button21.onclick = function() {
    modal.style.display = "block";
}

button28.onclick = function() {
    modal.style.display = "block";
}

button35.onclick = function() {
    modal.style.display = "block";
}

button42.onclick = function() {
    modal.style.display = "block";
}

button56.onclick = function() {
    modal.style.display = "block";
}

// When the user clicks on <span> (x), close the modal

  span.onclick = function() {
    modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}})
})

$(document).ready(function(){
console.log($('#locality').attr('name'));
  $("#saleD").click(function(){
      if ($('#locality').attr('name')==null) {
  alert('Please enter address');

}
else{
       console.log($('#21days').attr('name'));
          console.log($('#28days').attr('name'));
          console.log($('#35days').attr('name'));
          console.log($('#42days').attr('name'));
          console.log($('#42days').attr('name'));



        if(
          $('#21days').attr('name') == '' ||
          $('#21days').attr('name') == 'townhouse' || 
          $('#21days').attr('name') == 'unit' ||
          $('#21days').attr('name') == 'section' || 
          $('#21days').attr('name') == 'lifestyleDwelling'){
          alert('Please make a selection');
          }
          
          else if(
          $('#28days').attr('name') == '' || 
          $('#28days').attr('name') == 'townhouse' ||
          $('#28days').attr('name') == 'unit' ||
          $('#28days').attr('name') == 'section' || 
          $('#28days').attr('name') == 'lifestyleDwelling')
          {
            alert('Please make a selection');}

          else if(
          $('#35days').attr('name') == '' || 
          $('#35days').attr('name') == 'townhouse' ||
          $('#35days').attr('name') == 'unit' ||
          $('#35days').attr('name') == 'section' || 
          $('#35days').attr('name') == 'lifestyleDwelling'){
            alert('Please make a selection');}

          else if(
          $('#42days').attr('name') == '' || 
          $('#42days').attr('name') == 'townhouse'||
          $('#42days').attr('name') == 'unit' ||
          $('#42days').attr('name') == 'section' || 
          $('#42days').attr('name') == 'lifestyleDwelling'){
            alert('Please make a selection');}

          else if(
          $('#56days').attr('name') == '' || 
          $('#56days').attr('name') == 'townhouse' ||
          $('#56days').attr('name') == 'unit' ||
          $('#56days').attr('name') == 'section' || 
          $('#56days').attr('name') == 'lifestyleDwelling')

        {
          alert('Please make a selection');
        }
        else{
          console.log($('#21days').attr('name'));
          console.log($('#28days').attr('name'));
          console.log($('#35days').attr('name'));
          console.log($('#42days').attr('name'));
          console.log($('#42days').attr('name'));

        var nob = $("li[class^=tab-link]");
        var tab_id = nob[3];

        var Addressarray = $(nob[0]);
        var houseTarray = $(nob[1]);
        var SaleTarray = $(nob[2]);
        var SaleDarray = $(nob[3]);



        var nobcontent = $(tab_id).attr("data-tab");


        $('ul.tabs li').removeClass('current');
        $('.tab-content').removeClass('current');


        SaleDarray.addClass('current');
        $("#"+$(tab_id).attr("data-tab")).addClass('current');
      }
  }
  })

  $("#saleT").click(function (){
    if ($('#locality').attr('name')==null) {
  alert('Please enter address');

}
else{
        console.log($('#auction').attr('name'))
        console.log($('#tender').attr('name'))
        console.log($('#negotiation').attr('name'))
        console.log($('#enquiriesOver').attr('name'))
        console.log($('#tenderClosing').attr('name'))
        console.log($('#deadlineSale').attr('name'))
        console.log($('#auction').attr('name'))
        console.log($('#auction').attr('name'))

        if($('#auction').attr('name') == '' && 
          $('#tender').attr('name') == '' &&
          $('#negotiation').attr('name') == '' &&
          $('#enquiriesOver').attr('name') == '' &&
          $('#tenderClosing').attr('name') == '' &&
          $('#deadlineSale').attr('name') == '')
        {
          alert('Please make a selection');
        }
        else{

        

        var nob = $("li[class^=tab-link]");
        var tab_id = nob[2];

        var Addressarray = $(nob[0]);
        var houseTarray = $(nob[1]);
        var SaleTarray = $(nob[2]);
        var SaleDarray = $(nob[3]);



        var nobcontent = $(tab_id).attr("data-tab");


        $('ul.tabs li').removeClass('current');
        $('.tab-content').removeClass('current');


        SaleTarray.addClass('current');
        $("#"+$(tab_id).attr("data-tab")).addClass('current');
}
}
      
  })

  $("#houseT").click(function(){
        
if ($('#locality').attr('name')==null) {
  alert('Please enter address');

}
else{
        var nob = $("li[class^=tab-link]");
        var tab_id = nob[1];

        var Addressarray = $(nob[0]);
        var houseTarray = $(nob[1]);
        var SaleTarray = $(nob[2]);
        var SaleDarray = $(nob[3]);



        var nobcontent = $(tab_id).attr("data-tab");


        $('ul.tabs li').removeClass('current');
        $('.tab-content').removeClass('current');


        houseTarray.addClass('current');
        $("#"+$(tab_id).attr("data-tab")).addClass('current');

    }
  })

  $("#address").click(function(){
        

        

        var nob = $("li[class^=tab-link]");
        var tab_id = nob[0];

        var Addressarray = $(nob[0]);
        var houseTarray = $(nob[1]);
        var SaleTarray = $(nob[2]);
        var SaleDarray = $(nob[3]);



        var nobcontent = $(tab_id).attr("data-tab");


        $('ul.tabs li').removeClass('current');
        $('.tab-content').removeClass('current');


        Addressarray.addClass('current');
        $("#"+$(tab_id).attr("data-tab")).addClass('current');

    
  })

  
})



$(document).ready(function(){



  $('.nextButton').click(function(){


if ($('#locality').attr('name')==null) {
  alert('Please enter address');

}
else{
     if($('.field').innerhtml == '')
        {
          alert('Please make a selection');
        }
        else{


    var i = 0;i++;
    var nob = $("li[class^=tab-link]");
    var tab_id = nob[i];
    var nobcontent = $(tab_id).attr("data-tab");
    console.log(nobcontent);
    console.log(i);
    
    
  //  console.log(nob[0]);
    
    
    

    $('ul.tabs li').removeClass('current');
    $('.tab-content').removeClass('current');

    $(nob[i]).addClass('current');
    $("#"+nobcontent).addClass('current');
    //  console.log(tab_id);
  
  
  }
  }
  })
  


})





