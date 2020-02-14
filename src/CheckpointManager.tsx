import React from 'react'
import { RemoveButton } from './RemoveButton'
import { Segment } from './PathRoutePointUtils'

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
                            <div><b>Lat:</b> {checkpoint.p1.latitude} <b>Lon:</b> {checkpoint.p1.longitude}</div>
                            <div><b>Lat:</b> {checkpoint.p2.latitude} <b>Lon:</b> {checkpoint.p2.longitude}</div>
                            <RemoveButton RemoveButtonCallback={() => prop.removeCheckpointCallback(index)} />
                        </div>
                    )
                )
            }
            <button onClick={prop.triggerDrawing}>Add track waypoint</button>
        </>
    )
}
