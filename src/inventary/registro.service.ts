import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Registro } from '../schemas/registro.schema';
// import { CreateRegistroDto, UpdateRegistroDto, DiagnosticoDto } from './dto/registro.dto';
import { PaginationService } from '../common/services/pagination.service';
import { PaginationDto } from '../common/dtos/pagination.dto';

@Injectable()
export class RegistroService {
    constructor(
        @InjectModel(Registro.name) private registroModel: Model<any>,
        private paginationService: PaginationService
    ) { }

    async getRegistros(paginationDto: PaginationDto) {
        return this.paginationService.paginate<any>(this.registroModel, paginationDto);
    }

    async getRegistroByCodigo(codigoSeguimiento: string, authorization: string) {
        const adminToken = process.env.NEXT_PUBLIC_SECRET_ADMIN_TOKEN;
        let registro;

        if (authorization === adminToken) {
            registro = await this.registroModel.findOne({ codigoSeguimiento });
        } else {
            registro = await this.registroModel.findOne({ codigoSeguimiento }).select('-_id');
        }

        if (!registro) {
            throw new NotFoundException('Registro not found');
        }

        return { success: true, data: registro };
    }

    async createRegistro(createRegistroDto: any) {
        const registro = new this.registroModel(createRegistroDto);
        return await registro.save();
    }

    async updateRegistro(id: string, updateRegistroDto: any) {
        const registro = await this.registroModel.findByIdAndUpdate(id, updateRegistroDto, { new: true, runValidators: true });
        if (!registro) {
            throw new NotFoundException('Registro not found');
        }
        return { success: true, data: registro };
    }

    async deleteRegistro(id: string) {
        const result = await this.registroModel.deleteOne({ _id: id });
        if (result.deletedCount === 0) {
            throw new NotFoundException('Registro not found');
        }
        return { success: true, data: {} };
    }

    async addDiagnostico(id: string, type: 'primerDiagnostico' | 'segundoDiagnostico', diagnosticoDto: any) {
        const registro = await this.registroModel.findById(id);
        if (!registro) {
            throw new NotFoundException('Registro not found');
        }

        registro[type] = diagnosticoDto;
        await registro.save();
        return { success: true, data: registro };
    }

    async deleteDiagnostico(id: string, type: 'primerDiagnostico' | 'segundoDiagnostico') {
        const registro = await this.registroModel.findById(id);
        if (!registro) {
            throw new NotFoundException('Registro not found');
        }

        registro[type] = null;
        await registro.save();
        return { success: true, data: registro };
    }
}