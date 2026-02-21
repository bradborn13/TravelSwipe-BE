import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CountryController } from './country.controller';
import { CountryRepository } from './country.repository';
import { CountryService } from './country.service';
import { Country, CountrySchema } from 'src/infrastructure/country.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Country.name, schema: CountrySchema }]),
  ],
  controllers: [CountryController],
  providers: [CountryService, CountryRepository],
})
export class CountryModule {}
