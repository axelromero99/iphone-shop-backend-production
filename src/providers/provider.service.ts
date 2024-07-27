
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class ProviderService {
    constructor(
        @InjectModel('Provider') private providerModel: Model<any>,
    ) { }

    // Implementa métodos para manejar proveedores, clientes mayoristas y órdenes mayoristas
}