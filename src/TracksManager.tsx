import React from 'react';
import { calculateTotalDistance } from './PathUtils';

interface FileManagerProps {
    tracksList: Track[];
    uploadFileCallback: (data: (FileList | null)) => void;
}

export const TracksManager = (prop: FileManagerProps) => {
    return (
        <>
            <div>
                {
                    prop.tracksList.map(e => {

                        console.dir(e);
                        return (
                            <div style={{border: "solid 1px black"}}>
                                <div><b>{e.name}</b></div>
                                <div>punti: {e.path.length}</div>
                                <div>distanza totale: {Math.round(calculateTotalDistance(e.path))} metri</div>
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