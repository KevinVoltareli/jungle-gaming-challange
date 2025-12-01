export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  size: number;
}

// Já tinha um TaskDto aqui (mantém o que você já tem)
export interface TaskDto {
  id: string;
  title: string;
  description?: string | null;
  status: "TODO" | "IN_PROGRESS" | "DONE"; // ajusta se tiver outros
  priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
  dueDate?: string | null;
  // se o backend já retornar algo de assignees, pode pôr aqui depois
}

// 👇 NOVO
export interface UserDto {
  id: string;
  email: string;
  username: string;
  roles: string[];
}
