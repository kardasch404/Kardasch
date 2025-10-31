export const ROLES = {
    ADMIN: 'ADMIN',
    VISITOR: 'VISITOR'
} as const;

export type RoleType = typeof ROLES[keyof typeof ROLES];
