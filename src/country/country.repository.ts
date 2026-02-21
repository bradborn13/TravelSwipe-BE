import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Country, CountryDocument } from 'src/infrastructure/country.schema';

@Injectable()
export class CountryRepository {
  constructor(
    @InjectModel(Country.name)
    private readonly model: Model<CountryDocument>,
  ) {}

  async getAllCities() {
    const result = await this.model.aggregate([
      { $match: { city: { $exists: true, $ne: '' } } },
      { $group: { _id: '$city' } },
      { $project: { _id: 0, city: '$_id' } },
    ]);
    return result?.map((item) => item.city);
  }
  async saveCountries(countries: Country[]) {
    await this.model.bulkWrite(
      countries.map((country: Country) => ({
        updateOne: {
          filter: { nameClean: country.nameClean },
          update: {
            $setOnInsert: {
              nameClean: country.nameClean,
              countryCode: country.countryCode,
            },
            $addToSet: {
              name: { $each: country.name }, // if it's an array
            },
          },
          upsert: true,
        },
      })),
      { ordered: false },
    );
  }
}
