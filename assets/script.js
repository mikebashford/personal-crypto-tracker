var getCryptoCurrencies = function() {
    
    var apiUrl = "https://api.kucoin.com/api/v2/currencies";
  
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
}