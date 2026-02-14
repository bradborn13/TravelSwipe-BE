import { Controller, Get, Query } from '@nestjs/common';
import { LocationsService } from './locations.service';

@Controller('locations')
export class LocationsController {
  constructor(private readonly locationsService: LocationsService) {}

  @Get('search')
  async findLocations(@Query('city') city: string) {
    return await this.locationsService.getLocations(city);
  }
  @Get('activity/update/images')
  async findPhotos(@Query('city') city: string) {
    return await this.locationsService.scrapePhotoForLocation(city);
  }
}
