import { Injectable } from '@nestjs/common';
import { CityRepository } from './city.repository';
import { ActivitiesRepository } from 'src/activities/activities.repository';
import redis from 'src/redis/redis';
import { THREE_DAYS_IN_SECONDS } from 'src/utility/redis';

@Injectable()
export class CityService {
  constructor(
    private readonly cityRepo: CityRepository,
    private readonly activityRepo: ActivitiesRepository,
  ) {}

  async getAllCities() {
    const cacheKey = `api:cities`;
    const cachedData = await redis.get(cacheKey);
    if (cachedData) return JSON.parse(cachedData);
    const allCities = await this.cityRepo.getAllCities();
    redis.set(cacheKey, JSON.stringify(allCities), 'EX', THREE_DAYS_IN_SECONDS);
    return allCities || [];
  }
}
