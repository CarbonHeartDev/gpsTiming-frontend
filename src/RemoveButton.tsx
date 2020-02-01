import React from 'react'

export const RemoveButton = (props: {RemoveButtonCallback: () => void}) => {
    return (
        <span style={{cursor:"pointer",color:"blue"}} onClick={props.RemoveButtonCallback}>Rimuovi elemento</span>
    )
}