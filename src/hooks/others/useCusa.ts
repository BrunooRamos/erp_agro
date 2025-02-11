import { useQuery } from '@tanstack/react-query';
import { getCusa } from '../../actions/index';

export const useCusa = () => {
  return useQuery({
    queryKey: ['cusa'],
    queryFn: () => getCusa(),
    staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });
};