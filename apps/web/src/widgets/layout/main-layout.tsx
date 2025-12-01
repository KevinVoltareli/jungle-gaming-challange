import { ReactNode } from "react";
import { Link, useRouter } from "@tanstack/react-router";
import { Button } from "../../shared/ui/button";
import { useAuth } from "../../libs/hooks/useAuth";

type MainLayoutProps = {
  children: ReactNode;
};

export function MainLayout({ children }: MainLayoutProps) {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.navigate({ to: "/login" });
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex h-14 w-full max-w-5xl items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <span className="text-sm font-semibold tracking-tight">
              Jungle Tasks
            </span>
            <nav className="flex items-center gap-3 text-sm text-slate-600">
              <Link
                to="/app/tasks"
                className="hover:text-slate-900 transition-colors"
              >
                Tasks
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-3 text-sm">
            {user && (
              <div className="flex flex-col items-end leading-tight">
                <span className="font-medium text-slate-900">
                  {user.username}
                </span>
                <span className="text-xs text-slate-500">{user.email}</span>
              </div>
            )}
            <Button variant="outline" size="sm" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-5xl flex-1 px-4 py-6">
        {children}
      </main>
    </div>
  );
}
