
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class WholesaleService {
    constructor(
        @InjectModel('Supplier') private supplierModel: Model<any>,
        @InjectModel('WholesaleCustomer') private wholesaleCustomerModel: Model<any>,
        @InjectModel('WholesaleOrder') private wholesaleOrderModel: Model<any>,
    ) { }

    // Implementa métodos para manejar proveedores, clientes mayoristas y órdenes mayoristas
}