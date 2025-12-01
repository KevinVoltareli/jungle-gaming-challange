import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AppToaster } from "../../shared/ui/toaster";

const queryClient = new QueryClient();

type AppProviderProps = {
  children: React.ReactNode;
};

export function AppProvider({ children }: AppProviderProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <AppToaster />
      {children}
    </QueryClientProvider>
  );
}
