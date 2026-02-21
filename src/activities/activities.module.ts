import { Module } from '@nestjs/common';
import { ActivitiesController } from './activities.controller';
import { ActivityService } from './activities.service';
import { MongooseModule } from '@nestjs/mongoose';

import { ActivitiesRepository } from './activities.repository';
import {
  Activities,
  ActivitiesSchema,
} from '../infrastructure/activities.schema';
import { City, CitySchema } from 'src/infrastructure/city.schema';
import { Country, CountrySchema } from 'src/infrastructure/country.schema';
import { CityRepository } from 'src/city/city.repository';
import { CountryRepository } from 'src/country/country.repository';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Activities.name, schema: ActivitiesSchema },
      { name: City.name, schema: CitySchema },
      { name: Country.name, schema: CountrySchema },
    ]),
  ],
  controllers: [ActivitiesController],
  providers: [
    ActivityService,
    ActivitiesRepository,
    CityRepository,
    CountryRepository,
  ],
})
export class ActivitiesModule {}
