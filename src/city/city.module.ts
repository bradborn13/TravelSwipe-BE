import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { CityService } from './city.service';
import { CityController } from './city.controller';
import { CityRepository } from './city.repository';
import { City, CitySchema } from 'src/infrastructure/city.schema';
import { ActivitiesRepository } from 'src/activities/activities.repository';
import {
  Activities,
  ActivitiesSchema,
} from 'src/infrastructure/activities.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: City.name, schema: CitySchema }]),
    MongooseModule.forFeature([
      { name: Activities.name, schema: ActivitiesSchema },
    ]),
  ],
  controllers: [CityController],
  providers: [CityService, CityRepository, ActivitiesRepository],
})
export class CityModule {}
