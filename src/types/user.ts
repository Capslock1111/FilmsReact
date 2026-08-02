export interface User {
    username: string;
    email: string;
    password?: string;
    avatar?: string | null;
    birthDate?: string;
    gender?: string;
    favouriteGenre?: string;
    registerAt?: string;
    updatedAt?: string;
}