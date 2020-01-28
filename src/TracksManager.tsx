import React from 'react';
import { calculateTotalDistance } from './PathUtils';

interface FileManagerProps {
    tracksList: Track[];
    uploadFileCallback: (data: (FileList | null)) => void;
    removeFileCallback: (id: number) => void;
}

export const TracksManager = (prop: FileManagerProps) => {
    return (
        <>
            <div>
                {
                    prop.tracksList.map((e, index) => {

                        const distanceMeters = Math.round(calculateTotalDistance(e.path));
                        const durationMilliseconds = e.path[e.path.length - 1].time.valueOf() - e.path[0].time.valueOf();

                        return (
                            <div style={{ border: "solid 1px black" }}>
                                <div><b>{e.name}</b></div>
                                <div>punti: {e.path.length}</div>
                                <div>distanza totale: {distanceMeters} metri</div>
                                <div>Tempo: {durationMilliseconds} secondi</div>
                                <div>Velocità media: {distanceMeters/(durationMilliseconds/1000)} m/s</div>
                                <span style={{cursor:"pointer",color:"blue"}} onClick={() => prop.removeFileCallback(index)}>Rimuovi elemento</span>
                            </div>
                        )
                    })
                }
            </div>
            <div>
                <input type="file" id="fileInput" onChange={e => prop.uploadFileCallback(e.target.files)}></input>
            </div>
        </>
    )
}

export interface Track {
    name: string;
    path: Point[];
}

export interface Coordinate {
    latitude: number;
    longitude: number;
}

export interface Point {
    position: Coordinate;
    altitude?: number;
    time: Date;
}