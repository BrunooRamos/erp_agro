import { useQuery } from '@tanstack/react-query';
import { getByIdMachinery } from '../../actions';

export const useGetMachinery = (code: string | undefined) => {
    return useQuery({
        queryKey: ['machinery', code],
        queryFn: () => getByIdMachinery(code!),
        enabled: !!code, // Only run query if code exists
    });
};