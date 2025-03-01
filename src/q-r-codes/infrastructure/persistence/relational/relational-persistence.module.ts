import { Module } from '@nestjs/common';
import { QRCodeRepository } from '../q-r-code.repository';
import { QRCodeRelationalRepository } from './repositories/q-r-code.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QRCodeEntity } from './entities/q-r-code.entity';

@Module({
  imports: [TypeOrmModule.forFeature([QRCodeEntity])],
  providers: [
    {
      provide: QRCodeRepository,
      useClass: QRCodeRelationalRepository,
    },
  ],
  exports: [QRCodeRepository],
})
export class RelationalQRCodePersistenceModule {}
