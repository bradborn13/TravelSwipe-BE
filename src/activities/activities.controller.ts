import { Controller, Get, Query, Post } from '@nestjs/common';
import { ActivityService } from './activities.service';
import { FindActivitiesDto } from './dto/input/FindActivities';
import { ApiTags, ApiOkResponse } from '@nestjs/swagger';
import { ActivitiesDto } from './dto/output/ActivitiesDto';

@ApiTags('activities')
@Controller('activities')
export class ActivitiesController {
  constructor(private readonly activityService: ActivityService) {}

  @ApiOkResponse({ type: [ActivitiesDto] })
  @Get('search')
  async getActivities(@Query() query: FindActivitiesDto) {
    return await this.activityService.getActivities(query.city);
  }

  @Post('update/images')
  async findPhotos(@Query() query: FindActivitiesDto) {
    console.log(`Received request to update images for city: ${query.city}`);
    return await this.activityService.scrapePhotoForLocation(query.city);
  }
  @Get('find/country')
  async updateCountry() {
    return await this.activityService.findCountryForActivities();
  }
}
