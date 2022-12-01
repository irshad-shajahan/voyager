
function error(id,message){
    document.getElementById(id).innerHTML=message
}

function passwordvalidate(){
var pass=document.getElementById('pass').value
var regexWhiteSpace=/^\S*$/
var regexUpperCase= /^(?=.*[A-Z]).*$/
var regexLowerCase=/^(?=.*[a-z]).*$/
var regexNumber = /^(?=.*[0-9]).*$/;
var regexSymbol =/^(?=.*[~`!@#$%^&*()--+={}\[\]|\\:;"'<>,.?/_₹]).*$/;
var regexLength = /^.{7,16}$/;
if(pass==""){
    error('error1','Password not entered')
}else if(!regexWhiteSpace.test(pass)){
   error('error1',"Password must not contain Whitespaces.")
}else if(!regexUpperCase.test(pass)){
   error('error1','Password must have at least one Uppercase Character.')
}else if(!regexLowerCase.test(pass)){
    error('error1',"Password must have at least one Lowercase Character.")
}else if(!regexNumber.test(pass)){
   error('error1','Password must contain at least one Digit.')
}else if(!regexSymbol.test(pass)){
    error('error1','Password must contain at least one Special Symbol.')
}else if(!regexLength.test(pass)){
    error('error1','Password must be 7-16 Characters Long.')
}else{
    error('error1','')
    return true
}

}

function validateRepass(){
    var pass=document.getElementById('pass').value
    var repass=document.getElementById('repass').value
   if(repass==''){
    error('error2','re-password not entered')
    return false
   }else if(pass!=repass){
    error('error2',"Password doesn't match")
    return false
   }else{
    error('error2',"")
    return true
   }
}




function validate(){   
var pass=document.getElementById('pass').value
var repass=document.getElementById('repass').value
 if(passwordvalidate()==validateRepass()){
   return true
 }else{
   return false
 }
}