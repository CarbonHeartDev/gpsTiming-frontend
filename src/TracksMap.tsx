import React from 'react'
import { render } from 'react-dom'
import { Map, Marker, Popup, TileLayer, Polyline } from 'react-leaflet'
import { Track } from './TracksManager'
import { calculateBoundsFromPatches } from './PathUtils'
import { LatLng, LatLngBounds } from 'leaflet'

interface TracksMapProps {
    tracksToRender: Track[]
}

export const TracksMap = (props: TracksMapProps) => {

    let bounds: LatLngBounds;

    if(props.tracksToRender.length === 0){
    bounds = new LatLngBounds({lat:-1,lng:-1},{lat:1,lng:1});
    } else {
    let calculatedBounds = calculateBoundsFromPatches(props.tracksToRender.map(e => e.path));
    bounds = new LatLngBounds({lat:calculatedBounds.sw.lat,lng:calculatedBounds.sw.lng},{lat:calculatedBounds.ne.lat,lng:calculatedBounds.ne.lng});
    }

    return (
        <Map bounds={bounds} style={{ height: "500px" }}>
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution="&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
            />
            {
                props.tracksToRender.map(t => <Polyline color="lime" positions={t.path.map(e => {return {lat: e.position.latitude, lng: e.position.longitude}})} />)
            }
        </Map>
    )
}