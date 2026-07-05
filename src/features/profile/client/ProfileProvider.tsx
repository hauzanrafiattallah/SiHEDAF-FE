"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";

import type { UserProfile } from "@/features/profile/shared/ProfileTypes";

import { fetchCurrentProfile } from "./services/ProfileClient";

type ProfileContextValue = {
  error: string | null;
  isLoading: boolean;
  reload: () => Promise<void>;
  updateUser: (changes: Partial<Pick<UserProfile, "fullname">>) => void;
  user: UserProfile | null;
};

const ProfileContext = createContext<ProfileContextValue | null>(null);

export function ProfileProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    const result = await fetchCurrentProfile();

    if (!result.success) {
      setIsLoading(false);
      if (result.status === 401) {
        router.replace("/login");
        return;
      }
      setError(result.message);
      return;
    }

    setUser(result.user);
    setIsLoading(false);
  }, [router]);

  useEffect(() => {
    let isActive = true;

    void fetchCurrentProfile().then((result) => {
      if (!isActive) return;

      if (!result.success) {
        setIsLoading(false);
        if (result.status === 401) {
          router.replace("/login");
          return;
        }
        setError(result.message);
        return;
      }

      setUser(result.user);
      setIsLoading(false);
    });

    return () => {
      isActive = false;
    };
  }, [router]);

  const updateUser = useCallback(
    (changes: Partial<Pick<UserProfile, "fullname">>) => {
      setUser((current) => (current ? { ...current, ...changes } : current));
    },
    [],
  );

  const value = useMemo(
    () => ({ error, isLoading, reload, updateUser, user }),
    [error, isLoading, reload, updateUser, user],
  );

  return (
    <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>
  );
}

export function useProfile() {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error("useProfile must be used inside ProfileProvider.");
  }
  return context;
}
