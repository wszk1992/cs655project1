var request = require('request');
var cheerio = require('cheerio');
var URL = require('url-parse');
var express = require('express');
var ejs = require('ejs');
var engines = require('consolidate');
var app = express();
const PORT=8080; 

var pageToVisit = "https://www.amazon.com/s/field-keywords=tv";
var urlList = [];

app.engine('html', ejs.renderFile);
app.set('view engine', 'ejs');
app.set('views', __dirname);
app.use(express.static(__dirname));

app.get('/', function(req, res){
    res.render('index.html');
});

app.get('/rendering', function(req, res){
  urlList = [];
  console.log("Visiting page " + pageToVisit);
  request(pageToVisit, function(error, response, body) {
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
        var links = $(result).children()[0].children[0].children[0].children[1].getElementsByTagName("a");
        for(var j = 0; j < links.length; j++) {
          if(links[j].hasAttribute("title")) {
            urlList.push(links[j].href);
            break;
          }
        }
        //urlList.push($(result).children()[0].children[0].children[0].children[1].children[1].children[0].attribs.href);
      }
    }
  });
  res.render('rendering.html', {urlList:urlList});
});

app.get('/semanticsOnly', function(req, res){
  urlList = [];
  console.log("Visiting page " + pageToVisit);
  request(pageToVisit, function(error, response, body) {
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
        var link = $(result).children()[0].children[0].children[0].children[1].children[1].children[0].attribs.href;
        //Sconsole.log(link);
        // for(var j = 0; j < links.length; j++) {
        //   if(links[j].hasAttribute("title")) {
        //     urlList.push(links[j].href);
        //     break;
        //   }
        // }
        urlList.push(link);
      }
      console.log(urlList);
      res.render('semanticsOnly.html', {urlList:JSON.stringify(urlList)});
    }
  });
  //console.log(JSON.stringify(urlList));
  
});





app.listen(PORT, function () {
  console.log('Example app listening on port 8080!');
});
