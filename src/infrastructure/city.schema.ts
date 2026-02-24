import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
export type CityDocument = HydratedDocument<City>;

@Schema({ timestamps: true })
export class City {
  @Prop({ type: [String] })
  name: string[];
  @Prop()
  nameClean: string;
  @Prop()
  municipality!: string;
  @Prop({ type: [String] })
  state!: string[];
  @Prop()
  postcode!: string;
  @Prop()
  country: string;
}
export const CitySchema = SchemaFactory.createForClass(City);
