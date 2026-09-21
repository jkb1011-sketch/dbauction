export type UserRole = "admin" | "member";
export type UserStatus = "active" | "suspended";
export type SearchTab = "case" | "court";
export type FileKind = "pdf" | "registry" | "photo";

export type AppUser = {
  email: string;
  password: string;
  role: UserRole;
  status: UserStatus;
  createdAt: string;
  mustChangePassword?: boolean;
};

export type AttachedFile = {
  id: string;
  kind: FileKind;
  name: string;
  size: number;
  mime?: string;
};

export type Message = {
  id: string;
  role: "user" | "assistant";
  text: string;
  createdAt: string;
};

export type SavedCase = {
  id: string;
  ownerEmail: string;
  caseNumber: string;
  court: string;
  files: AttachedFile[];
  messages: Message[];
  updatedAt: string;
};
