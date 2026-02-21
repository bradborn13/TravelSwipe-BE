import { Controller, Get } from '@nestjs/common';
import { CityService } from './city.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('city')
@Controller('city')
export class CityController {
  constructor(private readonly cityService: CityService) {}

  @Get('getAll')
  async getAllCities() {
    return await this.cityService.getAllCities();
  }
}
