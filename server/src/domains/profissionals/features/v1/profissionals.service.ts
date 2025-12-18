import { Injectable } from '@nestjs/common';
import { CreateProfissionalDto } from '../../dto/create-profissional.dto';
import { UpdateProfissionalDto } from '../../dto/update-profissional.dto';

@Injectable()
export class ProfissionalsService {
  create(createProfissionalDto: CreateProfissionalDto) {
    return 'This action adds a new profissional';
  }

  findAll() {
    return `This action returns all profissionals`;
  }

  findOne(id: number) {
    return `This action returns a #${id} profissional`;
  }

  update(id: number, updateProfissionalDto: UpdateProfissionalDto) {
    return `This action updates a #${id} profissional`;
  }

  remove(id: number) {
    return `This action removes a #${id} profissional`;
  }
}
