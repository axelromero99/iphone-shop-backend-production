import { Controller, Get, Post, Put, Delete, Query, Body, Param, UseGuards, Req, Res } from '@nestjs/common';
import { RegistroService } from './registro.service';

// import { CreateRegistroDto, UpdateRegistroDto, DiagnosticoDto } from './dto/registro.dto';
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';
import { PaginationDto } from '../common/dtos/pagination.dto';

@Controller('registros')
export class RegistroController {
    constructor(private readonly registroService: RegistroService) { }

    @Get()
    async getRegistros(
        @Query() paginationDto: PaginationDto,
        @Res() res: Response
    ) {
        const result = await this.registroService.getRegistros(paginationDto);


        return res.json(result);
    }

    @Get(':codigoSeguimiento')
    getRegistroByCodigo(@Param('codigoSeguimiento') codigoSeguimiento: string, @Req() req) {
        return this.registroService.getRegistroByCodigo(codigoSeguimiento, req.headers.authorization);
    }

    @Post()
    @UseGuards(AuthGuard('jwt'))
    createRegistro(@Body() createRegistroDto: any) {
        return this.registroService.createRegistro(createRegistroDto);
    }

    @Put(':id')
    @UseGuards(AuthGuard('jwt'))
    updateRegistro(@Param('id') id: string, @Body() updateRegistroDto: any) {
        return this.registroService.updateRegistro(id, updateRegistroDto);
    }

    @Delete(':id')
    @UseGuards(AuthGuard('jwt'))
    deleteRegistro(@Param('id') id: string) {
        return this.registroService.deleteRegistro(id);
    }

    @Post(':id/diagnostico/:type')
    @UseGuards(AuthGuard('jwt'))
    addDiagnostico(
        @Param('id') id: string,
        @Param('type') type: 'primerDiagnostico' | 'segundoDiagnostico',
        @Body() diagnosticoDto: any
    ) {
        return this.registroService.addDiagnostico(id, type, diagnosticoDto);
    }

    @Delete(':id/diagnostico/:type')
    @UseGuards(AuthGuard('jwt'))
    deleteDiagnostico(
        @Param('id') id: string,
        @Param('type') type: 'primerDiagnostico' | 'segundoDiagnostico'
    ) {
        return this.registroService.deleteDiagnostico(id, type);
    }
}