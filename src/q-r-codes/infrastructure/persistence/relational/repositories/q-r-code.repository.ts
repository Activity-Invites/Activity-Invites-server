import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { QRCodeEntity } from '../entities/q-r-code.entity';
import { NullableType } from '../../../../../utils/types/nullable.type';
import { QRCode } from '../../../../domain/q-r-code';
import { QRCodeRepository } from '../../q-r-code.repository';
import { QRCodeMapper } from '../mappers/q-r-code.mapper';
import { IPaginationOptions } from '../../../../../utils/types/pagination-options';

@Injectable()
export class QRCodeRelationalRepository implements QRCodeRepository {
  constructor(
    @InjectRepository(QRCodeEntity)
    private readonly qRCodeRepository: Repository<QRCodeEntity>,
  ) {}

  async create(data: QRCode): Promise<QRCode> {
    const persistenceModel = QRCodeMapper.toPersistence(data);
    const newEntity = await this.qRCodeRepository.save(
      this.qRCodeRepository.create(persistenceModel),
    );
    return QRCodeMapper.toDomain(newEntity);
  }

  async findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<QRCode[]> {
    const entities = await this.qRCodeRepository.find({
      skip: (paginationOptions.page - 1) * paginationOptions.limit,
      take: paginationOptions.limit,
    });

    return entities.map((entity) => QRCodeMapper.toDomain(entity));
  }

  async findById(id: QRCode['id']): Promise<NullableType<QRCode>> {
    const entity = await this.qRCodeRepository.findOne({
      where: { id },
    });

    return entity ? QRCodeMapper.toDomain(entity) : null;
  }

  async findByIds(ids: QRCode['id'][]): Promise<QRCode[]> {
    const entities = await this.qRCodeRepository.find({
      where: { id: In(ids) },
    });

    return entities.map((entity) => QRCodeMapper.toDomain(entity));
  }

  async update(
    id: QRCode['id'],
    payload: Partial<QRCode>,
  ): Promise<QRCode> {
    const entity = await this.qRCodeRepository.findOne({
      where: { id },
    });

    if (!entity) {
      throw new Error('Record not found');
    }

    const updatedEntity = await this.qRCodeRepository.save(
      this.qRCodeRepository.create(
        QRCodeMapper.toPersistence({
          ...QRCodeMapper.toDomain(entity),
          ...payload,
        }),
      ),
    );

    return QRCodeMapper.toDomain(updatedEntity);
  }

  async remove(id: QRCode['id']): Promise<void> {
    await this.qRCodeRepository.delete(id);
  }
}
