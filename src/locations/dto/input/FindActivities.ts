import { IsString, IsNotEmpty } from 'class-validator';

export class FindActivitiesDto {
  @IsString()
  @IsNotEmpty()
  city: string;
}
