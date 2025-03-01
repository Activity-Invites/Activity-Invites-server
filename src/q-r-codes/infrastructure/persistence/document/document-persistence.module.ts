import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  QRCodeSchema,
  QRCodeSchemaClass,
} from './entities/q-r-code.schema';
import { QRCodeRepository } from '../q-r-code.repository';
import { QRCodeDocumentRepository } from './repositories/q-r-code.repository';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: QRCodeSchemaClass.name, schema: QRCodeSchema },
    ]),
  ],
  providers: [
    {
      provide: QRCodeRepository,
      useClass: QRCodeDocumentRepository,
    },
  ],
  exports: [QRCodeRepository],
})
export class DocumentQRCodePersistenceModule {}
