
export interface Ministry {
    id: string;
    name: string;
    description: string;
    leaderArray?: LeaderArray[];
    memberCountArray?: MemberCountArray[];
    created_at?: string;
    updated_at?: string;
}

interface LeaderArray {
    profile: Profile;
}

interface Profile {
    id: string;
    legalName: string;
}

interface MemberCountArray {
    count: number;
}

export interface CreateMinistryDto {
    name: string;
    description: string;
    leader?: string;
}

export interface UpdateMinistryDto {
    name?: string;
    description?: string;
    leader?: string;
}
