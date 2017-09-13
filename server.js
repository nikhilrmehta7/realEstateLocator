var express = require('express');
var bodyParser = require('body-parser');
var path = require('path')
var request = require('request');
require('dotenv').config()


var app = express();

app.use(bodyParser.json());

app.use(express.static(__dirname + '/client/dist'));

app.get('/location1/:addr1lat/:addr1lon', function(req,res) {
    console.log(req.params.addr1lat, req.params.addr1lon)
    request.get(
        'https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=' + req.params.addr1lat + ',' + req.params.addr1lon + '&radius=16100&type=real_estate_agency&key=' + process.env.GOOGLE_MAP_API,
        function (error, response, body) {
            if(error) {
                console.log(error)
            } else {
                console.log('statuscode', response.statusCode)
                res.send(JSON.parse(body).results)
            }
        }
    );
})

app.get('/location2/:addr2lat/:addr2lon', function(req,res) {
    console.log(req.params.addr2lat, req.params.addr2lon)
    request.get(
        'https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=' + req.params.addr2lat + ',' + req.params.addr2lon + '&radius=16100&type=real_estate_agency&key=' + process.env.GOOGLE_MAP_API,
        function (error, response, body) {
            if(error) {
                console.log(error)
            } else {
                console.log('statuscode', response.statusCode)
                res.send(JSON.parse(body).results)
            }
        }
    );
})


app.listen(3000, function(){
    console.log('listening on port 3000')
});
