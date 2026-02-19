import { Controller, Get } from '@nestjs/common';
import { LocationsService } from './locations.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('location')
@Controller('location')
export class LocationsController {
  constructor(private readonly locationsService: LocationsService) {}

  @Get('getAll')
  async findLocations() {
    return await this.locationsService.getLocationSuggestions();
  }
}
