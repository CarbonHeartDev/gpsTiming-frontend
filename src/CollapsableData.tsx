import React, { useState, ReactChild, ReactFragment, ReactPortal } from 'react'
import { RemoveButton } from './RemoveButton';

export interface CollapsableDataProps {
    name: string;
    dataShort?: string | null;
    dataError?: boolean;
    children: ReactChild | ReactFragment | ReactPortal | boolean | null | undefined;
    removalCallback: () => void;
}


export const CollapsableData = (prop: CollapsableDataProps) => {

    const [open, setOpen] = useState<Boolean>(false);

    return (
        <div className="collapsable-data" onClick={() => setOpen(value => !value)} style={{ cursor: prop.children ? 'pointer' : 'auto' }}>
            <div className="header">
                <div className="main-line">
                    <span className="detection-name">{prop.name}</span>
                        <RemoveButton RemoveButtonCallback={prop.removalCallback} />
                </div>
                {
                    (prop.dataShort) ?
                        <span className={'data-short' + ((prop.dataError) ? ' invalid' : null)}>{prop.dataShort}</span>
                        : null
                }
            </div>
            {
                (open && prop.children) ? (
                    <div className="body">
                        {prop.children}
                    </div>
                ) : null
            }
        </div>
    )
}