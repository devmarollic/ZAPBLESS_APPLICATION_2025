
export interface Ministry {
    id: string;
    name: string;
    description: string;
    color: string;
    churchId: string;
}

export interface CreateMinistryDto {
    name: string;
    description: string;
    color: string;
    leader?: string;
}

export interface UpdateMinistryDto {
    name?: string;
    description?: string;
    color?: string;
    leader?: string;
}
