type ProfileAvatarProps = {
  className?: string;
  fullname: string;
  profileImage?: string | null;
};

export function profileInitials(fullname: string) {
  const words = fullname.trim().split(/\s+/).filter(Boolean);
  return (
    words
      .slice(0, 2)
      .map((word) => word[0]?.toUpperCase())
      .join("") || "U"
  );
}

export function ProfileAvatar({
  className = "h-20 w-20 text-[17px]",
  fullname,
  profileImage,
}: ProfileAvatarProps) {
  return (
    <span
      aria-label={profileImage ? `Foto profil ${fullname}` : undefined}
      className={`grid shrink-0 place-items-center rounded-full border-4 border-white/80 bg-[radial-gradient(circle_at_32%_28%,#d9efff_0_16%,transparent_17%),linear-gradient(145deg,#8ab8dd,#315a85)] bg-cover bg-center font-semibold text-white shadow-sm ${className}`}
      role={profileImage ? "img" : undefined}
      style={
        profileImage
          ? { backgroundImage: `url("${profileImage.replaceAll('"', "%22")}")` }
          : undefined
      }
    >
      {profileImage ? null : profileInitials(fullname)}
    </span>
  );
}
