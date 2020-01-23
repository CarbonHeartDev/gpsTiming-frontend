import haversine from 'haversine';
import { Coordinate } from './TracksManager';

export function pointsDistanceInMeters(latlonA: Coordinate, latLonB: Coordinate): number {
    return haversine(latlonA, latLonB, { unit: 'meter' });
}