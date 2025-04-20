export interface Users {
    id: string;
    username: string;
    email: string;
    roles: string[];
  }
  
  export interface CreateUsersDTO {
    username: string;
    email: string;
    password: string;
    roles?: string[];
  }
  
  export interface UpdateUsersDTO extends Partial<CreateUsersDTO> {}