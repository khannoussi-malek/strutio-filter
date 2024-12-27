import { useMutation, useQueryClient } from '@tanstack/react-query';

export function useCreateFilter() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { name: string; filter: any }) => {
      const res = await fetch('/api/filters', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        throw new Error('Failed to save filter');
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['filters'] });
    },
  });
}
