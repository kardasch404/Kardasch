import { IBaseRepository } from '../../../common/interfaces/base-repository.interface';
import { Profile } from '../entities/profile.entity';

export interface IProfileRepository extends IBaseRepository<Profile> {
  findByUserId(userId: string): Promise<Profile | null>;
}
