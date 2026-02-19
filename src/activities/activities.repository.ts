import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  Activities,
  ActivitiesDocument,
} from './infrastructure/activities.schema';

@Injectable()
export class ActivitiesRepository {
  constructor(
    @InjectModel(Activities.name)
    private readonly model: Model<ActivitiesDocument>,
  ) {}

  async bulkInsert(activities: Activities[]) {
    return await this.model.bulkWrite(
      activities.map((activity) => ({
        updateOne: {
          filter: { fsq_id: activity.fsq_id },
          update: { $set: activity },
          upsert: true,
        },
      })),
      { ordered: false },
    );
  }
  async findActivity(filter: Partial<Activities>) {
    return await this.model.find(filter).exec();
  }
  async upsertMany(activities: Activities[]) {
    return await this.model.bulkWrite(
      activities.map((activity) => ({
        updateOne: {
          filter: { fsq_id: activity.fsq_id },
          update: { $set: activity },
          upsert: true,
        },
      })),
      { ordered: false },
    );
  }
  async updateImagesURL(
    activityName: string,
    activityCity: string,
    imagesURL: any,
  ) {
    return await this.model.updateOne(
      { name: activityName, city: activityCity },
      { $set: { imagesURL } },
    );
  }

  async findWithoutImages(city: string) {
    return await this.model
      .find({
        city,
        $or: [
          { imagesURL: { $exists: false } },
          { imagesURL: { $size: 0 } },
          { imagesURL: null },
        ],
      })
      .exec();
  }
}
