function validcatname(){
    document.getElementById('catname').value = document.getElementById('catname').value.toUpperCase()
    
    catname=document.getElementById('catname').value
    
    if(catname.length==0){
        document.getElementById('catvalid').innerHTML="Please Fill The Field"
        return false
    } if(!catname.match(/^[A-Za-z]*$/)){
        document.getElementById('catvalid').innerHTML="Digits not allowed"
        return false
    }else{
        document.getElementById('catvalid').innerHTML=""
        
        return true
    }
}
function validatecatoffer(){
    catoffer=document.getElementById('catoffer').value
    if(catoffer.length==0){
        document.getElementById('catvalid').innerHTML=""
        return true
    }if(!catoffer.match(/^[0-9]*$/)){
        document.getElementById('offervalid').innerHTML="Enter in Percentage"
        return false
    }else{
        if(catoffer<=90&&catoffer>=0){
            document.getElementById('offervalid').innerHTML=""
            
            return true
        }else{
            document.getElementById('offervalid').innerHTML="Enter a Value between 1 and 90"
            return false
        }
    }
}
function validate(){
    validcatname();
    validatecatoffer();
    if(validcatname()&&validatecatoffer()){
        return true
    }else{
        return false
    }

}