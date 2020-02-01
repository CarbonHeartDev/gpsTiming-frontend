import React from 'react'
import { Map, TileLayer, Polyline, FeatureGroup, Marker } from 'react-leaflet'
import { Track } from './TracksManager'
import { calculateBoundsFromPatches } from './PathUtils'
import { LatLngBounds } from 'leaflet'
import { Checkpoint } from './CheckpointManager'
import { Coordinate } from './TracksManager'

interface TracksMapProps {
    tracksToRender: Track[];
    checkpointsToRender: Checkpoint[];
    onNewCheckpoint: (checkpoint: Checkpoint) => void;
}

interface MapState {
    state: 'IDLE' | 'DRAWING';
    tempCoordinate?: Coordinate;
}


export const TracksMap = (props: TracksMapProps) => {

    const [mapState, setMapState] = React.useState<MapState>({ state: 'IDLE' })

    let bounds: LatLngBounds;

    const mapClickCallback = (e: any): void => {
        debugger;
        if (mapState.state === 'DRAWING') {
            if (!mapState.tempCoordinate) {
                setMapState({state: 'DRAWING', tempCoordinate: { latitude: e.latlng.lat, longitude: e.latlng.lng }})
            } else if (mapState.tempCoordinate) {
                props.onNewCheckpoint({ p1: mapState.tempCoordinate as Coordinate, p2: { latitude: e.latlng.lat, longitude: e.latlng.lng } });

                setMapState({state: 'IDLE'})
            }
        }
    }

    if (props.tracksToRender.length === 0) {
        bounds = new LatLngBounds({ lat: -1, lng: -1 }, { lat: 1, lng: 1 });
    } else {
        let calculatedBounds = calculateBoundsFromPatches(props.tracksToRender.map(e => e.path));
        bounds = new LatLngBounds({ lat: calculatedBounds.sw.lat, lng: calculatedBounds.sw.lng }, { lat: calculatedBounds.ne.lat, lng: calculatedBounds.ne.lng });
    }

    return (
        <>
            <Map bounds={bounds} style={{ height: "500px", cursor: mapState.state === 'DRAWING' ? "crosshair" : "auto" }} onClick={mapClickCallback}>
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution="&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
                />
                {
                    props.tracksToRender.map(t => <Polyline color="lime" positions={t.path.map(e => { return { lat: e.position.latitude, lng: e.position.longitude } })} />)
                }
                {
                    props.checkpointsToRender.map(cp => <Polyline color="blue" positions={[{ lat: cp.p1.latitude, lng: cp.p1.longitude }, { lat: cp.p2.latitude, lng: cp.p2.longitude }]} />)
                }
                {
                    (mapState.tempCoordinate) ?
                        <Marker position={{ lat: mapState.tempCoordinate.latitude, lng: mapState.tempCoordinate.longitude }} />
                        :
                        null
                }
                <FeatureGroup>

                </FeatureGroup>
            </Map>
            <button onClick={() => setMapState({ state: 'DRAWING' })}>Add track waypoint</button>
        </>
    )
}