var cryptoCurrencies = [];
var cryptoNames = [];
var cryptoName = "";
var savedCrypto = [];
var exchRate = [];
var rate = "";
var check = false;
var executed = false;

function getCryptoCurrencies () {
  
  if (!executed){  // will only update prices when page is refreshed
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
        loadCryptoLocally();   
        exchangeRates();
      });
    } else {
      // if not successful
      console.log(response.status);
    }
  });

  }
};
// api call for current exchange rates
function exchangeRates () {

  var apiUrl = "https://api.exchangerate.host/latest";
  // make a get request to url
  fetch(apiUrl).then(function (response) {
    // request was successful
    if (response.ok) {
      response.json().then(function(data) {
        exchRate.push(data.rates); 
        console.log(exchRate);          
      });
    } else {
      // if not successful, redirect to homepage
      console.log("Error");
    }
  });
};

// creates a list of available crypto coins
function cryptoListGeneration() {
  for (i = 0; i < cryptoCurrencies.length; i++) {
    cryptoNames.push(cryptoCurrencies[i].name);
  }
  console.log(cryptoNames)
};

// provides user a drop down of available crypto based on text entered
$(function () {
  $("#crypto").autocomplete({
    source: cryptoNames
  });
});

// displays the per coin price in USD for the crypto selected
function displayCryptoInfo(i){
// formats the price or value in USD
var formatter = new Intl.NumberFormat('en-us', {
  style: 'currency',
  currency: 'USD',});
var setValue = 0;
rate = 1;
var DisplayPrice = formatter.format(cryptoCurrencies[i].current_price); //pulls price from stored crypto values
var displayValue = "";
// adds the section for crypto selected.  Each section is uniquely identified by their location in the cryptoData array
cryptoDisplay = $('<section id="crypto-display'+i+'" class="post"></section>');
cryptoDisplay.append('<header class="post-header"><h2>'+cryptoName+'</h2><h2 id="displayValue'+i+'">'+ DisplayPrice + '</h2></header>');

coinNoInput = $('<form id="coin-number'+i+'" class="pure-form"></form>');
coinNofield = $('<fieldset></fieldset>');
coinNofield.append('<input id="coins'+i+'" type="text" placeholder="Amount of Coins" />');
coinNofield.append('<select id="currency'+i+'" name="currency">\
<option value="USD">USD</option><option value="EUR">EUR</option> \
<option value="GBP">GBP</option><option value="CNY">CNY</option> \
<option value="JPY">JPY</option><option value="KRW">KRW</option></select>');
coinNofield.append('<button type="submit" class="pure-button button-secondary">Submit</button>');
coinNofield.append('<span id="clear'+i+'"><button type="click" class="pure-button pure-button-primary button-clear">Clear</button></span>')
coinNoInput.append(coinNofield);
cryptoDisplay.append(coinNoInput);
//create our widget for each crypto
var widget = createTechAnalysisWidget(cryptoName);
//append to the div with it's siblings information
cryptoDisplay.append(widget);
// listens for the user to input the number of coins they own
$("#crypto-values").append(cryptoDisplay);
var formCheck = "#coin-number"+i;
var clearCheck = "#clear"+i;
var changeCurrency = "#currency"+i;
var coins = "#coins"+i;
var value = 0;
var stringConvert = 0;
// listens for user to input coins and updates displayed value based on number of coins inputted
$(formCheck).submit(function(event){
  event.preventDefault();  
  let input = $(coins).val(); // pulls text value from user input
  console.log(input, formCheck, clearCheck);
  stringConvert = parseFloat(input); // converts text to decimal value
  value = cryptoCurrencies[i].current_price * stringConvert * rate; // multiples coin price times coins owned
  setValue = formatter.format(value); //formats value as currency
  displayValue = "displayValue"+i;
  document.getElementById(displayValue).innerText = setValue; //replaces displayPrice with new setValue
});
// listens for user to click clear button and removes associated crypto section
$(clearCheck).click(function(event){
  event.preventDefault();
  let clearBlock = "#crypto-display"+i;
  console.log("cleared");
  $(clearBlock).remove();
  deleteCryptoLocally(cryptoCurrencies[i].name);
});
// listens for changes to currency drop down list and updates displayed value using exchange rate
$(changeCurrency).change(function(event){
  event.preventDefault();
  let currencySelected = "#currency"+i+" option:selected";
  let exchange = $(currencySelected).text();
  console.log(exchange);

  switch (exchange){
    case 'USD': rate = exchRate[0].USD;
      formatter = new Intl.NumberFormat('en-us', {
        style: 'currency',
        currency: 'USD',});
      break;
    case 'EUR': rate = exchRate[0].EUR;
      formatter = new Intl.NumberFormat('en-us', {
        style: 'currency',
        currency: 'EUR',});
      break;
    case 'GBP': rate = exchRate[0].GBP;
      formatter = new Intl.NumberFormat('en-us', {
        style: 'currency',
        currency: 'GBP',});
      break;  
    case 'CNY': rate = exchRate[0].CNY;
      formatter = new Intl.NumberFormat('en-us', {
        style: 'currency',
        currency: 'CNY',});
      break;  
    case 'JPY': rate = exchRate[0].JPY;
      formatter = new Intl.NumberFormat('en-us', {
        style: 'currency',
        currency: 'JPY',});
      break;  
    case 'KRW': rate = exchRate[0].KRW;
      formatter = new Intl.NumberFormat('en-us', {
        style: 'currency',
        currency: 'KRW',});
      break;  
  }
  rate = parseFloat(rate);
  // checks to see if there are coins provided or not
  if (stringConvert){
  setValue = formatter.format(cryptoCurrencies[i].current_price * stringConvert * rate);
  } else {
    displayValue = "displayValue"+i;
    setValue = formatter.format(cryptoCurrencies[i].current_price * rate);
    console.log(cryptoCurrencies[i].current_price, rate);
  }
  document.getElementById(displayValue).innerText = setValue; 
  console.log(value, rate, setValue);
})
}

// executes when user clicks the search button
var formSubmitHandler = function (event) {
  // prevent page from refreshing
  event.preventDefault();

  // get value from input element
  cryptoName = $("input").first().val();

  var check = false;

  // checks to see if crypto is already displayed and prevents displaying again
  for (a = 0; a < savedCrypto.length; a++) {
    if (cryptoName === savedCrypto[a]) {
      check = true;
    }
  }

  // checks inputted crypto name against available list
  if (check === false) {
    for (i = 0; i < cryptoNames.length; i++) {
      if (cryptoName === cryptoNames[i]) {
        displayCryptoInfo(i);  //returns i as unique identifier for each crypto based on location in data array
        saveCryptoLocally(i);
        check = true;  // changes check to true allowing function to proceed
      }
    }
  }
  // if there is not a match against the crypto list, the user will be asked to enter a different name
  if (check === false) {
    // modal is triggered
    var modal = document.getElementById("myModal");
    var span = document.getElementsByClassName("close")[0];
    modal.style.display = "block";
    //when the user clicks on <span> (X), close the modal
    span.onclick = function () {
      modal.style.display = "none";
    }
    //when the user clicks anywehre outside of the modal, close it
    window.onclick = function (event) {
      if (event.target === modal) {
        modal.style.display = "none";
      }
    }
    //alert("Please enter a valid crypto");
  }
  console.log(cryptoName, ' ', check);

  // clear old content
  $("input").first().val('');
};
// saves crypto name to local storage
function saveCryptoLocally(i) {
  savedCrypto.push(cryptoNames[i]);
  localStorage.setItem('SavedCrypto', JSON.stringify(savedCrypto));
}

// deletes crypto from local storage when cleared from page
function deleteCryptoLocally(name) {
  for (a = 0; a < savedCrypto.length; a++) {
    if (name === savedCrypto[a]) {
      savedCrypto.splice($.inArray(name, savedCrypto), 1);
      console.log(savedCrypto);
      localStorage.setItem('SavedCrypto', JSON.stringify(savedCrypto));
    }
  }
}

//loads the locally saved cryptos
function loadCryptoLocally() {
  savedCrypto = JSON.parse(localStorage.getItem("SavedCrypto"));
  if (savedCrypto != null) {
    for (b = 0; b < savedCrypto.length; b++) {
      cryptoName = savedCrypto[b];
      for (i = 0; i < cryptoNames.length; i++) {
        if (cryptoName === cryptoNames[i]) {
          displayCryptoInfo(i);
        }
      }
    }
  } else {
    savedCrypto = [];
  }
}

function createTechAnalysisWidget(cryptoName)
{
  //grab the crypto passed in to get the symbol
  var getSymbol = cryptoName;
  //create our widget elements
  var containerEl = document.createElement('div');
  var containerEl1 = document.createElement('div');
  var containerEl2 = document.createElement('div');
  var hrefEl = document.createElement('a');
  var scriptEl = document.createElement('script');

  //add classes and attributes to our elements
  $(containerEl).addClass("tradingview-widget-container");
  $(containerEl).attr('id', 'tech');
  $(containerEl1).addClass("tradingview-widget-container__widget");
  $(containerEl2).addClass("tradingview-widget-copyright");
  $(scriptEl).attr('src', "https://s3.tradingview.com/external-embedding/embed-widget-technical-analysis.js");
  $(scriptEl).attr('type', 'text/javascript');
  $(hrefEl).attr('href', 'https://www.tradingview.com/symbols/BTCUSD/technicals/');
  $(hrefEl).attr('rel', 'noopener');
  $(hrefEl).attr('target', '_blank');
  //append the href to the correct container
  $(containerEl2).append(hrefEl);

  //convert our user input
  getSymbol = getSymbol.toLowerCase();

  //search through our database of cryptos by id
  var lookup = {};
  for (var i = 0; i < cryptoCurrencies.length; i++) {
      var currencies = (lookup[cryptoCurrencies[i].symbol] = cryptoCurrencies[i]);
      if(getSymbol === currencies.id)
      {
        //grab our cryptos ticker symbol
        getSymbol = currencies.symbol;
      }
  }

  //add the script to the widget with our symbol we grabbed
  $(scriptEl).text(JSON.stringify({  
    "interval": "5m",
    "width": "400",
    "isTransparent": false,
    "height": "425",
    "symbol": 'COINBASE:' + getSymbol.toUpperCase() + 'USD',
    "showIntervalTabs": true,
    "locale": "en",
    "colorTheme": "dark"
  }));

  //put the widget back together
  return $(containerEl).append(containerEl1, containerEl2, scriptEl);
}

function createTickerWidget()
{
  //create our widget elements 
  //TODO: redundant code from previous widget
  var containerEl = document.createElement('div');
  var containerEl1 = document.createElement('div');
  var containerEl2 = document.createElement('div');
  var hrefEl = document.createElement('a');
  var scriptEl = document.createElement('script');

  //add classes and attributes to our elements
  //TODO: redundant code from previous widget
  $(containerEl).addClass("tradingview-widget-container");
  $(containerEl1).addClass("tradingview-widget-container__widget");
  $(containerEl2).addClass("tradingview-widget-copyright");
  $(scriptEl).attr('src', "https://s3.tradingview.com/external-embedding/embed-widget-ticker-tape.js");
  $(scriptEl).attr('type', 'text/javascript');
  $(hrefEl).attr('href', 'https://www.tradingview.com');
  $(hrefEl).attr('rel', 'noopener');
  $(hrefEl).attr('target', '_blank');
  $(containerEl2).append(hrefEl);

  //Add our script to the widget with hard coded cryptos
  $(scriptEl).text(JSON.stringify(
    {
      "symbols": [
        {
            "proName": "BITSTAMP:BTCUSD",
            "title": "Bitcoin"
        },
        {
            "proName": "BITSTAMP:ETHUSD",
            "title": "Ethereum"
        },
        {
            "description": "Cardano",
            "proName": "BITFINEX:ADAUSD"
        },
        {
            "description": "XRP",
            "proName": "BITSTAMP:XRPUSD"
        },
        {
            "description": "Tether",
            "proName": "COINBASE:USDTUSD"
        },
        {
            "description": "Dogecoin",
            "proName": "BITFINEX:DOGEUSD"
        },
        {
            "description": "Polkadot",
            "proName": "BITFINEX:DOTUSD"
        },
        {
            "description": "USD Coin",
            "proName": "CURRENCYCOM:USDCUSD"
        },
        {
            "description": "Solana",
            "proName": "BINANCEUS:SOLUSD"
        },
        {
            "description": "Binance Coin",
            "proName": "BINANCE:BNBUSD"
        }
        ],
        "colorTheme": "dark",
        "isTransparent": false,
        "showSymbolLogo": true,
        "displayMode": "regular",
        "locale": "en"
    }
  ));

  //put the widget together
  $(containerEl).append(containerEl1, containerEl2, scriptEl);
  //prepend so this is at the top of the page
  return $('.ticker').prepend(containerEl);
}

function createChartWidget()
{
  JSON.stringify( new TradingView.widget(
    {
        
      "width": 900,
      "height": 450,
      "symbol": "COINBASE:BTCUSD",
      "interval": "D",
      "timezone": "Etc/UTC",
      "theme": "dark",
      "style": "1",
      "locale": "en",
      "toolbar_bg": "#f1f3f6",
      "enable_publishing": false,
      "allow_symbol_change": true,
      "container_id": "tradingview_176a8"
        
    }
  ));
}

createChartWidget(); //sets up the chart to the symbol value
createTickerWidget(); //creates the ticker widget with hardcoded cryptos
getCryptoCurrencies();  //executes creation of crypto name array

$("#crypto-input").submit(formSubmitHandler);  //listens for user to click search button
