import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
export type LocationDocument = HydratedDocument<Location>;

// 1. Define sub-schema for Categories
@Schema({ _id: false })
class Category {
  @Prop()
  id!: string;
  @Prop()
  name!: string;
  @Prop()
  shortname!: string;
}

// 2. Define sub-schema for Location Details
@Schema({ _id: false })
class LocationDetails {
  @Prop()
  address!: string;

  @Prop()
  country!: string;

  @Prop()
  cross_street!: string;

  @Prop()
  formattedAddress!: string;

  @Prop()
  locality!: string;

  @Prop()
  postcode!: string;

  @Prop()
  region!: string;
}
@Schema({ _id: false })
class RelatedPlaces {
  @Prop()
  fsq_place_id!: string;

  @Prop()
  name!: string;

  @Prop({ type: [Category] })
  categories!: Category[];
}
class SocialMedia {
  @Prop()
  facebookId!: string;

  @Prop()
  instagram!: string;

  @Prop()
  twitter!: string;
}

class ImageURL {
  @Prop()
  originalHeight!: number;

  @Prop()
  originalWidth!: number;

  @Prop()
  thumbnail!: string;

  @Prop()
  title!: string;

  @Prop()
  source!: string;

  @Prop()
  link!: string;

  @Prop()
  position!: number;

  @Prop()
  imgSource!: string;
}

@Schema({ timestamps: true })
export class Location {
  @Prop({ required: true })
  name!: string;

  @Prop({ unique: true })
  fsq_id!: string;

  @Prop()
  city!: string;

  @Prop()
  imagesURL!: ImageURL[];

  @Prop()
  latitude!: number;

  @Prop()
  longitude!: number;

  @Prop({ type: [Category] })
  categories!: Category[];

  @Prop()
  dateCreated!: Date;

  @Prop()
  dateRefreshed!: Date;

  @Prop()
  link!: string;

  @Prop()
  address!: string;

  @Prop()
  tel!: string;

  @Prop({ type: LocationDetails })
  details!: LocationDetails;

  @Prop()
  distance!: number;

  @Prop()
  website!: string;

  @Prop({ type: [RelatedPlaces] })
  relatedPlaces?: RelatedPlaces[];

  @Prop({ type: SocialMedia })
  socialMedia?: SocialMedia;
}
export const LocationSchema = SchemaFactory.createForClass(Location);
