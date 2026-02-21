import { Module } from '@nestjs/common';
import { ActivitiesModule } from './activities/activities.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { CityModule } from './city/city.module';
import { CountryModule } from './country/country.module';
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => ({
        uri: config.get<string>('MONGO_URL'),
      }),
    }),
    ActivitiesModule,
    CityModule,
    CountryModule,
  ],
})
export class AppModule {}
