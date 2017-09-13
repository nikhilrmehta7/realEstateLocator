import React from 'react';
import axios from 'axios';
import ReactDOM from 'react-dom';

export class Map extends React.Component {

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.loadMap()
  }

  componentWillReceiveProps() {
    this.loadMap();
  }

  //loads the google map with the marker
  loadMap() {
    if (this.props && this.props.google) {
      // google is available
      const { google } = this.props;
      const maps = google.maps;

      const mapRef = this.refs.map;
      const node = ReactDOM.findDOMNode(mapRef);

      //initialized to dolores park
      var lat = this.props.address.lat || 37.759703;
      var lng = this.props.address.lng || -122.428093;

      let zoom = 14;

      const center = new maps.LatLng(lat, lng);
      const mapConfig = Object.assign({}, {
        center: center,
        zoom: zoom
      });

      this.map = new maps.Map(node, mapConfig);
      this.marker = new maps.Marker({
        position: {lat: this.props.address.lat || 37.759703, lng: this.props.address.lng || -122.428093},
        map: this.map, 
        title: 'Marker'
      })
    }
  }


  render() {

    const style = {
      width: '300px',
      height: '200px',
    };


    return (
        <div id="loading" ref='map' style={style}>
        </div>
    );
  }
}
export default Map;