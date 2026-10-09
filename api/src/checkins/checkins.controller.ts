import { Controller, Get, Post, Body } from '@nestjs/common';
import { CheckinsService } from './checkins.service';
import { Checkin } from './entities/checkin.entity';
import { CriarCheckinDto } from './dto/criar-checkin.dto';

@Controller('checkins')
export class CheckinsController {
  constructor(private readonly checkinsService: CheckinsService) {}

  @Post()
  async criar(@Body() dto: CriarCheckinDto): Promise<Checkin> {
    return this.checkinsService.criar(dto);
  }

  @Get()
  async listar(): Promise<Checkin[]> {
    return this.checkinsService.listar();
  }
}
