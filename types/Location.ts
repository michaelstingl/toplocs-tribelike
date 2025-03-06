import { GroupedProfiles } from './Profile';
import { GroupedInterests } from './Interest';
import type {
    LocationInterestKeyType,
    ProfileLocationKeyType,
    LocationLocationKeyType
} from './Relation';
import { Activity } from './Activity';
import { Discussion } from './Discussion';

export type GroupedLocations = {
    [key in LocationLocationKeyType |ProfileLocationKeyType | LocationInterestKeyType]: Location[];
};

export interface Coordinates {
    lat: number;
    long: number;
}

export interface Polygon {
    coordinates: Coordinates[];
}

export interface Link {
    url: string;
    title: string;
}

export interface Location {
    id: string;
    title: string;
    position?: Coordinates;
    area?: Polygon;
    zoom?: number;
    geom?: Uint8Array;
    links: Link[];
    ask: string[];
    invites: string[];
    access: number;
    activities: Activity[];
    discussions: Discussion[];
    profiles?: GroupedProfiles;
    interests?: GroupedInterests;
    locations?: GroupedLocations;
}
