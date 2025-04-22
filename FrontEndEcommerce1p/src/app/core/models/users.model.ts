export interface Users {
  id: number;
  username: string;
  email: string;
  role: string;
}

export interface CreateUsersDTO {
  username: string;
  email: string;
  password: string;
  role?: string;
}

export interface UpdateUsersDTO extends Partial<CreateUsersDTO> {}