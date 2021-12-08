var cryptoCurrencies = [];
var cryptoNames = [];
var cryptoName = "";
var check = false;
var executed = false;

function getCryptoCurrencies () {
  
  if (!executed){
  executed = true;
  var apiUrl = "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd";

  console.log(apiUrl);
  // make a get request to url
  fetch(apiUrl).then(function(response) {
    // request was successful
    
    if (response.ok) {
      response.json().then(function(data) {
        cryptoCurrencies = data; 
        console.log(cryptoCurrencies);
        cryptoListGeneration();    
      });
    } else {
      // if not successful
      console.log(response.status);
    }
  });
  }
};

var getCrytpoPrices = function() {

  var apiUrl = "https://api.kucoin.com/api/v1/prices";

  // make a get request to url
  fetch(apiUrl).then(function(response) {
    // request was successful
    if (response.ok) {
      response.json().then(function(data) {
        console.log(data);          
      });
    } else {
      // if not successful, redirect to homepage
      console.log("Error");
    }
  });
};

function cryptoListGeneration (){
  for (i=0; i<cryptoCurrencies.length; i++){
     cryptoNames.push(cryptoCurrencies[i].name);     
  }
  console.log(cryptoNames)
};

$( function() {
    $( "#crypto" ).autocomplete({
    source: cryptoNames
  });
} );

function displayCryptoInfo(i){
$("#crypto-values").append('<div id="crypto-display"><h3>'+cryptoName+'</h3></div>');

price = $('<div>'+ cryptoCurrencies[i].current_price+'USD</div>');
$("#crypto-values").append(price);
}

var formSubmitHandler = function(event) {
  // prevent page from refreshing
  event.preventDefault();
  
  // get value from input element
  cryptoName = $("input").first().val();

  if (cryptoName) {
    var check = false;
    for (i=0; i<cryptoNames.length; i++){
      if (cryptoName === cryptoNames[i]){
        displayCryptoInfo(i);
        check = true;
      }
    }
    console.log (cryptoName, ' ', check); 
    
    // clear old content
    $("input").first().val('');
  } else {
    alert("Please enter a valid crypto");
  }
};

getCryptoCurrencies();

$("#crypto-input").submit(formSubmitHandler);