function addToCart(proId){
    $.ajax({
        url:'/addtocart/'+proId, 
        method:'get',
        success:(response)=>{
            if(response.status){
                swal({
                    title: "Added",
                    text: "Item added to cart",
                    icon: "success",
                    button: "ok",
                  }).then(()=>{
                    window.location.reload();
                  })
                let count=$('#cart-count').html()
                count=parseInt(count)+1
                $('#cart-count').html(count)
            }
        }
    })
}

function addToWishlist(proId){
    $.ajax({
        url:'/addtowishlist/'+proId,
        method:'get',
        success:(response)=>{
            if(response.status){
                swal({
                    title: "Added",
                    text: "Item added to wishlist",
                    icon: "success",
                    button: "ok",
                  }).then(()=>{
                    window.location.reload();
                  })
                
            }
        }
    })
}


