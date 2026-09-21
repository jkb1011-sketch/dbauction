import type { AppUser, SavedCase } from "./types";

const USERS_KEY = "dba_users";
const SESSION_KEY = "dba_session";
const CASES_KEY = "dba_cases";
const USER_AI_KEY = "dba_user_ai";

export type UserAiSetting = {
  provider: "xai" | "openai";
  apiKey: string;
};

export function getUserAiSetting(email: string): UserAiSetting | null {
  const all = readJson<Record<string, UserAiSetting>>(USER_AI_KEY, {});
  return all[email] || null;
}

export function saveUserAiSetting(email: string, setting: UserAiSetting | null) {
  const all = readJson<Record<string, UserAiSetting>>(USER_AI_KEY, {});
  if (setting && setting.apiKey.trim()) all[email] = { provider: setting.provider, apiKey: setting.apiKey.trim() };
  else delete all[email];
  writeJson(USER_AI_KEY, all);
}

export const ADMIN_EMAIL = "admin@dbauction.ai.kr";
export const ADMIN_BOOTSTRAP_PASSWORD = "dbauction-admin";

function readJson<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function writeJson(key: string, value: unknown) {
  localStorage.setItem(key, JSON.stringify(value));
}

export function bootstrapUsers(): AppUser[] {
  const existing = readJson<AppUser[]>(USERS_KEY, []);
  if (existing.length > 0) return existing;
  const admin: AppUser = {
    email: ADMIN_EMAIL,
    password: ADMIN_BOOTSTRAP_PASSWORD,
    role: "admin",
    status: "active",
    createdAt: new Date().toISOString(),
  };
  writeJson(USERS_KEY, [admin]);
  return [admin];
}

export function getUsers(): AppUser[] {
  return bootstrapUsers();
}

export function saveUsers(users: AppUser[]) {
  writeJson(USERS_KEY, users);
}

export function getSessionEmail(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(SESSION_KEY);
}

export function setSessionEmail(email: string | null) {
  if (email) localStorage.setItem(SESSION_KEY, email);
  else localStorage.removeItem(SESSION_KEY);
}

export function getCases(): SavedCase[] {
  return readJson<SavedCase[]>(CASES_KEY, []);
}

export function saveCases(cases: SavedCase[]) {
  writeJson(CASES_KEY, cases);
}

export const COURTS = [
  "서울중앙지방법원",
  "서울동부지방법원",
  "서울서부지방법원",
  "서울남부지방법원",
  "서울북부지방법원",
  "의정부지방법원",
  "인천지방법원",
  "수원지방법원",
  "춘천지방법원",
  "대전지방법원",
  "청주지방법원",
  "대구지방법원",
  "부산지방법원",
  "울산지방법원",
  "창원지방법원",
  "광주지방법원",
  "전주지방법원",
  "제주지방법원",
];

export const SUGGESTED_QUESTIONS = [
  "올린 PDF 요약해줘",
  "등기부 문제점 찾아줘",
  "사진으로 보는 현황은?",
  "권리관계 정리해줘",
];
