import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { CheckinsModule } from './checkins/checkins.module';

@Module({
  imports: [HttpModule, CheckinsModule],
})
export class AppModule {}
