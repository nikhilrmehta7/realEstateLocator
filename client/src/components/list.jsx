import React from 'react';
import ReactDOM from 'react-dom';
import MapContainer from './mapContainer.jsx'
import path from 'path';
import axios from 'axios';
import geolib from 'geolib';
var googleMapsClient = require('@google/maps').createClient({
    key: process.env.GOOGLE_MAP_API 
  });


class List extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            address1: '',
            address2: '',
            addr1coor: {},
            addr2coor: {},
            addr1list: [],
            addr2list: [],
            finalList: [],
            sentCoordinates: {}
        }

        this.submitAddress = this.submitAddress.bind(this);
        this.processAddress = this.processAddress.bind(this);
        this.loadMap = this.loadMap.bind(this);
    }

    //submits the address and returns a list of nearby real estate agencies to be processed by process address
    submitAddress() {
        //list declared is to make sure we are setting state on the correct object
        var list = this;
        googleMapsClient.geocode({
            address: this.state.address1
            }, function(err, response) {
            if (!err) {
                var lattitude1 = response.json.results[0].geometry.location.lat;
                var longitude1 = response.json.results[0].geometry.location.lng;
                axios.get('/location1/' + lattitude1 + '/' + longitude1)
                .then(function (response) {
                    list.setState({addr1list: response.data})
                    list.setState({addr1coor: {lat: lattitude1, lng: longitude1}})
                })
                .then(() => list.processAddress())
                .catch(function (error) {
                    console.log(error);
                });
            } else {
                console.log(err)
            }
        });
        googleMapsClient.geocode({
            address: this.state.address2
            }, function(err, response) {
            if (!err) {
                var lattitude2 = response.json.results[0].geometry.location.lat;
                var longitude2 = response.json.results[0].geometry.location.lng;
                axios.get('/location2/' + lattitude2 + '/' + longitude2)
                .then(function (response) {
                    list.setState({addr2list: response.data})
                    list.setState({addr2coor: {lat: lattitude2, lng: longitude2}})
                })
                .then(() => list.processAddress())
                .catch(function (error) {
                    console.log(error);
                });
            } else {
                console.log(err)
            }
        });
    }

    //takes the list of nearby agencies, removes duplicates and calculates the distances between the addresses
    processAddress() {
        var fullList = this.state.addr1list.concat(this.state.addr2list)
        if(fullList.length > 0) {
            var checkObject = {};
            var finalList = [];
            for(var i = 0;i < fullList.length;i++) {
                var distance1 = geolib.getDistance(
                    {latitude: this.state.addr1coor.lat, longitude: this.state.addr1coor.lng}, 
                    {latitude: fullList[i].geometry.location.lat, longitude: fullList[i].geometry.location.lng});
                var distance2 = geolib.getDistance(
                    {latitude: this.state.addr2coor.lat, longitude: this.state.addr2coor.lng}, 
                    {latitude: fullList[i].geometry.location.lat, longitude: fullList[i].geometry.location.lng});
                var totalDistance = distance1 + distance2;
                if(!checkObject[fullList[i].name]) {
                    //conversion to miles
                    fullList[i]['distance1'] = Math.round((distance1/1609.34) * 100) / 100;
                    fullList[i]['distance2'] = Math.round((distance2/1609.34) * 100) / 100;
                    fullList[i]['totalDistance'] = Math.round((totalDistance/1609.34) * 100) / 100;
                    checkObject[fullList[i].name] = 1;
                    finalList.push(fullList[i])
                } 
            }
            //orders the final list (NlogN)
            finalList.sort(function(a,b) {
                return a.totalDistance - b.totalDistance
            })
            //15 results maximum
            this.setState({finalList: finalList.slice(0,15)})
        }
    }

    //sets state on click to refresh map with new coordinates
    loadMap(coordinates) {
        this.setState({sentCoordinates: coordinates})
    }

    render() {
        return(
            <div>
                <div id="form">
                    <div id="instructions">Please Enter Address 1</div><input onChange={(e) => this.setState({address1: e.target.value})} id="addressInput" placeholder="Address 1"></input>
                    <div id="instructions">Please Enter Address 2</div><input onChange={(e) => this.setState({address2: e.target.value})} id="addressInput" placeholder="Address 2"></input>
                    <button id="submitButton" onClick={this.submitAddress}>Submit</button>
                </div>
                <div id="map"><MapContainer ref="container" address={this.state.sentCoordinates}/></div>
                {this.state.finalList.length > 0 ? <div id="placesList">
                    {this.state.finalList.map((addr) => {return(
                        <div id="place" onClick={() => {this.loadMap(addr.geometry.location)}}>
                            {/* {addr.photos ? <img src={addr.photos[0].html_attributions.slice(9,addr.photos[0].html_attributions.indexOf('"',9))}></img> : <img src={addr.icon}></img>} */}
                            <div id="name">{addr.name}</div>
                            <div id="vicinity" onClick={this.loadMap}>{addr.vicinity}</div>
                            <div id="distance1">Miles from Address 1: {addr.distance1}</div>
                            <div id="distance2">Miles from Address 2: {addr.distance2}</div>
                            <div id="totalDistance">Total Miles Away: {addr.totalDistance}</div>
                            <button id="mapButton">Click to Load Map</button>
                        </div>
                    )})}
                </div> : <div id="noResults">No Results...</div>}
            </div>
        )
    }
}

export default List;