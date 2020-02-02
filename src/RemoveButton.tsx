import React from 'react'

export const RemoveButton = (props: {RemoveButtonCallback: () => void}) => {
    return (
        <span className="removal-button" onClick={props.RemoveButtonCallback}>X</span>
    )
}