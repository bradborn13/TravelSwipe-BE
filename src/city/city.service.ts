import { Injectable } from '@nestjs/common';
import { CityRepository } from './city.repository';
import { ActivitiesRepository } from 'src/activities/activities.repository';

@Injectable()
export class CityService {
  constructor(
    private readonly cityRepo: CityRepository,
    private readonly activityRepo: ActivitiesRepository,
  ) {}

  async getAllCities() {
    const locationSuggestions = await this.cityRepo.getAllCities();
    return locationSuggestions || [];
  }
}
