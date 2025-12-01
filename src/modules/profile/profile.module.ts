import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Profile, ProfileSchema } from './entities/profile.entity';
import { ProfileRepository } from './repositories/profile.repository';
import { ProfileService } from './services/profile.service';
import { ProfileResolver } from './resolvers/profile.resolver';

@Module({
  imports: [MongooseModule.forFeature([{ name: Profile.name, schema: ProfileSchema }])],
  providers: [ProfileResolver, ProfileService, ProfileRepository],
  exports: [ProfileService],
})
export class ProfileModule {}
