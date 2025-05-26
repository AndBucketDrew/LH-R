export interface IMember {
    id: string;
    username: string;
    firstName: string;
    lastName: string;
    adress?: {
        city: string;
    };
}
