import React from "react";
import {
  Outlet,
  createRootRoute,
  createRoute,
  createRouter,
  redirect,
} from "@tanstack/react-router";
import { useAuthStore } from "../libs/store/auth.store";
import { LoginPage } from "../pages/auth/login.page";
import { RegisterPage } from "../pages/auth/register.page";
import { TasksListPage } from "../pages/tasks/tasks-list.page";
import { TaskDetailsPage } from "../pages/tasks/task-details.page";
import { TaskCreatePage } from "../pages/tasks/task-create.page";
import { MainLayout } from "../widgets/layout/main-layout";

const rootRoute = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  return <Outlet />;
}

// Redireciona "/" -> "/login"
const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  beforeLoad: () => {
    throw redirect({ to: "/login" });
  },
});

// Login
const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/login",
  component: LoginPage,
});

// Register
const registerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/register",
  component: RegisterPage,
});

// Rotas protegidas /app/*
const appRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/app",
  beforeLoad: () => {
    const { status } = useAuthStore.getState();
    if (status !== "authenticated") {
      throw redirect({ to: "/login" });
    }
  },
  component: AppRouteComponent,
});

function AppRouteComponent() {
  return (
    <MainLayout>
      <Outlet />
    </MainLayout>
  );
}

// /app/tasks
const tasksListRoute = createRoute({
  getParentRoute: () => appRoute,
  path: "/tasks",
  component: TasksListPage,
});

const taskCreateRoute = createRoute({
  getParentRoute: () => appRoute,
  path: "tasks/create",
  component: TaskCreatePage,
});

// /app/tasks/$taskId
const taskDetailsRoute = createRoute({
  getParentRoute: () => appRoute,
  path: "/tasks/$taskId",
  component: TaskDetailsPage,
});

// Monta árvore
const routeTree = rootRoute.addChildren([
  indexRoute,
  loginRoute,
  registerRoute,
  appRoute.addChildren([tasksListRoute, taskDetailsRoute, taskCreateRoute]),
]);

export const router = createRouter({
  routeTree,
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
