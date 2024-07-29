// audit-log.interceptor.ts
import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Reflector } from '@nestjs/core';
import { AuditLogService } from './audit-log.service';

@Injectable()
export class AuditLogInterceptor implements NestInterceptor {
    constructor(
        private reflector: Reflector,
        private auditLogService: AuditLogService
    ) { }

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const auditLog = this.reflector.get<boolean>('auditLog', context.getHandler());

        if (!auditLog) {
            return next.handle();
        }

        const request = context.switchToHttp().getRequest();
        const { url, method, body, user } = request;

        return next.handle().pipe(
            tap(response => {
                this.auditLogService.log({
                    url,
                    method,
                    body,
                    user: user?.id,
                    response
                });
            })
        );
    }
}