import React from 'react'
import { calculateIntermediateTimes, Route, Segment } from './PathRoutePointUtils';
import { CollapsableData } from './CollapsableData';

export interface ITimingDetectionProps {
    route: Route;
    checkpoints: Segment[];
    removalCallback: () => void;
}

function formatTime(totalMillis: number, showInOutput: 'AUTO' | 'HOURS' | 'MINUTES' | 'SECONDS' = 'AUTO'): string {

    const pad = (num: number): string => num.toString().padStart(2, '0')

    let hours: number, minutes: number, seconds: number, millis: number;

    hours = Math.floor(totalMillis / 3600000);
    minutes = Math.floor((totalMillis % 3600000) / 60000);
    seconds = Math.floor((totalMillis % 60000) / 1000);
    millis = Math.floor(totalMillis % 1000);

    let result: string;

    if (showInOutput === 'AUTO') {
        if (hours > 0) {
            result = `${pad(hours)}:${pad(minutes)}'${pad(seconds)}"${millis}`
        } else if (minutes > 0) {
            result = `${pad(minutes)}'${pad(seconds)}"${millis}`
        } else {
            result = `${pad(seconds)}"${millis}`
        }
    }
    else if (showInOutput === 'HOURS') {
        result = `${pad(hours)}:${pad(minutes)}'${pad(seconds)}"${millis}`;
    } else if (showInOutput === 'MINUTES') {
        result = `${pad((hours * 60) + minutes)}'${pad(seconds)}"${millis}`;
    } else {
        result = `${pad((hours * 3600) + (minutes * 60) + seconds)}"${millis}`;
    }

    return result;
}

export const TimingDetection = (prop: ITimingDetectionProps) => {

    const intermediateTimes = calculateIntermediateTimes(prop.route.path, prop.checkpoints);

    return (
        <CollapsableData
            name={prop.route.name}
            dataShort={(intermediateTimes.length > 1) ?
                ((intermediateTimes.length === prop.checkpoints.length) ? `Total time: ${formatTime((intermediateTimes[intermediateTimes.length - 1].getTime() - intermediateTimes[0].getTime()))}` : 'DNF') :
                null}
            dataError={intermediateTimes.length !== prop.checkpoints.length}
            removalCallback={prop.removalCallback}
        >
            {
                (prop.checkpoints.length > 0) ? (
                    <div className="sectors">
                        <ul>
                            {
                                intermediateTimes
                                    .map((intermediateTime, index, intermediateTimes) => (
                                        index === 0 ?
                                            <li className="sector first">Start time: {intermediateTime.toLocaleTimeString(undefined)}</li> :
                                            <li className={index < intermediateTimes.length - 1 ? "sector intermediate" : "sector last"}>Sector {index}: {formatTime((intermediateTime.getTime() - intermediateTimes[0].getTime()))} (split: {formatTime((intermediateTime.getTime() - intermediateTimes[index - 1].getTime()))})</li>
                                    ))
                            }
                        </ul>
                    </div>
                ) : null
            }
        </CollapsableData>
    )
}