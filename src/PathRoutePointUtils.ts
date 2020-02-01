import haversine, { CoordinateLatLng } from "haversine";
import { intersect, distance } from 'mathjs'

/**
 * Calculate the total length of a path in meters
 * @param path
 */
export const calculateTotalDistance = (path: Point[]): number => {
    return path.reduce<number>((accumulator, currentElement, index, inputArray) =>
        accumulator + ((index + 1 < inputArray.length) ? pointsDistanceInMeters(currentElement.position, inputArray[index + 1].position) : 0), 0);
}

/**
 * Get a bound which contans all the paths passed as arguments
 * @param paths 
 */
export const calculateBoundsFromRoutes = (paths: Point[][]): { ne: CoordinateLatLng, sw: CoordinateLatLng } => {
    let points: Point[] = paths.flat();

    let minlat = Math.min.apply(null, points.map(p => p.position.latitude));
    let maxlat = Math.max.apply(null, points.map(p => p.position.latitude));

    let minlng = Math.min.apply(null, points.map(p => p.position.longitude));
    let maxlng = Math.max.apply(null, points.map(p => p.position.longitude));

    return { ne: { lat: maxlat, lng: maxlng }, sw: { lat: minlat, lng: minlng } };
}

/**
 * Calculate the distance in meters between a couple of points
 * @param latlonA 
 * @param latLonB 
 */
export function pointsDistanceInMeters(latlonA: Coordinate, latLonB: Coordinate): number {
    return haversine(latlonA, latLonB, { unit: 'meter' });
}

/**
 * Given two points with a given times and a third untimed point this functions calculated the estimated time of passage at the third point with a linear interpolation 
 * @param pointA First timed point
 * @param pointB Second timed point
 * @param interpolationPoint Untimed coordinates for which time is interpolated
 */
export function interpolateTime(pointA: Point, pointB: Point, interpolationPoint: Coordinate): Date {
    const euclideanDistance = (coordinateA: Coordinate, coordinateB: Coordinate): number =>
        distance([coordinateA.latitude, coordinateA.longitude], [coordinateB.latitude, coordinateB.longitude]) as number;

    const deltaT = (euclideanDistance(pointA.position, interpolationPoint) / euclideanDistance(pointA.position, pointB.position)) * (pointB.time.getTime() - pointA.time.getTime());

    return new Date(pointA.time.getTime() + deltaT)
}

/**
 * Calculate the coordinates of intersection between two segments, if segments doesn't intersecates undefined will be returned
 * @param segmentA 
 * @param segmentB 
 */
export function calculateSegmentIntersection(segmentA: Segment, segmentB: Segment): (Coordinate | undefined) {

    const checkExistenceConditions = (rawPoint: number[]): boolean => {
        const result = (
            rawPoint[0] < Math.max(segmentA.p1.latitude, segmentA.p2.latitude) &&
            rawPoint[0] < Math.max(segmentB.p1.latitude, segmentB.p2.latitude) &&
            rawPoint[0] > Math.min(segmentA.p1.latitude, segmentA.p2.latitude) &&
            rawPoint[0] > Math.min(segmentB.p1.latitude, segmentB.p2.latitude) &&
            rawPoint[1] < Math.max(segmentA.p1.longitude, segmentA.p2.longitude) &&
            rawPoint[1] < Math.max(segmentB.p1.longitude, segmentB.p2.longitude) &&
            rawPoint[1] > Math.min(segmentA.p1.longitude, segmentA.p2.longitude) &&
            rawPoint[1] > Math.min(segmentB.p1.longitude, segmentB.p2.longitude)
        );

        return result;
    }

    const rawIntersection = intersect(
        [segmentA.p1.latitude, segmentA.p1.longitude], [segmentA.p2.latitude, segmentA.p2.longitude],
        [segmentB.p1.latitude, segmentB.p1.longitude], [segmentB.p2.latitude, segmentB.p2.longitude]
    ) as number[];

    const result: (Coordinate | undefined) = checkExistenceConditions(rawIntersection) ? { latitude: rawIntersection[0], longitude: rawIntersection[1] } : undefined;

    return result;
}



export function calculateIntermediateTimes(path: Point[], checkpoints: Segment[]): Date[] {
    let result: Date[] = [];

    let counter = 0;
    while (counter + 1 < path.length && result.length < checkpoints.length) {
        const intersection = calculateSegmentIntersection({ p1: path[counter].position, p2: path[counter + 1].position }, checkpoints[result.length]);
        if (intersection) {
            result = [...result, interpolateTime(path[counter], path[counter + 1], intersection)];
        }
        
        counter++;
    }

    return result;
}

export interface Segment {
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