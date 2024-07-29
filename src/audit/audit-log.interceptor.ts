// audit-log.interceptor.ts
import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Reflector } from '@nestjs/core';
import { AuditLogService } from './audit-log.service';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from '../auth/auth.service'; // Importa AuthService en lugar de UserService

@Injectable()
export class AuditLogInterceptor implements NestInterceptor {
    constructor(
        private reflector: Reflector,
        private auditLogService: AuditLogService,
        private jwtService: JwtService,
        private authService: AuthService // Usa AuthService en lugar de UserService
    ) { }

    async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
        const auditLog = this.reflector.get<boolean>('auditLog', context.getHandler());

        if (!auditLog) {
            return next.handle();
        }

        const request = context.switchToHttp().getRequest();
        const { url, method, body } = request;
        let user = null;

        const authHeader = request.headers['authorization'];
        if (authHeader && authHeader.startsWith('Bearer ')) {
            const token = authHeader.substring(7);
            try {
                const decoded = this.jwtService.verify(token);
                user = await this.authService.findById(decoded.id);
            } catch (error) {
                console.error('Error al decodificar el token o obtener el usuario:', error);
            }
        }

        return next.handle().pipe(
            tap(async response => {
                await this.auditLogService.log({
                    url,
                    method,
                    body,
                    user,
                    response
                });
            })
        );
    }
}