#!/usr/bin/env node

var fs = require('fs');
var program = require('commander');
var cheerio = require('cheerio');
var restler = require('restler');
var HTMLFILE_DEFAULT = 'index.html';
var CHECKSFILE_DEFAULT = 'checks.json';
var fromurl = "fromurl.html"
var assertFileExists = function(infile) {
 var instr = infile.toString();
 if (!fs.existsSync(instr)) {
  console.log("%s does not exist. Exiting.", instr);
  process.exit(1);
 }
 return instr;
};

var checkUrl = function(url, checks) {
 if (url) {
  restler.get(url).on('complete',function(result) {
  if (result instanceof Error) {
     console.log("Error from %s. Exiting.", url);
     process.exit(1);
  } else {
  fs.writeFileSync(fromurl, result);
  var checkJson = checkHtmlFile(fromurl, program.checks);
  var outJson = JSON.stringify(checkJson, null, 4);
  console.log(outJson);
  fs.unlinkSnyc('./' + fromurl);
  }
  });
 }
 return outJson;
};


var cheerioHtmlFile = function(htmlfile) {
 return cheerio.load(fs.readFileSync(htmlfile));
};

var loadChecks = function(checksfile) {
 return JSON.parse(fs.readFileSync(checksfile));
};

var checkHtmlFile = function(htmlfile, checksfile) {
 $ = cheerioHtmlFile(htmlfile);
 var checks = loadChecks(checksfile).sort();
 var out = {};
 for (var ii in checks) {
  var present = $(checks[ii]).length > 0;
  out[checks[ii]]=present;
 }
 return out;
};

var clone = function(fn) {
 return fn.bind({});
};


if (require.main == module) {
 program
  .option('-c, --checks <check_file>','Path to checks.json',clone(assertFileExists), CHECKSFILE_DEFAULT)
 .option('-f, --file <html_file>', 'Path to index.html', clone(assertFileExists), HTMLFILE_DEFAULT)
  .option('-u, --url <url_link>','URL to html page')
 if(program.url) {
    var checkJson = checkUrl(program.url, program.checks);
 }
 else {
    var checkJson = checkHtmlFile(program.file, program.checks);
    var outJson = JSON.stringify(checkJson, null, 4);
    console.log(outJson);
 }
} else {
  exports.checkHtmlFile = checkHtmlFile;
}
