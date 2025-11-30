import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './entities/user.entity';
import { UserRepository } from './repositories/user.repository';
import { UserService } from './services/user.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: User.name, schema: UserSchema }])],
  providers: [
    {
      provide: 'IUserRepository',
      useClass: UserRepository,
    },
    UserService,
  ],
  exports: [UserService, 'IUserRepository'],
})
export class UserModule {}
