import { Expose } from 'class-transformer';
import { Activities } from 'src/activities/infrastructure/activities.schema';

export class ActivitiesDto extends Activities {
  @Expose()
  get id() {
    return this._id;
  }
}
