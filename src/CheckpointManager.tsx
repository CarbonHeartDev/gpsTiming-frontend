import React from 'react'
import { Segment } from './PathRoutePointUtils'
import { CollapsableData } from './CollapsableData'

export interface CheckpointManagerProps {
    checkpointList: Segment[];
    removeCheckpointCallback: (id: number) => void;
    triggerDrawing: () => void;
}

export const CheckpointManager = (prop: CheckpointManagerProps) => {
    return (
        <>
            {
                prop.checkpointList.map((checkpoint, index) =>
                    (
                        <div key={index}>
                            <CollapsableData name={`Sector ${index + 1}`} removalCallback={() => prop.removeCheckpointCallback(index)}>
                                <div><b>Lat:</b> {checkpoint.p1.latitude} <b>Lon:</b> {checkpoint.p1.longitude}</div>
                                <div><b>Lat:</b> {checkpoint.p2.latitude} <b>Lon:</b> {checkpoint.p2.longitude}</div>
                            </CollapsableData>
                        </div>
                    )
                )
            }
            <button onClick={prop.triggerDrawing}>Add track waypoint</button>
        </>
    )
}
