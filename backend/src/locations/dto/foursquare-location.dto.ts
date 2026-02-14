export interface FoursquareCategoryDto {
  fsq_category_id: string;
  name: string;
  short_name: string;
}

export interface FoursquareLocationDto {
  fsq_place_id: string;
  name: string;
  latitude: number;
  longitude: number;
  categories?: FoursquareCategoryDto[];
  distance?: number;
  location?: {
    address?: string;
    locality?: string;
    region?: string;
    postcode?: string;
    country?: string;
    formatted_address?: string;
  };
  related_places?: {
    children?: FoursquareLocationDto[];
  };
  social_media?: {
    facebook_id?: string;
    instagram?: string;
    twitter?: string;
  };
  tel?: string;
  website?: string;
  link?: string;
}
