$('#changepassword123').submit((e) => {
    e.preventDefault()
    console.log('jasdiog11111111bsafdsfsdsf');
    $.ajax({
        url: '/changePassword',
        data: $('#changepassword123').serialize(),
        type: 'post',
        success: (response) => {
            if (response.status) {
                swal("password changed").then(() => {
                    location.reload()
                })
            } else {
                swal("incorrect password!!");
            }
        }
    })
})