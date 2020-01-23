import { Point } from "./TracksManager";
import haversine from "haversine";

export const calculateTotalDistance = (path: Point[]): number => {
    return path.reduce<number>((accumulator, currentElement, index, inputArray) =>
        accumulator + ((index + 1 < inputArray.length) ? haversine(currentElement.position, inputArray[index + 1].position, { unit: 'meter' }) : 0), 0);
}