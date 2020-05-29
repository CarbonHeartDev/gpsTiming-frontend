import React from 'react'

export interface IconButtonProps {
    iconName: 'LIST_ADD'|'TRASH'|'FLOPPY'|'OK'|'FOLDER';
    disabled?: boolean;
    buttonClickCallback: () => void;
}

const availableIcons: { [key: string]: string } = {
    LIST_ADD: "icon-list-add",
    TRASH: "icon-trash-empty",
    FLOPPY: "icon-floppy",
    OK: "icon-ok",
    FOLDER: "icon-folder-open-empty",
};

const getIconClass = (iconName: string) => {
    let icon = availableIcons[iconName]

    if(icon) {
        return icon;
    } else {
        return "icon-help"
    }
}

export const IconButton = (prop: IconButtonProps) => { 
    return (
        <span className={`button ${getIconClass(prop.iconName)} ${ prop.disabled ? "disabled" : "" }`} onClick={() => prop.disabled ? null : prop.buttonClickCallback()}></span>
    )
}