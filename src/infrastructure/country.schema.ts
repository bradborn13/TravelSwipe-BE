import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
export type CountryDocument = HydratedDocument<Country>;

@Schema({ timestamps: true })
export class Country {
  @Prop({ type: [String] })
  name: string[];
  @Prop()
  countryCode!: string;
  @Prop()
  nameClean: string;
}

export const CountrySchema = SchemaFactory.createForClass(Country);
