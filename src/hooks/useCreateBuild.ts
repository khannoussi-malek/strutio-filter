import { useMutation, useQueryClient } from '@tanstack/react-query';

interface BuildAttributes {
  attributeId: string;
  value: string;
}

interface BuildData {
  name: string;
  description: string;
  attributes: BuildAttributes[];
}

interface UseCreateBuildOptions {
  onSuccess?: () => void;
}

export const useCreateBuild = (options?: UseCreateBuildOptions) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (buildData: BuildData) => {
      const response = await fetch('/api/builds', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(buildData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create build');
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['builds'] });
      options?.onSuccess?.();
    },
  });
};
