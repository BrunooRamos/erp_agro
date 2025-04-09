import { getCusa } from '../../actions/index';
import { useBaseQuery } from '../index';

export const useCusa = () => {
  return useBaseQuery(
    ['cusa'],
    getCusa,
    {
      staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchOnReconnect: false,
  });
};