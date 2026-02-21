import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CountryService } from './country.service';
@ApiTags('country')
@Controller('country')
export class CountryController {
  constructor(private readonly CountryService: CountryService) {}

  @Get('getAll')
  async getAllCountries() {
    return await this.CountryService.getAllCities();
  }
}
