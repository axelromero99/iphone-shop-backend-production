// src/common/services/logger.service.ts
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class LoggerService extends Logger {
    error(message: string, trace: string) {
        // Aquí podrías implementar lógica adicional, como enviar errores a un servicio externo
        super.error(message, trace);
    }

    warn(message: string) {
        super.warn(message);
    }

    log(message: string) {
        super.log(message);
    }

    verbose(message: string) {
        super.verbose(message);
    }

    debug(message: string) {
        super.debug(message);
    }
}