// src/hooks/common/useBaseMutation.ts
import { UseMutationOptions, useMutation } from '@tanstack/react-query';
import { errorService } from '../../services/error.services';

export function useBaseMutation<TData, TVariables>(
    mutationFn: (variables: TVariables) => Promise<TData>,
    options?: Omit<UseMutationOptions<TData, unknown, TVariables>, 'mutationFn'>
) {
    return useMutation({
        mutationFn: async (variables) => {
            try {
                return await mutationFn(variables);
            } catch (error) {
                errorService.handleError(error);
                throw error;
            }
        },
        retry: false, 
        ...options
    });
}