import { Module } from '@nestjs/common';
import { ActivitiesController } from './activities.controller';
import { ActivityService } from './activities.service';
import { MongooseModule } from '@nestjs/mongoose';

import { ActivitiesRepository } from './activities.repository';
import {
  Activities,
  ActivitiesSchema,
} from './infrastructure/activities.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Activities.name, schema: ActivitiesSchema },
    ]),
  ],
  controllers: [ActivitiesController],
  providers: [ActivityService, ActivitiesRepository],
})
export class ActivitiesModule {}
