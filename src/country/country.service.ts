import { Injectable } from '@nestjs/common';
import { CountryRepository } from './country.repository';
import redis from 'src/redis/redis';
import { THREE_DAYS_IN_SECONDS } from 'src/utility/redis';

@Injectable()
export class CountryService {
  constructor(private readonly countryRepo: CountryRepository) {}

  async getAllCountries() {
    const cacheKey = `api:countries`;
    const cachedData = await redis.get(cacheKey);
    if (cachedData) return JSON.parse(cachedData);
    const allCountries = await this.countryRepo.getAllCities();
    redis.set(
      cacheKey,
      JSON.stringify(allCountries),
      'EX',
      THREE_DAYS_IN_SECONDS,
    );
    return allCountries || [];
  }
}
