"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  ADMIN_EMAIL,
  getCases,
  getSessionEmail,
  getUserAiSetting,
  getUsers,
  saveCases,
  saveUserAiSetting,
  saveUsers,
  setSessionEmail,
  type UserAiSetting,
} from "@/lib/storage";
import type { AppUser, AttachedFile, Message, SavedCase, SearchTab } from "@/lib/types";

type AppContextValue = {
  ready: boolean;
  user: AppUser | null;
  users: AppUser[];
  cases: SavedCase[];
  tab: SearchTab;
  setTab: (tab: SearchTab) => void;
  caseNumber: string;
  setCaseNumber: (v: string) => void;
  court: string;
  setCourt: (v: string) => void;
  files: AttachedFile[];
  addFiles: (kind: AttachedFile["kind"], list: FileList | null) => void;
  removeFile: (id: string) => void;
  question: string;
  setQuestion: (v: string) => void;
  messages: Message[];
  busy: boolean;
  ask: (text?: string) => void;
  login: (email: string, password: string) => string | null;
  logout: () => void;
  changePassword: (next: string) => string | null;
  createMember: (email: string, password: string) => string | null;
  setUserStatus: (email: string, status: AppUser["status"]) => void;
  saveCurrentCase: () => string | null;
  openCase: (item: SavedCase) => void;
  aiSetting: UserAiSetting | null;
  saveAiSetting: (setting: UserAiSetting | null) => void;
};

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const [users, setUsers] = useState<AppUser[]>([]);
  const [user, setUser] = useState<AppUser | null>(null);
  const [cases, setCases] = useState<SavedCase[]>([]);
  const [tab, setTab] = useState<SearchTab>("case");
  const [caseNumber, setCaseNumber] = useState("");
  const [court, setCourt] = useState("");
  const [files, setFiles] = useState<AttachedFile[]>([]);
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [busy, setBusy] = useState(false);
  const [aiSetting, setAiSetting] = useState<UserAiSetting | null>(null);
  const fileBlobs = useRef<Record<string, File>>({});

  useEffect(() => {
    const list = getUsers();
    setUsers(list);
    const email = getSessionEmail();
    const current = list.find((u) => u.email === email) || null;
    if (current && current.status === "active") {
      setUser(current);
      setAiSetting(getUserAiSetting(current.email));
    } else setSessionEmail(null);
    setCases(getCases());
    setReady(true);
  }, []);

  const login = useCallback((email: string, password: string) => {
    const list = getUsers();
    const found = list.find((u) => u.email.toLowerCase() === email.trim().toLowerCase());
    if (!found) return "계정을 찾을 수 없습니다. 관리자에게 임시 비밀번호를 받으세요.";
    if (found.status === "suspended") return "정지된 계정입니다. 관리자에게 문의하세요.";
    if (found.password !== password) return "비밀번호가 올바르지 않습니다.";
    setUsers(list);
    setUser(found);
    setSessionEmail(found.email);
    setAiSetting(getUserAiSetting(found.email));
    return null;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setAiSetting(null);
    setSessionEmail(null);
  }, []);

  const saveAiSetting = useCallback(
    (setting: UserAiSetting | null) => {
      if (!user) return;
      saveUserAiSetting(user.email, setting);
      setAiSetting(setting && setting.apiKey.trim() ? setting : null);
    },
    [user]
  );

  const changePassword = useCallback(
    (next: string) => {
      if (!user) return "로그인이 필요합니다.";
      if (next.trim().length < 6) return "비밀번호는 6자 이상이어야 합니다.";
      const list = getUsers().map((u) =>
        u.email === user.email ? { ...u, password: next.trim() } : u
      );
      saveUsers(list);
      setUsers(list);
      setUser(list.find((u) => u.email === user.email) || null);
      return null;
    },
    [user]
  );

  const createMember = useCallback(
    (email: string, password: string) => {
      if (!user || user.role !== "admin") return "관리자만 회원을 추가할 수 있습니다.";
      const trimmed = email.trim().toLowerCase();
      if (!trimmed.includes("@")) return "이메일을 확인해 주세요.";
      if (password.trim().length < 4) return "임시 비밀번호를 입력해 주세요.";
      const list = getUsers();
      if (list.some((u) => u.email === trimmed)) return "이미 있는 계정입니다.";
      const next: AppUser = {
        email: trimmed,
        password: password.trim(),
        role: "member",
        status: "active",
        createdAt: new Date().toISOString(),
      };
      const updated = [...list, next];
      saveUsers(updated);
      setUsers(updated);
      return null;
    },
    [user]
  );

  const setUserStatus = useCallback(
    (email: string, status: AppUser["status"]) => {
      if (!user || user.role !== "admin") return;
      const list = getUsers().map((u) =>
        u.email === email && u.email !== ADMIN_EMAIL ? { ...u, status } : u
      );
      saveUsers(list);
      setUsers(list);
      if (status === "suspended" && getSessionEmail() === email) {
        setSessionEmail(null);
      }
    },
    [user]
  );

  const addFiles = useCallback((kind: AttachedFile["kind"], list: FileList | null) => {
    if (!list || list.length === 0) return;
    const extra: AttachedFile[] = Array.from(list).map((file) => {
      const id = `${kind}-${file.name}-${file.size}-${Math.random().toString(36).slice(2, 8)}`;
      fileBlobs.current[id] = file;
      return { id, kind, name: file.name, size: file.size, mime: file.type };
    });
    setFiles((prev) => [...prev, ...extra]);
  }, []);

  const removeFile = useCallback((id: string) => {
    delete fileBlobs.current[id];
    setFiles((prev) => prev.filter((f) => f.id !== id));
  }, []);

  const ask = useCallback(
    async (text?: string) => {
      const q = (text ?? question).trim();
      if (!q || busy) return;
      if (user?.status === "suspended") return;
      const userMsg: Message = {
        id: `u-${Date.now()}`,
        role: "user",
        text: q,
        createdAt: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, userMsg]);
      setQuestion("");
      setBusy(true);
      try {
        const form = new FormData();
        form.append("question", q);
        form.append("caseNumber", caseNumber);
        form.append("court", court);
        files.forEach((item) => {
          const blob = fileBlobs.current[item.id];
          if (!blob) return;
          form.append("kinds", item.kind);
          form.append("files", blob, item.name);
        });
        const res = await fetch("/api/analyze", {
          method: "POST",
          body: form,
          headers: aiSetting?.apiKey
            ? {
                "x-user-api-key": aiSetting.apiKey,
                "x-user-api-provider": aiSetting.provider,
              }
            : undefined,
        });
        const data = await res.json();
        const answerText =
          data.text ||
          data.error ||
          "분석을 가져오지 못했습니다. API 키와 파일 형식을 확인해 주세요.";
        setMessages((prev) => [
          ...prev,
          {
            id: `a-${Date.now()}`,
            role: "assistant",
            text: answerText,
            createdAt: new Date().toISOString(),
          },
        ]);
      } catch {
        setMessages((prev) => [
          ...prev,
          {
            id: `a-${Date.now()}`,
            role: "assistant",
            text: "분석 서버에 연결하지 못했습니다. 잠시 후 다시 시도해 주세요.",
            createdAt: new Date().toISOString(),
          },
        ]);
      } finally {
        setBusy(false);
      }
    },
    [aiSetting, busy, caseNumber, court, files, question, user]
  );

  const saveCurrentCase = useCallback(() => {
    if (!user) return "login";
    if (user.status === "suspended") return "정지된 계정입니다.";
    const number = caseNumber.trim() || "미지정";
    const courtName = court.trim() || "미지정";
    const item: SavedCase = {
      id: `${user.email}-${number}-${courtName}`,
      ownerEmail: user.email,
      caseNumber: number,
      court: courtName,
      files,
      messages,
      updatedAt: new Date().toISOString(),
    };
    const next = [item, ...getCases().filter((c) => c.id !== item.id)];
    saveCases(next);
    setCases(next);
    return null;
  }, [caseNumber, court, files, messages, user]);

  const openCase = useCallback((item: SavedCase) => {
    setTab("case");
    setCaseNumber(item.caseNumber === "미지정" ? "" : item.caseNumber);
    setCourt(item.court === "미지정" ? "" : item.court);
    fileBlobs.current = {};
    setFiles(item.files);
    setMessages(item.messages);
    setQuestion("");
  }, []);

  const value = useMemo(
    () => ({
      ready,
      user,
      users,
      cases,
      tab,
      setTab,
      caseNumber,
      setCaseNumber,
      court,
      setCourt,
      files,
      addFiles,
      removeFile,
      question,
      setQuestion,
      messages,
      busy,
      ask,
      login,
      logout,
      changePassword,
      createMember,
      setUserStatus,
      saveCurrentCase,
      openCase,
      aiSetting,
      saveAiSetting,
    }),
    [
      addFiles,
      ask,
      busy,
      caseNumber,
      cases,
      changePassword,
      court,
      createMember,
      files,
      login,
      logout,
      messages,
      openCase,
      question,
      ready,
      removeFile,
      saveCurrentCase,
      setUserStatus,
      tab,
      user,
      users,
    ]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
