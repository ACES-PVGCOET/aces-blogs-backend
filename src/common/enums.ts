export enum UserRole {
  READER = 'READER',
  WRITER = 'WRITER', // the "author" role
  REVIEWER = 'REVIEWER',
  ADMIN = 'ADMIN',
}

export enum UserStatus {
  ACTIVE = 'ACTIVE',
  DELETED = 'DELETED',
  BLOCKED = 'BLOCKED',
}
