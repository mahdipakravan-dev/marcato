websiteUrl = document.getElementById("websiteLogo").href

function Ajax(route , type , data , headers){
  return new Promise((resolve , reject) => {
    $.ajax({
      url: `${websiteUrl}${route}` ,
      type ,
      data ,
      headers ,
      dataType: 'json'
    }).done(function (result){
      resolve(result)
    }).fail(function( wtf , err ,status ){
      reject(wtf)
    });
  })
}

function getCookies() { 
  return document.cookie.split(';').reduce((cookies, cookie) => { 
    const [name, val] = cookie.split('=').map(c => c.trim()); 
    cookies[name] = val; 
    return cookies; 
  }, {}); 
} 

function setCookie(cname , cvalue , exdays=1){
  var d = new Date();
  d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
  var expires = "expires="+d.toUTCString();
  document.cookie = `${cname}=${cvalue};${expires};path=/`;
}

function alertSuccess(){
  $("#alertSuccess").css("display" , "block")
  const interval = setInterval(() => {
    $("#alertSuccess").css("display" , "none")
    clearInterval(interval)
  } , 4000)
}

function reloadCart(){
  $("#cartBody").empty()
  Ajax("rest/cart/get" , "GET" , {} , {token : getCookies().frontendToken})
  .then(user => {
    if(!user) return alert("Error")
    user.cart.forEach(cart => {
      $("#cartBody").append(`
      <tr>
        <td class="product-col">
            <div class="product">
                <figure class="product-media">
                    <a href="#">
                        <img src="${cart.thumbnail}"
                            alt="${cart.fullName}">
                    </a>
                </figure>

                <h3 class="product-title">
                    <a href="/product/${cart.id}">${cart.fullName }</a>
                </h3><!-- End .product-title -->
            </div><!-- End .product -->
        </td>
        <td class="price-col">${cart.price }</td>
        <td class="quantity-col">
            <div class="cart-product-quantity">
                <input type="number" class="form-control" value="${cart.qty }" min="1" max="10"
                    step="1" data-decimals="0" required>
            </div><!-- End .cart-product-quantity -->
        </td>
        <td class="total-col">
            ${cart.price * cart.qty}
        </td>
        <td class="remove-col">
            <button class="btn-remove" onclick="
                deleteCart('${cart.id }')
            "><i class="icon-close"></i></button></td>
    </tr>`)   
    })

    $("#cartPrice").html(`${user.cartPrice} تومان`)
  })
  .catch(err => {console.log(err.status)})
}

function addToCart(productId , userId , qty){
  const cookies = getCookies()
  if(!cookies.frontendToken) {
    $('#loginRequired').modal('show')
  }
  else{
    Ajax("rest/cart/add" , "POST" , {productId , userId , qty} , {token : cookies.frontendToken})
    .then(result => {console.log(result)})
    .catch(err => {
      if(err.status === 409 ) {$('#alerdyInBasket').modal('show')}
      if(err.status === 200 ) {alertSuccess()}
    })
  }
}

function deleteCart(productId) {
  Ajax("rest/cart/delete" , "DELETE" , {productId } , {token : getCookies().frontendToken})
  .then(result => {reloadCart(); console.log(result)})
  .catch(err => {
    if(err.status === 200 ) {reloadCart()}
    else {alert("هنگام ارسال اطلاعات به سرور مشکلی پیش آمده لطفا مجددا تلاش نمایید")}
  })
}
