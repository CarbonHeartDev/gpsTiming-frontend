import React from 'react';

interface FileManagerProps {
    tracksList: Track[]
    uploadFileCallback: (data: (FileList|null)) => void,
}

export const TracksManager = (prop: FileManagerProps) => {
    return (
        <>
            <div>
                {prop.tracksList.map((track, index) => (
                    <div key={index}>
                        <b>{track.name}</b>
                        <span>{track.rawContent}</span>
                    </div>
                ))}
            </div>
            <div>
                <input type="file" id="fileInput" onChange={e => prop.uploadFileCallback(e.target.files)}></input>
            </div>
        </>
    )
}

export interface Track {
    name: string;
    rawContent: string;
}