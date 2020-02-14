import React, { ReactChild, ReactFragment, ReactPortal, useState } from 'react'

export interface SidebarSectionProps {
    title: string;
    children: ReactChild | ReactFragment | ReactPortal | boolean | null | undefined;
}

export const SidebarSection = (prop: SidebarSectionProps) => {

    const [visible, setVisible] = useState(true);

    return (
        <div className="setting">
            <div className="setting-header" onClick={() => setVisible(value => !value)}>
                <span>{prop.title}</span>
            </div>
            {
                (visible) ? (
                    <div className="setting-body">
                        <>
                            {prop.children}
                        </>
                    </div>
                ) : null
            }
        </div>
    )
}
