'use client';
import { Provider } from '@/components/ui/provider';

import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';

const queryClient = new QueryClient();
export default function RootLayout(props: {
  children: React.ReactNode;
}) {
  const { children } = props;
  return (
    <html suppressHydrationWarning>
      <body>
        <QueryClientProvider client={queryClient}>
          <Provider>{children}</Provider>
        </QueryClientProvider>
      </body>
    </html>
  );
}
