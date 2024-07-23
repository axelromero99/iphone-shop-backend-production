
import { Controller } from '@nestjs/common';
import { WholesaleService } from './wholesale.service';

@Controller('wholesale')
export class WholesaleController {
    constructor(private readonly wholesaleService: WholesaleService) { }

    // Implementa endpoints para manejar proveedores, clientes mayoristas y órdenes mayoristas
}
