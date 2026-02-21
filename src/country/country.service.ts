import { Injectable } from '@nestjs/common';
import { CountryRepository } from './country.repository';

@Injectable()
export class CountryService {
  constructor(private readonly countryRepo: CountryRepository) {}

  async getAllCities() {
    const locationSuggestions = await this.countryRepo.getAllCities();
    return locationSuggestions || [];
  }
}
