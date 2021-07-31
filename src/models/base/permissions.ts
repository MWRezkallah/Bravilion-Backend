export interface Rule {
    auth?: boolean;
    role?: string;
    owner?: boolean;
}

export interface Permissions {
    [key: string]: Rule[];
}