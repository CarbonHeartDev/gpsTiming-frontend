import React from 'react'
import { Map, TileLayer, Polyline, FeatureGroup, Marker } from 'react-leaflet'
import { calculateBoundsFromRoutes, Segment, Route, Coordinate } from './PathRoutePointUtils'
import { LatLngBounds } from 'leaflet'

interface TracksMapProps {
    tracksToRender: Route[];
    checkpointsToRender: Segment[];
    onNewCheckpoint: (checkpoint: Segment) => void;
}

interface MapState {
    state: 'IDLE' | 'DRAWING';
    tempCoordinate?: Coordinate;
}


export const TracksMap = (props: TracksMapProps) => {

    const [mapState, setMapState] = React.useState<MapState>({ state: 'IDLE' })

    let bounds: LatLngBounds;

    const mapClickCallback = (e: any): void => {
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
        let calculatedBounds = calculateBoundsFromRoutes(props.tracksToRender.map(e => e.path));
        bounds = new LatLngBounds({ lat: calculatedBounds.sw.lat, lng: calculatedBounds.sw.lng }, { lat: calculatedBounds.ne.lat, lng: calculatedBounds.ne.lng });
    }

    return (
        <>
            <Map bounds={bounds} style={{ height: "100%", cursor: mapState.state === 'DRAWING' ? "crosshair" : "auto" }} onClick={mapClickCallback}>
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution="&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
                />
                {
                    props.tracksToRender.map((t, index, tracks) => <Polyline key={index} color="lime" positions={t.path.map(e => { return { lat: e.position.latitude, lng: e.position.longitude } })} />)
                }
                {
                    props.checkpointsToRender.map((cp, index, checkpoints) => <Polyline key={index} color={(index === 0 ? 'green' : (index === checkpoints.length - 1 ? 'red' : 'yellow'))} positions={[{ lat: cp.p1.latitude, lng: cp.p1.longitude }, { lat: cp.p2.latitude, lng: cp.p2.longitude }]} />)
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