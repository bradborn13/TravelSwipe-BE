import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { LocationDocument } from '../schemas/location.schema';
import { Location } from '../schemas/location.schema';

@Injectable()
export class LocationRepository {
  constructor(
    @InjectModel(Location.name)
    private readonly model: Model<LocationDocument>,
  ) {}

  async upsertMany(locations: Location[]): Promise<void> {
    await this.model.bulkWrite(
      locations.map((loc) => ({
        updateOne: {
          filter: { fsq_id: loc.fsq_id },
          update: { $set: loc },
          upsert: true,
        },
      })),
    );
  }
}
