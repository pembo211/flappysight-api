'use strict';

var config = require('../../config/config');

// Set the initial vars
var timestamp = +new Date(),
    delay = config.currencyRefresh * 60000,
    bitstampRate = 0;

exports.index = function(req, res) {

  var _xhr = function() {
    if (typeof XMLHttpRequest !== 'undefined' && XMLHttpRequest !== null) {
      return new XMLHttpRequest();
    } else if (typeof require !== 'undefined' && require !== null) {
      var XMLhttprequest = require('xmlhttprequest').XMLHttpRequest;
      return new XMLhttprequest();
    }
  };

  var _request = function(url, cb) {
    var request;
    request = _xhr();
    request.open('GET', url, true);
    request.onreadystatechange = function() {
      if (request.readyState === 4) {
        if (request.status === 200) {
          return cb(false, request.responseText);
        }

        return cb(true, {
          status: request.status,
          message: 'Request error'
        });
      }
    };

    return request.send(null);
  };

  // Init
  var p = '';
  var currentTime = +new Date();
  if (bitstampRate === 0 || currentTime >= (timestamp + delay)) {
    timestamp = currentTime;

    _request('https://api.coinmarketcap.com/v1/ticker/flappycoin/?convert=USD', function(err, data) {
      if (!err) p = data.replace('[', '').replace(']', '');
      bitstampRate = parseFloat(JSON.parse(p).price_usd);

      res.jsonp({
        status: 200,
        data: { usd: bitstampRate }
      });
    });
  } else {
    res.jsonp({
      status: 200,
      data: { usd: bitstampRate }
    });
  }
};
