import { Injectable } from '@nestjs/common';
import { LocationsRepository } from './locations.repository';

@Injectable()
export class LocationsService {
  constructor(private readonly locationsRepo: LocationsRepository) {}

  async getLocationSuggestions() {
    const locationSuggestions = await this.locationsRepo.findLocations();
    return locationSuggestions || [];
  }
}
