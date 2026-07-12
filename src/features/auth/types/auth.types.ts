export interface User {
    id: string;
    name: string;
    email: string;
    role: 'admin' | 'staff' | 'customer';
}

export interface LoginResponse {
    user: User;
}