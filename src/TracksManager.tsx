import React from 'react';
import { Track, Segment } from './PathRoutePointUtils';
import { TimingDetection } from './TimingDetection';


interface FileManagerProps {
    tracksList: Track[];
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

