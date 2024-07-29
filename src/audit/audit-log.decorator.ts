// audit-log.decorator.ts
import { createParamDecorator, ExecutionContext, SetMetadata } from '@nestjs/common';

export const AuditLog = () => SetMetadata('auditLog', true);

export const CurrentUser = createParamDecorator(
    (data: unknown, ctx: ExecutionContext) => {
        const request = ctx.switchToHttp().getRequest();
        return request.user;
    },
);