function remove(proId){
  alert(proId)
  $.ajax({
      url:'/removeWish',
      method:post,
      data:{
        proId:proId
      },
      success:(response)=>{
          alert('success')
      }
  })

}