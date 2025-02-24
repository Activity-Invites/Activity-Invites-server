import { NullableType } from '@/utils/types/nullable.type';
import { Activity } from '@/activities/domain/activities';

export interface ActivityRepository {
  create(activity: Activity): Promise<Activity>;
  findById(id: string): Promise<NullableType<Activity>>;
  findAll(): Promise<Activity[]>;
  update(id: string, activity: Partial<Activity>): Promise<Activity>;
  delete(id: string): Promise<void>;
  findByCreatorId(creatorId: string): Promise<Activity[]>;
  findByThemeId(themeId: string): Promise<Activity[]>;
}
