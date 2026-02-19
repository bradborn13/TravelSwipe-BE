interface CategoryIcon {
  prefix: string;
  suffix: string;
}

/**
 * Category classification for a place
 */
interface Category {
  fsq_category_id: string;
  name: string;
  short_name: string;
  plural_name: string;
  icon: CategoryIcon;
}

/**
 * Detailed geographic location information
 */
interface Location {
  address?: string;
  locality?: string;
  region?: string;
  postcode?: string;
  country?: string;
  formatted_address?: string;
}

/**
 * Child or related venue within the main place
 */
interface RelatedPlaceChild {
  fsq_place_id: string;
  name: string;
  categories: Category[];
}

/**
 * Wrapper for nested venue relationships
 */
interface RelatedPlaces {
  children?: RelatedPlaceChild[];
}

/**
 * The Root Object representing the Foursquare Place
 */
export interface FoursquarePlace {
  fsq_place_id: string; // Corrected from "fsq*place_id" to standard camelCase/underscore
  name: string;
  latitude: number;
  longitude: number;
  categories: Category[];
  date_created: string;
  date_refreshed: string;
  distance: number;
  link: string;
  location: Location;
  extended_location: Record<string, unknown>;
  placemaker_url: string;
  related_places: RelatedPlaces;
}
