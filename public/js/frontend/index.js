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

function addToCart(productId , userId , qty){
  const cookies = getCookies()
  if(!cookies.frontendToken) {
    $('#loginRequired').modal('show')
  }
  else{
    Ajax("rest/cart/add" , "POST" , {productId , userId , qty} , {token : cookies.frontendToken})
    .then(result => {alertSuccess()})
    .catch(err => {
      if(err.status === 409 ) {$('#alerdyInBasket').modal('show')}
      if(err.status === 200 ) {alertSuccess()}
    })
  }
}

