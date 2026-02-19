import { FoursquareLocationDto } from '../dto/foursquare-location.dto';
import { Activities } from '../infrastructure/activities.schema';

export function mapFoursquareLocation(
  item: FoursquareLocationDto,
  city: string,
): Activities {
  return {
    fsq_id: item.fsq_place_id,
    city,
    name: item.name,
    latitude: item.latitude,
    longitude: item.longitude,
    categories: item.categories?.map(mapCategory) ?? [],
    dateCreated: new Date(Date.now()),
    dateRefreshed: new Date(Date.now()),
    distance: item.distance ?? 0,
    link: item.link ?? '',
    address: item.location?.formatted_address ?? '',
    details: mapLocationDetails(item.location),
    relatedPlaces: item.related_places?.children?.map(mapRelatedPlace) ?? [],
    tel: item.tel ?? '',
    website: item.website ?? '',
    socialMedia: mapSocial(item.social_media),
    imagesURL: [],
  };
}
const mapCategory = (cat: any) => ({
  id: cat.fsq_category_id,
  name: cat.name,
  shortname: cat.short_name,
});

const mapLocationDetails = (location?: any) =>
  location && {
    address: location.address,
    locality: location.locality,
    region: location.region,
    postcode: location.postcode,
    country: location.country,
    formatted_address: location.formatted_address,
  };

const mapRelatedPlace = (child: any) => ({
  fsq_place_id: child.fsq_place_id,
  name: child.name,
  categories: child.categories?.map(mapCategory) ?? [],
});

const mapSocial = (social?: any) =>
  social && {
    facebookId: social.facebook_id,
    instagram: social.instagram,
    twitter: social.twitter,
  };
