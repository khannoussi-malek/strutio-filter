import { useQuery } from '@tanstack/react-query';

export function useBuilds(filter?: string) {
  return useQuery({
    queryKey: ['builds', filter],
    queryFn: async () => {
      const url = filter
        ? `/api/builds?filter=${filter}`
        : '/api/builds';
      const res = await fetch(url);
      return res.json();
    },
  });
}
