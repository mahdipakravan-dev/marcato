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

function productAlerts(type , data){
  switch(type){
    case "login":
      showModal("میشه قبلش وارد وبسایت بشین ؟" , 
      `
      لطفا قبل از اینکه ثبت سفارش کنید وارد وبسایت شوید یا ثبت نام کنید , بعدش به همین صفحه برمیگردیم
      <br>
      <br>
      <a href="/user/login?back=/product/${data.productId}" class="btn btn-primary">بریم ثبت نام کنیم</a>
      `,
      10000 ,
      false);
      break
    case "already" :
      showModal("" 
      , `
        این محصول در سبدخرید شما موجود میباشد
        <br/>
        <br/>
        <a href="/cart" class="btn btn-primary">اوکی پس بریم به سبد خرید</a>
      ` ,
       5000 
       , true)
      break
    case "success" :
      showModal("" 
      , `
        <div class="alert alert-success">با موفقیت به سبد خرید شما اضافه شد</div>
      ` ,
       5000 
       , true)
      break
    case "error" :
      showModal("" 
      , `
        <div class="alert alert-danger">ظاهرا مشکلی پیش آمده , لطفا مجددا تلاش کنید</div>
      ` ,
        5000 
        , true)
      break
  }
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

function decimaller(number){return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") }

function reloadCart(){
  return location.reload()
  /**
   * Below Will Implement in next Future
   */
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
        <td class="price-col">${decimaller(cart.price)}</td>
        <td class="quantity-col">
            <div class="cart-product-quantity">
                <input data-productid="${cart.id}" type="number" class="form-control" value="${cart.qty }" min="1" max="10"
                    step="1" data-decimals="0" required>
            </div><!-- End .cart-product-quantity -->
        </td>
        <td class="total-col">
            ${decimaller(cart.price * cart.qty)}
        </td>
        <td class="remove-col">
            <button class="btn-remove" onclick="
                deleteCart('${cart.id }')
            "><i class="icon-close"></i></button></td>
    </tr>`)   

    })

    $("#cartPrice").html(`${decimaller(user.cartPrice)} تومان`)
    
  })
  .catch(err => {console.log(err.status)})
}

function addToCart(productId , userId , qty){
  const cookies = getCookies()
  if(!cookies.frontendToken) return productAlerts("login" , {productId})
  Ajax("rest/cart/add" , "POST" , {productId , userId , qty} , {token : cookies.frontendToken})
  .then(() => productAlerts("success"))
  .catch(err => {
    if(err.status === 409 ) return productAlerts("already")
    if(err.status === 200 ) return productAlerts("success")
  })
}

function deleteCart(productId) {
  Ajax("rest/cart/delete" , "DELETE" , {productId } , {token : getCookies().frontendToken})
  .then(result => {reloadCart();})
  .catch(err => {
    if(err.status === 200 ) return reloadCart()
    productAlerts("error")
  })
}


function useDiscount() {
  const discountCode = $("#discountCode").val()
  Ajax("rest/cart/discount" , "POST" , {discountCode } , {token : getCookies().frontendToken})
  .then(result => {
    reloadCart();
  })
  .catch(err => {
    if(err.status == 404) productAlerts("error")
    if(err.status === 200 ) {
      showModal("تبریک میگم" 
      , `<div class="alert alert-success">کد تخفیف شما صحیح است</div>` , 3000)
      reloadCart()}
  })
}

function disableDiscount() {
  const discountCode = $("#discountCode").val()
  Ajax("rest/cart/discount" , "DELETE" , {discountCode } , {token : getCookies().frontendToken})
  .then(result => {
    reloadCart();
  })
  .catch(err => {
    if(err.status === 200 ) return reloadCart()
    productAlerts("error")
  })
}

$("input[type='number']").change(function(){
  const productId = $(this).data().productid
  Ajax("rest/cart/update" , "PUT" , {productId , qty : parseInt(this.value)} , {token : getCookies().frontendToken} )
  .then(() => {reloadCart()})
  .catch(err => {
    if(err.status !== 200) return productAlerts("error")
    reloadCart();
  })
})

function link(location){
  window.location.href = `${websiteUrl}${location}`
}

function showModal(title , text , time = 2000 , btn = true){
  $("#customModalTitle").html(title)
  $("#customModalText").html(text)

  if(title=="") $("#customModalHeader").css("display" , "none")
  if(!btn) $("#customModalBtn").css("display" , "none")

  $("#customModal").modal()
  const interval = setInterval(() => {
    $("#customModalBtn").click()
    clearInterval(interval)
  } , time)
}