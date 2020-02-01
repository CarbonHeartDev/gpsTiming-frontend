import React from 'react';
import { calculateTotalDistance, Route, calculateIntermediateTimes, Segment } from './PathRoutePointUtils';
import { RemoveButton } from './RemoveButton';


interface FileManagerProps {
    tracksList: Route[];
    uploadFileCallback: (data: (FileList | null)) => void;
    removeFileCallback: (id: number) => void;
    checkpoints: Segment[];
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
                                <b>Passaggi ai checkpoint:</b>
                                <ul>
                                    {
                                    calculateIntermediateTimes(e.path, prop.checkpoints)
                                    .map(intermediateTime => (
                                        <li>{intermediateTime.toString()}</li>
                                    ))
                                    }
                                </ul>
                                <RemoveButton RemoveButtonCallback={() => prop.removeFileCallback(index)} />
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

