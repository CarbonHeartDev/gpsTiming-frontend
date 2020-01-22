import React from 'react';

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
                            <div>
                                <div><b>{e.name}</b></div>
                                <span>punti: {e.path.length}</span>
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
    lat: number;
    lon: number;
    alt?: number;
}

export interface Point {
    position: Coordinate;
    time: Date;
}