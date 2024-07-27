
import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { CashRegisterService } from './cash-register.service';
// import { CreateCashRegisterDto } from './dto/create-cash-register.dto';
// import { UpdateCashRegisterDto } from './dto/update-cash-register.dto';

@Controller('cash-register')
export class CashRegisterController {
    constructor(private readonly cashRegisterService: CashRegisterService) { }

    @Post()
    create(@Body() createCashRegisterDto: any) {
        return this.cashRegisterService.create(createCashRegisterDto);
    }

    @Get()
    findAll() {
        return this.cashRegisterService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.cashRegisterService.findOne(id);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateCashRegisterDto: any) {
        return this.cashRegisterService.update(id, updateCashRegisterDto);
    }

    @Delete(':id')
    delete(@Param('id') id: string, @Query('permanent') permanent: boolean) {
        if (permanent) {
            return this.cashRegisterService.permanentDelete(id);
        } else {
            return this.cashRegisterService.softDelete(id);
        }
    }
}