import { RouterProvider } from "@tanstack/react-router";
import { router } from "./router";
import { AppProvider } from "./providers/app-provider";

export function AppMain() {
  return (
    <AppProvider>
      <RouterProvider router={router} />
    </AppProvider>
  );
}
