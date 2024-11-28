import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

//expose PrismaService variable for all files in app
@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}