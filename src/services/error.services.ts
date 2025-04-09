// src/services/error.service.ts
import { AxiosError } from 'axios';
import { toast } from 'react-toastify';

interface DolibarrErrorResponse {
    error: {
        code: number;
        message: string;
    };
    debug: {
        source: string;
        stages: {
            success: string[];
            failure: string[];
        };
    };
}

class ErrorService {
    private static instance: ErrorService;

    private constructor() {}

    public static getInstance(): ErrorService {
        if (!ErrorService.instance) {
            ErrorService.instance = new ErrorService();
        }
        return ErrorService.instance;
    }

    public handleError(error: unknown): void {
        if (error instanceof AxiosError && error.response?.data) {
            const dolibarrError = error.response.data as DolibarrErrorResponse;
            toast.error(dolibarrError.error.message);
            return;
        }

        // Para otros tipos de errores
        const message = error instanceof Error ? error.message : 'Error desconocido';
        toast.error(message);
    }
}

export const errorService = ErrorService.getInstance();