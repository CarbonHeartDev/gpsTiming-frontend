import React from 'react'

export const RemoveButton = (props: {RemoveButtonCallback: () => void}) => {
    return (
        <span className="button icon-trash-empty" onClick={props.RemoveButtonCallback}></span>
    )
}