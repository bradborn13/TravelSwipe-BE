import { Controller, Get, Query } from '@nestjs/common';
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
  async findActivities(@Query() query: FindActivitiesDto) {
    return await this.activityService.getActivities(query.city);
  }

  @Get('update/images')
  async findPhotos(@Query('city') city: string) {
    return await this.activityService.scrapePhotoForLocation(city);
  }
}
