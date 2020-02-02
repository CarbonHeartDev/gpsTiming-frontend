import React from 'react'
import { calculateIntermediateTimes, Route, Segment } from './PathRoutePointUtils';
import { RemoveButton } from './RemoveButton';

export interface ITimingDetectionProps {
    route: Route;
    checkpoints: Segment[];
    removalCallback: () => void;
}

export const TimingDetection = (prop: ITimingDetectionProps) => {
    const intermediateTimes = calculateIntermediateTimes(prop.route.path, prop.checkpoints);

    return (
        <div className="timing-detection">
            <div className="header">
            <span className="detection-name">{prop.route.name}</span>
            {
                (intermediateTimes.length > 1) ?
                    ((intermediateTimes.length === prop.checkpoints.length) ? <span className="total-time">Total time: {(intermediateTimes[intermediateTimes.length - 1].getTime() - intermediateTimes[0].getTime()) / 1000}</span> : <span className="total-time invalid">DNF</span>) :
                    null
            }
            </div>
            <div className="sectors">
                <ul>
                    {
                        intermediateTimes
                            .map((intermediateTime, index, intermediateTimes) => (
                                index === 0 ?
                                    <li className="sector first">Start time: {intermediateTime.toString()}</li> :
                                    <li className={index < intermediateTimes.length - 1 ? "sector intermediate" : "sector last"}>Sector {index}: {(intermediateTime.getTime() - intermediateTimes[0].getTime()) / 1000} (split: {(intermediateTime.getTime() - intermediateTimes[index - 1].getTime()) / 1000})</li>
                            ))
                    }
                </ul>
            </div>
            <RemoveButton RemoveButtonCallback={prop.removalCallback} />
        </div>
    )
}