const http = require("https");

const options = {
  "method": "POST",
  "hostname": "9c3e8103115452.au.deputy.com",
  "port": null,
  "path": "/api/v1/supervise/metric/multiple",
  "headers": {
    "Content-Length": "0",
    "Authorization": "Bearer b71b13fbb5200bb282841078d76f3a98"
  }
};

const req = http.request(options, function (res) {
  const chunks = [];

  res.on("data", function (chunk) {
    chunks.push(chunk);
  });

  res.on("end", function () {
    const body = Buffer.concat(chunks);
    const depData = JSON.parse(body.toString());
    console.log(depData)
  });
});

req.end();