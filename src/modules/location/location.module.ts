import { Module } from '@nestjs/common';
import { LocationService } from './location.service';
import { LocationController } from './location.controller';
import { GuessModule } from '../guess/guess.module';
import { UserModule } from '../user/user.module';

@Module({
  imports: [GuessModule, UserModule],
  providers: [LocationService],
  controllers: [LocationController],
  exports: [LocationService]
})
export class LocationModule {}
