
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Provider } from '../schemas/provider.schema';


@Injectable()
export class ProviderService {
    constructor(
        @InjectModel('Provider') private providerModel: Model<any>,
    ) { }

    async softDelete(id: string): Promise<Provider> {
        const sale = await this.providerModel.findById(id);
        if (!sale) {
            throw new NotFoundException(`Sale with ID "${id}" not found`);
        }
        sale.isDeleted = true;
        return sale.save();
    }

    async permanentDelete(id: string): Promise<Provider> {
        const sale = await this.providerModel.findByIdAndDelete(id).exec();
        if (!sale) {
            throw new NotFoundException(`Sale with ID "${id}" not found`);
        }
        return sale;
    }
    // Implementa métodos para manejar proveedores, clientes mayoristas y órdenes mayoristas
}