import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RegistroController } from './registro.controller';
import { RegistroService } from './registro.service';
import { Registro, registroSchema } from '../schemas/registro.schema';
import { CommonModule } from '../common/common.module';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: Registro.name, schema: registroSchema }]),
        CommonModule
    ],
    controllers: [RegistroController],
    providers: [RegistroService],
})
export class RegistroModule { }