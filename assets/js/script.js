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
var formatter = new Intl.NumberFormat('en-us', {
  style: 'currency',
  currency: 'USD',});
var DisplayPrice = formatter.format(cryptoCurrencies[i].current_price);
cryptoDisplay = $('<section id="crypto-display'+i+'" class="post"></section>');
cryptoDisplay.append('<header class="post-header"><h2>'+cryptoName+'</h2><h2 id="displayValue'+i+'">'+ DisplayPrice + '</h2></header>');

coinNoInput = $('<form id="coin-number'+i+'" class="pure-form"></form>');
coinNofield = $('<fieldset></fieldset>');
coinNofield.append('<input id="coins'+i+'" type="text" placeholder="Amount of Coins" />');
coinNofield.append('<select id="currency" name="currency"><option value="USD">USD</option><option value="EUR">EUR</option></select>');
coinNofield.append('<button type="submit" class="pure-button pure-button-secondary">Submit</button>');
coinNofield.append('<span id="clear'+i+'"><button type="click" class="pure-button pure-button-primary">Clear</button></span>')
coinNoInput.append(coinNofield);
cryptoDisplay.append(coinNoInput);
$("#crypto-values").append(cryptoDisplay);
var formCheck = "#coin-number"+i;
var clearCheck = "#clear"+i;
$(formCheck).submit(function(event){
  event.preventDefault();
  let coins = "#coins"+i;
  let input = $(coins).val();
  console.log(input, formCheck, clearCheck);
  let stringConvert = parseFloat(input);
  let value = cryptoCurrencies[i].current_price * stringConvert;
  let setValue = formatter.format(value);
  let displayValue = "displayValue"+i;
  document.getElementById(displayValue).innerText = setValue;
});
$(clearCheck).click(function(event){
  event.preventDefault();
  let clearBlock = "#crypto-display"+i;
  console.log("cleared");
  $(clearBlock).remove();
});
}

var formSubmitHandler = function(event) {
  // prevent page from refreshing
  event.preventDefault();
  
  // get value from input element
  cryptoName = $("input").first().val();

  var check = false;
    for (i=0; i<cryptoNames.length; i++){
      if (cryptoName === cryptoNames[i]){
        displayCryptoInfo(i);
        check = true;
      }
    } 
    if (check === false) {
      alert("Please enter a valid crypto");
    }
    console.log (cryptoName, ' ', check); 
    
    // clear old content
    $("input").first().val('');  
};

getCryptoCurrencies();

$("#crypto-input").submit(formSubmitHandler);