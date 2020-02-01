import React from 'react'
import { Map, TileLayer, Polyline, FeatureGroup } from 'react-leaflet'
import { Track } from './TracksManager'
import { calculateBoundsFromPatches } from './PathUtils'
import { LatLngBounds } from 'leaflet'
import { EditControl } from 'react-leaflet-draw'
import { Checkpoint } from './CheckpointManager'

interface TracksMapProps {
    tracksToRender: Track[];
    checkpointsToRender: Checkpoint[];
    onNewCheckpoint: (checkpoint: Checkpoint) => void;
}


export const TracksMap = (props: TracksMapProps) => {

    let bounds: LatLngBounds;

    if (props.tracksToRender.length === 0) {
        bounds = new LatLngBounds({ lat: -1, lng: -1 }, { lat: 1, lng: 1 });
    } else {
        let calculatedBounds = calculateBoundsFromPatches(props.tracksToRender.map(e => e.path));
        bounds = new LatLngBounds({ lat: calculatedBounds.sw.lat, lng: calculatedBounds.sw.lng }, { lat: calculatedBounds.ne.lat, lng: calculatedBounds.ne.lng });
    }

    return (
        <Map bounds={bounds} style={{ height: "500px" }}>
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution="&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
            />
            {
                props.tracksToRender.map(t => <Polyline color="lime" positions={t.path.map(e => { return { lat: e.position.latitude, lng: e.position.longitude } })} />)
            }
            {
                props.checkpointsToRender.map(cp => <Polyline color="blue" positions={[{lat: cp.p1.latitude, lng: cp.p1.longitude},{lat: cp.p2.latitude, lng: cp.p2.longitude}]} />)
            }
            <FeatureGroup>
                <EditControl
                    position='topright'
                    draw={{
                        rectangle: false
                    }}
                    onDrawVertex={
                        (e: any) => {
                            const layerIds = Object.keys(e.layers._layers);
                            if (layerIds.length > 1) {
                                debugger;
                                const secondVertex = e.layers._layers[layerIds[1]]._icon;
                                requestAnimationFrame(() => secondVertex.click());
                                const layers = e.layers.getLayers();
                                const p1 = layers[0].getLatLng();
                                const p2 = layers[1].getLatLng();

                                props.onNewCheckpoint({p1: {latitude: p1.lat, longitude: p1.lng}, p2: {latitude: p2.lat, longitude: p2.lng}});
                            }
                        }
                    }

                    onDrawStop={
                        (e: string) => {
                            debugger;
                        }
                    }
                />
            </FeatureGroup>
        </Map>
    )
}