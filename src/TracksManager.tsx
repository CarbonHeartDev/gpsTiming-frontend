import React from 'react';
import { Route, Segment } from './PathRoutePointUtils';
import { TimingDetection } from './TimingDetection';


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
                    prop.tracksList.map((e, index) => <TimingDetection key={index} route={e} checkpoints={prop.checkpoints} removalCallback={() => prop.removeFileCallback(index)} />)
                }
            </div>
            <div>
                <input type="file" id="fileInput" onChange={e => prop.uploadFileCallback(e.target.files)}></input>
            </div>
        </>
    )
}

