$(document).scroll(function(){
    var scroll_val = $(document).scrollTop(); 
    if(scroll_val > 0){
        $('.main_header ').addClass('d_sticky'); 
    }else{
        $('.main_header ').removeClass('d_sticky');
    }
})

$(document).ready(function(){
    $('.main_header .toggle_box button').click(function(){      
        $('.main_header .header_inner .main_nav').slideToggle(); 
    })
    
    $('.numeric_only').on('input',function(){
        var inp_val = $(this).val(); 
         var patt = /[^0-9]/g;
        $(this).val(inp_val.replace(patt, ""));

    }); 
  function required_valid(inp,filed_name ){
    inp.siblings('.err_msg').remove();
      if(inp.val() == ""){
        inp.parent().append("<p class='err_msg'>"+filed_name+" is required."); 
          return false; 
      }
      return true; 
  }
  function email_valid(inp){
    inp.siblings('.err_msg').remove();
    var email_val = inp.val();
    var atpos = email_val.indexOf("@");
    var dotpos = email_val.lastIndexOf(".");
        if (atpos<1 || dotpos<atpos+2 || dotpos+2>=email_val.length) {
            inp.parent().append("<p class='err_msg'> Invalid email." ); 
            return false;
        }
    return true; 
  }


  function validation(inp_arr){
      var valid = true;
      
    for(let obj of inp_arr){
        var ele= obj.ele; 
        var filed_name = obj.filed_name;
        valid = required_valid(ele, filed_name)

        if(obj.email && valid ){
            valid = email_valid(ele); 
        }
    }
     

      return valid; 
  }

  
  $('#contact_form').submit(function(e){

    validation([
        {
            ele:$('.name'), 
            filed_name:'Name'
        }
        , 
        {
            ele:$('.email'), 
            filed_name:'Email',
            email:true
        }
        , 
        {
            ele:$('.phone'), 
            filed_name:'Phone number'
        }
        , 
        {
            ele:$('.message'), 
            filed_name:'Message'
        }
    ]  ); 
 
    

})


}); 
