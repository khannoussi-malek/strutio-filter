import { useQuery } from '@tanstack/react-query';

export function useAttributes() {
  return useQuery({
    queryKey: ['attributes'],
    queryFn: async () => {
      const res = await fetch('/api/attributes');
      if (!res.ok) {
        throw new Error('Failed to fetch attributes');
      }
      return res.json();
    },
  });
}
