import { Injectable } from '@nestjs/common';
import { CreateQRCodeDto } from './dto/create-q-r-code.dto';
import { UpdateQRCodeDto } from './dto/update-q-r-code.dto';
import { QRCodeRepository } from './infrastructure/persistence/q-r-code.repository';
import { IPaginationOptions } from '../utils/types/pagination-options';
import { QRCode } from './domain/q-r-code';

@Injectable()
export class QRCodesService {
  constructor(
    // Dependencies here
    private readonly qRCodeRepository: QRCodeRepository,
  ) {}

  
  async create(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    createQRCodeDto: CreateQRCodeDto
  ) {
    // Do not remove comment below.
    // <creating-property />

    return this.qRCodeRepository.create({
      // Do not remove comment below.
      // <creating-property-payload />
    });
  }

  findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }) {
    return this.qRCodeRepository.findAllWithPagination({
      paginationOptions: {
        page: paginationOptions.page,
        limit: paginationOptions.limit,
      },
    });
  }

  findById(id: QRCode['id']) {
    return this.qRCodeRepository.findById(id);
  }

  findByIds(ids: QRCode['id'][]) {
    return this.qRCodeRepository.findByIds(ids);
  }

  async update(
    id: QRCode['id'],
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    updateQRCodeDto: UpdateQRCodeDto,
  ) {
    // Do not remove comment below.
    // <updating-property />

    return this.qRCodeRepository.update(id, {
      // Do not remove comment below.
      // <updating-property-payload />
    });
  }

  remove(id: QRCode['id']) {
    return this.qRCodeRepository.remove(id);
  }
}
