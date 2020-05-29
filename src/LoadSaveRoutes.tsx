import React from 'react';
import { Segment, Route } from './PathRoutePointUtils';
import { IconButton } from './IconButton';


interface LoadSaveRoutesProps {
    currentRouteCheckpoints: Segment[]
    setCurrentRouteCheckpoints: React.Dispatch<React.SetStateAction<Segment[]>>
}

export const LoadSaveRoutes = (prop: LoadSaveRoutesProps) => {

    const [generalComponentState, setGeneralComponentState] = React.useState<"LOAD" | "SAVE" | "CLOSED">("CLOSED")
    const [textBoxState, setTextBoxState] = React.useState<string>("")
    const [messageBoxState, setMessageBoxState] = React.useState<string>("")

    const saveCurrentRoute = () => {
        let routeToAdd: Route = {
            name: textBoxState,
            checkpoints: prop.currentRouteCheckpoints
        }
        fetch("http://localhost:8080/route", {
            method: "POST",
            headers: {
                "Content-Type": 'application/json'
            },
            body: JSON.stringify(routeToAdd)
        }).then(response => {
            console.log("Route saved");
            response.text().then(value => {
                let saveConfirmation: any = JSON.parse(value);
                setMessageBoxState(() => "New route ID: " + saveConfirmation.ID);
            })
        })
    }

    const loadRoute = () => {
        fetch("http://localhost:8080/route/" + encodeURI(textBoxState), {
            method: "GET"
        }).then(response => {
            response.text().then(value => {
                let loadedRoute: Route = JSON.parse(value)
                prop.setCurrentRouteCheckpoints(_ => loadedRoute.checkpoints);
                setMessageBoxState(() => "Opened route: " + loadedRoute.name);
            })
        })
    }

    const confirmationClickHandler = () => {
        if (generalComponentState === 'LOAD') {
            loadRoute()
        } else if (generalComponentState === 'SAVE') {
            saveCurrentRoute()
        } else {
            console.error("Error on LoadSaveRoute component")
        }
    }

    return (
        <>
            <div>
                <IconButton iconName='FOLDER' disabled={generalComponentState === 'LOAD'} buttonClickCallback={() => setGeneralComponentState(() => 'LOAD')}></IconButton>
                <IconButton iconName='FLOPPY' disabled={generalComponentState === 'SAVE'} buttonClickCallback={() => setGeneralComponentState(() => 'SAVE')}></IconButton>
            </div>
            {generalComponentState !== 'CLOSED' ? <div>
                <div style={{display: "flex"}}>
                    <input type="text" onChange={(event) => {
                        event.persist();
                        setTextBoxState((_ => event.target.value));
                        }}></input>
                <IconButton iconName='OK' buttonClickCallback={confirmationClickHandler}></IconButton>
                </div>
                <div>
                    <span>{messageBoxState}</span>
                </div>
            </div> : null}
        </>
    )
}

