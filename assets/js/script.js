var cryptoCurrencies = [];
var cryptoNames = [];


function getCryptoCurrencies () {
    
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

getCryptoCurrencies();