import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  PaymentSchema,
  PaymentSchemaClass,
} from './entities/payment.schema';
import { PaymentRepository } from '../payment.repository';
import { PaymentDocumentRepository } from './repositories/payment.repository';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: PaymentSchemaClass.name, schema: PaymentSchema },
    ]),
  ],
  providers: [
    {
      provide: PaymentRepository,
      useClass: PaymentDocumentRepository,
    },
  ],
  exports: [PaymentRepository],
})
export class DocumentPaymentPersistenceModule {}
