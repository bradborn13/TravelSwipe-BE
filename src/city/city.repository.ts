import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  Activities,
  ActivitiesDocument,
} from '../infrastructure/activities.schema';
import { City, CityDocument } from 'src/infrastructure/city.schema';

@Injectable()
export class CityRepository {
  constructor(
    @InjectModel(Activities.name)
    private readonly model: Model<ActivitiesDocument>,
    @InjectModel(City.name)
    private readonly cityModel: Model<CityDocument>,
  ) {}

  async getAllCities() {
    const result = await this.model.aggregate([
      { $match: { city: { $exists: true, $ne: '' } } },
      { $group: { _id: '$city' } },
      { $project: { _id: 0, city: '$_id' } },
    ]);
    return result?.map((item) => item.city);
  }
  async saveCities(cities: City[]) {
    await this.cityModel.bulkWrite(
      cities.map((city) => ({
        updateOne: {
          filter: { nameClean: city.nameClean },
          update: {
            $setOnInsert: {
              nameClean: city.nameClean,
              municipality: city.municipality,
              state: city.state,
              postcode: city.postcode,
              country: city.country,
            },
            $addToSet: {
              name: { $each: city.name }, // if it's an array
            },
          },
          upsert: true,
        },
      })),
      { ordered: false },
    );
  }
}
