import { Point } from "./TracksManager";
import haversine, { CoordinateLatLng } from "haversine";

export const calculateTotalDistance = (path: Point[]): number => {
    return path.reduce<number>((accumulator, currentElement, index, inputArray) =>
        accumulator + ((index + 1 < inputArray.length) ? haversine(currentElement.position, inputArray[index + 1].position, { unit: 'meter' }) : 0), 0);
}

export const calculateBoundsFromPatches = (paths: Point[][]): {ne: CoordinateLatLng, sw: CoordinateLatLng} => {
    let points: Point[] = paths.flat();

    let minlat = Math.min.apply(null, points.map(p => p.position.latitude));
    let maxlat = Math.max.apply(null, points.map(p => p.position.latitude));

    let minlng = Math.min.apply(null, points.map(p => p.position.longitude));
    let maxlng = Math.max.apply(null, points.map(p => p.position.longitude));

    return {ne: {lat: maxlat, lng: maxlng}, sw:{lat:minlat, lng:minlng}};
}