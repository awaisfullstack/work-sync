export interface Department {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateDepartmentRequest {
  name: string;
}

export interface UpdateDepartmentRequest {
  id: string;
  body: Partial<CreateDepartmentRequest>;
}
