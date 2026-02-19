import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  Activities,
  ActivitiesDocument,
} from '../activities/infrastructure/activities.schema';

@Injectable()
export class LocationsRepository {
  constructor(
    @InjectModel(Activities.name)
    private readonly model: Model<ActivitiesDocument>,
  ) {}

  async findLocations() {
    const result = await this.model.aggregate([
      { $match: { city: { $exists: true, $ne: '' } } },
      { $group: { _id: '$city' } },
      { $project: { _id: 0, city: '$_id' } },
    ]);
    return result?.map((item) => item.city);
  }
}
