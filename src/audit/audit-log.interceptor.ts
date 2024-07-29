// audit-log.interceptor.ts
import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Reflector } from '@nestjs/core';
import { AuditLogService } from './audit-log.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuditLogInterceptor implements NestInterceptor {
    constructor(
        private reflector: Reflector,
        private auditLogService: AuditLogService,
        private jwtService: JwtService
    ) { }

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const auditLog = this.reflector.get<boolean>('auditLog', context.getHandler());

        if (!auditLog) {
            return next.handle();
        }

        const request = context.switchToHttp().getRequest();
        const { url, method, body } = request;
        let userId = null;

        // Extraer el token del encabezado de autorización
        const authHeader = request.headers['authorization'];
        if (authHeader && authHeader.startsWith('Bearer ')) {
            const token = authHeader.substring(7);
            try {
                const decoded = this.jwtService.verify(token);
                userId = decoded.id;
            } catch (error) {
                console.error('Error al decodificar el token:', error);
            }
        }

        return next.handle().pipe(
            tap(response => {
                this.auditLogService.log({
                    url,
                    method,
                    body,
                    userId,
                    response
                });
            })
        );
    }
}