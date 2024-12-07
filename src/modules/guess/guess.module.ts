import { Module } from '@nestjs/common';
import { GuessService } from './guess.service';
import { GuessController } from './guess.controller';

@Module({
  providers: [GuessService],
  controllers: [GuessController],
  exports: [GuessService]
})
export class GuessModule {}
