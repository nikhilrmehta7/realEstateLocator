import React from 'react';
import ReactDOM from 'react-dom';
import {Marker, GoogleApiWrapper} from 'google-maps-react';
import Map from './map.jsx';

export class MapContainer extends React.Component {

  constructor(props) {
    super(props);

  }

  render() {
    if (!this.props.loaded) {
      return <div>Loading...</div>;
    }
    return (
      <div>
        <Map google={this.props.google} address={this.props.address}>
          <Marker position={{lat: this.props.address.lat, lng: this.props.address.lng}} ></Marker>
        </Map>
        </div>
    );
  }
}

export default GoogleApiWrapper({
  apiKey: process.env.GOOGLE_MAP_API
})(MapContainer);