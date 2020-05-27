import React from 'react';
import { Segment, Route } from './PathRoutePointUtils';


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
                <button disabled={generalComponentState === 'LOAD'} onClick={() => setGeneralComponentState(() => 'LOAD')}>LOAD</button>
                <button disabled={generalComponentState === 'SAVE'} onClick={() => setGeneralComponentState(() => 'SAVE')}>SAVE</button>
            </div>
            {generalComponentState !== 'CLOSED' ? <div>
                <div>
                    <input type="text" onChange={(event) => {
                        event.persist();
                        setTextBoxState((_ => event.target.value));
                        }}></input>
                </div>
                <button onClick={confirmationClickHandler}>CONFIRM</button>
                <div>
                    <span>{messageBoxState}</span>
                </div>
            </div> : null}
        </>
    )
}

