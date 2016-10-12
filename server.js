var request = require('request');
var cheerio = require('cheerio');
var URL = require('url-parse');
var express = require('express');
var ejs = require('ejs');

var app = express();
const PORT=8080; 
var keywords = "keywords";
var sort = "sort";
var sortBy = {"price-asc": "price-asc-rank", "price-desc": "price-desc-rank", "rating": "review-rank", "relevance": "relevancerank"};
var pageToVisit = "https://www.amazon.com/s/";
var searchResult = 'tv';
var sortResult = "relevancerank";
var urlList = [];

app.engine('html', ejs.renderFile);
app.set('view engine', 'ejs');
app.set('views', __dirname);
app.use(express.static(__dirname));

app.get('/', function (req, res){
  if(req.query.search) {
    res.redirect('/list?search=' + req.query.search); 
  }else {
    res.render('./main.html');
  }
});

app.get('/compare', function (req, res) {
  var compares = req.query.compare.split("&");
  var compare1 = compares[0].split("|");
  var compare2 = compares[1].split("|");
  res.render("./compare.html",{compare1:JSON.stringify(compare1), compare2:JSON.stringify(compare2)})
});

app.get('/list', function (req, res){
  urlList = [];
  searchResult = 'tv';
  if(req.query.search) {
    console.log("search:" + req.query.search);
    searchResult = req.query.search;
  }
  if(req.query.sort) {
    console.log("sort:" + req.query.sort);
    sortResult = sortBy[req.query.sort];
  }
  var urlResult = pageToVisit + keywords + "=" + searchResult + "&" + sort + "=" + sortResult;
  console.log("Visiting page " + urlResult);
  request(urlResult, function(error, response, body) {
    if(error) {
      console.log("Error: " + error);
    }
    // Check status code (200 is HTTP OK)
    console.log("Status code: " + response.statusCode);
    if(response.statusCode === 200) {
      var $ = cheerio.load(body);
      console.log("Page title:  " + $('title').text());
      //console.log("product url list:");
      for(var i = 0; i < 5; i++) {

        var result = "#result_" + i;
        try {
          var link = $(result).children()[0].children[0].children[0].children[1].children[1].children[0].attribs.href;
          urlList.push(link);
        } catch(e) {
          continue;
        }
      }
      console.log(urlList);
      res.render('./list.html', {urlList:JSON.stringify(urlList)});
    }
  });
  //console.log(JSON.stringify(urlList));
  
});



var port = process.env.PORT || 8080;

var server = app.listen(port, function() {
  console.log("Express on port " + port);
});