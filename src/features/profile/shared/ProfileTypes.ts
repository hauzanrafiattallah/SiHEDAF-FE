export type UserProfile = {
  id: number;
  fullname: string;
  email: string;
  profileImage: string | null;
};

export type ProfileFieldErrors = Partial<
  Record<
    "fullname" | "old_password" | "new_password" | "confirm_password",
    string[]
  >
>;

export type ProfileSuccess = {
  success: true;
  user: UserProfile;
};

export type ProfileMutationSuccess = {
  success: true;
  message: string;
  user?: UserProfile;
};

export type ProfileFailure = {
  success: false;
  message: string;
  fieldErrors?: ProfileFieldErrors;
  status?: number;
};

export type ProfileResponse = ProfileSuccess | ProfileFailure;
export type ProfileMutationResponse = ProfileMutationSuccess | ProfileFailure;
