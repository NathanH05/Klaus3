var i = 1;

//Tab transition hides the current tab and displays the next tab 
//by incrementing 'i'
function TabTransition(id){

//This try catch grabs the name attribute of each menu option and
// passes out of the function so it is globally re-usable by other 
//functions. Its passed out with the name id. It tries to
//do it but if it fails or succeeds, eiher way the 'finally' code
//still executes   
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
    //increment i by 1

    i++;
    console.log(i);

    //select all the list rows with the tab-link class, which is all the 
    //headers of the box and assign it to 'nob'
    var nob = $("li[class^=tab-link]");
    //increment tab_id variable to move through each header grabbing each 
    //element and dropping the last e.g Address, House Type header etc.
    var tab_id = nob[i];
    //grab the data-tab attribute of the header under focus by the user
    var nobcontent = $(tab_id).attr("data-tab");
    
    console.log(tab_id);
    
  //  grab the inner html of the autocomplete google address input
  //and sets it to clear. Suspected redundant code.
    var nut=document.getElementById("autocomplete").innerhtml='';
    console.log(nut)
    document.getElementById("autocomplete").innerhtml='';

    //grabs all list items in an unordered list that has a class 
    //of current e.g this is all the headings only and removes all 
    //styling classes from all those headers
    $('ul.tabs li').removeClass('current');
    //It then grabs the content lists of all tabs. It removes the 
    //class that displays that list therefore hiding the content
    //. note only 1 class will have current applied but this selector
    //grabs all anyway, knowing it will grab the 'current' list 
    //and remove it in the process
    $('.tab-content').removeClass('current');

    //nob[i] is the new current header and so gets given the
    // 'current' class
    $(nob[i]).addClass('current');
    //this does the same as the last line so is redundant (suspected)
    $("#"+nobcontent).addClass('current');console.log(nobcontent);
    
  

    //if the user reaches the end of the list, having selected all
    //items required then do the following. Note this i
    if (i==4) {
      //prompt the user to enter in their email into a on screen
      //pop-up prompt
      
      
      //pop up a second box thank the user for registration
      alert('Thankyou someone from Klaus will get in touch soon');

      //Grab the address input textbox and clear the address originally
      // entered by the user
      var mess = $("[class^=autocomplete]");
      $("[class^=autocomplete]").blur();    
      
      //clear the address entered after 10 milliseconds? Unsure of this 
      //function
      setTimeout(function(){
      $("[class^=autocomplete]").val('')
      $("[class^=autocomplete]").focus();},10)

      //Reset i to 0
      i=0;
      
      //Grab the first header and display it as the current header tab
      $(nob[i]).addClass('current');
      
      //Grab the first header tab and assign to to tab_id
      var tab_id = nob[i];
      
      //Grab the header tabs data-tab attribute value
      var nobcontent = $(tab_id).attr("data-tab");

      //Select the header tab in focus and display it as the current header
      $("#"+nobcontent).addClass('current');
      
      };
  }
  }

  //Run this function that highlights a selected option when the page loads
$(document).ready(function (){


//Changing colour of user selected option
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


//Run this when the page loads
$(function(){
  $("#hi").click(function () {
  alert("Great, thanks for registering. We'll be in touch shortly")
})
  
// Get the modal table which holds the Registration form containing
//the name, email and phone attributes linked to our registration 
//table via the django view and form
var modal = document.getElementById('myModal');

// Select the button element that opens the modal
var button21 = document.getElementById("21days");
var button28 = document.getElementById("28days");
var button35 = document.getElementById("35days");
var button42 = document.getElementById("42days");
var button56 = document.getElementById("56days");

// Get the <span> element that closes the modal, eg the cross to close
//the popup form
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

//When the page loads do the following validation function
$(document).ready(function(){

  console.log($('#locality').attr('name'));

  //Select the SaleDuration header and run the function when clicked
  $("#saleD").click(function(){
    
    //If the address has not been entered display the alert so they 
    //enter address
    if ($('#locality').attr('name')==null) {
    alert('Please enter address');

    }

    //If the user does enter their address perform the following 
    else{
       console.log($('#21days').attr('name'));
          console.log($('#28days').attr('name'));
          console.log($('#35days').attr('name'));
          console.log($('#42days').attr('name'));
          console.log($('#42days').attr('name'));


        //If the users last selected variable is a house type option
        //they should not be able to proceed as the last option should be 
        //a sale type option as sale type was the previous menu
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
        
         //However if the user's last selected option is anything else or
        //isn't empty then do the following
        else{
          console.log($('#21days').attr('name'));
          console.log($('#28days').attr('name'));
          console.log($('#35days').attr('name'));
          console.log($('#42days').attr('name'));
          console.log($('#42days').attr('name'));

        //Select all the headers
        var nob = $("li[class^=tab-link]");
        //Select the last header, SaleDuration
        var tab_id = nob[3];
        //Select the Address header
        var Addressarray = $(nob[0]);
        //Select the House Type header
        var houseTarray = $(nob[1]);
        //Select the Sale Type header
        var SaleTarray = $(nob[2]);
        //Select the SaleDuration header
        var SaleDarray = $(nob[3]);


        //Select the data-tab attribute of the last header a.k.a 
        //SaleDuration header
        var nobcontent = $(tab_id).attr("data-tab");

        //Select all the headers and remove the class 'current' from any
        //header that has that class
        $('ul.tabs li').removeClass('current');
        //Select the content of all tabs and remove the class 'current'
        //from it too
        $('.tab-content').removeClass('current');


        //Add the Sale Duration header as the new current header
        //because at this stage the last selected option was a SaleType
        //option so its time for the last tab. Suspected redundance though
        SaleDarray.addClass('current');
        $("#"+$(tab_id).attr("data-tab")).addClass('current');
      }
  }
  })

  //Select the Sale Type header and if the name attribute is null do not
  //allow them to go any further
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

        //Select the  sale type name attribute and if all of the values
        //have not been selected a user hasn't made a selection so cannot
        //proceed
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

        //if a user did select a house type, remove the styling from the 
        //house type header and the house type content and add the 
        //sale type header and sale type content as current
        $('ul.tabs li').removeClass('current');
        $('.tab-content').removeClass('current');


        SaleTarray.addClass('current');
        $("#"+$(tab_id).attr("data-tab")).addClass('current');
}
}
      
  })


  $("#houseT").click(function(){
     //if house type header tab is clicked but our locality element has not
     //been given any value it means the user hasn't entered an address   
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

      //if a user has selected an address remove the Address tab style
      //and the address tab content and add the House type header and 
      //house type content as the new current tab 
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

      //if a user tries to click the address tab they should always
      //be able to view this tab so remove any currently selected
      //tab header and content and then display the address header
      //and tab content as the new current tab
        $('ul.tabs li').removeClass('current');
        $('.tab-content').removeClass('current');


        Addressarray.addClass('current');
        $("#"+$(tab_id).attr("data-tab")).addClass('current');

    
  })

  
})



$(document).ready(function(){



  $('.nextButton').click(function(){

//if a user hits the next button on the first tab but no address has been 
//entered yet then through an error so they do enter their address
if ($('#locality').attr('name')==null) {
  alert('Please enter address');

}
else{
  //a further if check occurs here to make double sure the user has entered
  //an address before proceeding
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
    
    
    
//if an address has been selected the 
    $('ul.tabs li').removeClass('current');
    $('.tab-content').removeClass('current');

    $(nob[1]).addClass('current');
    $("#"+nobcontent).addClass('current');
    //  console.log(tab_id);
  
  
  }
  }
  })
  


})





