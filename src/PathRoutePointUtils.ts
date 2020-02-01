import haversine, { CoordinateLatLng } from "haversine";

export const calculateTotalDistance = (path: Point[]): number => {
    return path.reduce<number>((accumulator, currentElement, index, inputArray) =>
        accumulator + ((index + 1 < inputArray.length) ? pointsDistanceInMeters(currentElement.position, inputArray[index+1].position) : 0), 0);
}

export const calculateBoundsFromRoutes = (paths: Point[][]): {ne: CoordinateLatLng, sw: CoordinateLatLng} => {
    let points: Point[] = paths.flat();

    let minlat = Math.min.apply(null, points.map(p => p.position.latitude));
    let maxlat = Math.max.apply(null, points.map(p => p.position.latitude));

    let minlng = Math.min.apply(null, points.map(p => p.position.longitude));
    let maxlng = Math.max.apply(null, points.map(p => p.position.longitude));

    return {ne: {lat: maxlat, lng: maxlng}, sw:{lat:minlat, lng:minlng}};
}

export function pointsDistanceInMeters(latlonA: Coordinate, latLonB: Coordinate): number {
    return haversine(latlonA, latLonB, { unit: 'meter' });
}

export interface Checkpoint {
    p1: Coordinate;
    p2: Coordinate;
}

export interface Route {
    name: string;
    path: Point[];
}

export interface Coordinate {
    latitude: number;
    longitude: number;
}

export interface Point {
    position: Coordinate;
    altitude?: number;
    time: Date;
}