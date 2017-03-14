var http = require("http");
var url = require('url');
var monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

function getNatural(time) {
  return monthNames[time.getMonth()] + " " + time.getUTCDate() + "," + time.getUTCFullYear();
}

var server = http.createServer(function(req, res) {
  // request handling logic...
  console.log("creating server...");
  var parsedURL = url.parse(req.url, true);
  console.log("pURL=" + JSON.stringify(parsedURL));
  var path = (parsedURL.path).substr(1); 
  console.log("path=" + path);
  
  var retObj = { "unix": null, "natural": null };
  
  if (path !== "") {
    if (isNaN(path)) { // if NaN, then try human readable date.
      var time = new Date(decodeURI(path));
      console.log("time=" + time.getTime());
      if (!isNaN(time.getTime())) {   
        retObj.natural = decodeURI(path);
        retObj.unix = time.getTime();
      }
    }
    else { // is a number, so try unix timestamp
      var time = new Date(path*1000);  // times 1000 for unix timestamp
      console.log("time=" + time);
      if (!isNaN(time.getTime())) {
        retObj.unix = time.getTime();
        retObj.natural = getNatural(time);
      }
    }
  }
    
  var result = true;
  if (result) {
    res.writeHead(200, {
      'Content-Type': 'application/json'
    });
    res.end(JSON.stringify(retObj));
    
  } 
})
server.listen(8080);