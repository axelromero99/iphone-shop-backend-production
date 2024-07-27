
import { Controller } from '@nestjs/common';
import { ProviderService } from './provider.service';

@Controller('provider')
export class ProviderController {
    constructor(private readonly providerService: ProviderService) { }




    // Implementa endpoints para manejar proveedores, clientes mayoristas y órdenes mayoristas
}
