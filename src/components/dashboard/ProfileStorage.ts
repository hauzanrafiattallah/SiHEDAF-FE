export type ProfileData = {
  avatarDataUrl: string;
  email: string;
  fullName: string;
};

export const defaultProfile: ProfileData = {
  avatarDataUrl: "",
  email: "armand@email.com",
  fullName: "Armand Setya Nugraha",
};

export const defaultProfileSnapshot = JSON.stringify(defaultProfile);
const profileStorageKey = "sihedaf-profile";
const profileUpdateEvent = "sihedaf-profile-update";

export function getProfileSnapshot() {
  if (typeof window === "undefined") return defaultProfileSnapshot;
  return window.localStorage.getItem(profileStorageKey) ?? defaultProfileSnapshot;
}

export function parseProfileSnapshot(snapshot: string): ProfileData {
  try {
    const parsed = JSON.parse(snapshot) as Partial<ProfileData>;

    return {
      avatarDataUrl: typeof parsed.avatarDataUrl === "string" ? parsed.avatarDataUrl : "",
      email: typeof parsed.email === "string" ? parsed.email : defaultProfile.email,
      fullName: typeof parsed.fullName === "string" ? parsed.fullName : defaultProfile.fullName,
    };
  } catch {
    return defaultProfile;
  }
}

export function saveProfile(profile: ProfileData) {
  window.localStorage.setItem(profileStorageKey, JSON.stringify(profile));
  window.dispatchEvent(new Event(profileUpdateEvent));
}

export function subscribeProfile(onStoreChange: () => void) {
  window.addEventListener(profileUpdateEvent, onStoreChange);
  window.addEventListener("storage", onStoreChange);

  return () => {
    window.removeEventListener(profileUpdateEvent, onStoreChange);
    window.removeEventListener("storage", onStoreChange);
  };
}

