import React from 'react'
import { RemoveButton } from './RemoveButton'
import { Checkpoint } from './PathRoutePointUtils'

export interface CheckpointManagerProps {
    checkpointList: Checkpoint[];
    removeCheckpointCallback: (id: number) => void;
}

export const CheckpointManager = (prop: CheckpointManagerProps) => {
    return (
        <>
            {
                prop.checkpointList.map((checkpoint, index) =>
                    (
                        <div>
                            <div><b>Lat:</b> {checkpoint.p1.latitude} <b>Lon:</b> {checkpoint.p1.longitude}</div>
                            <div><b>Lat:</b> {checkpoint.p2.latitude} <b>Lon:</b> {checkpoint.p2.longitude}</div>
                            <RemoveButton RemoveButtonCallback={() => prop.removeCheckpointCallback(index)}/>
                        </div>
                    )
                )
            }
        </>
    )
}
