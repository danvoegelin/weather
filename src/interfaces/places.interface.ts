export interface Place {
    description: string;
    id: string;
    matched_substrings: any[];
    place_id: string;
    reference: string;
    structured_formatting: any;
    terms: any[];
    types: string[];
}

export interface SavedLocations {
    locations: Location[];
}

export interface Location {
    location: string;
    lat: number;
    long: number;
    place_id: string;
}