import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { ScheduleService } from './schedule.service';

@Module({
  imports: [ScheduleModule.forRoot()],
  exports: [ScheduleService],
  providers: [ScheduleService],
})
export class Shedule {}
