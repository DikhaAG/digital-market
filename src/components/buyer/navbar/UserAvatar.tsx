import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface UserAvatarProps {
  user?: {
    name: string;
    avatarUrl?: string;
  };
  size?: "sm" | "md" | "lg";
  showBadge?: boolean;
}

export function UserAvatar({
  user,
  size = "sm",
  showBadge = false,
}: UserAvatarProps) {
  const initial = user?.name ? user.name.charAt(0).toUpperCase() : "U";

  const sizeClasses = {
    sm: "h-9 w-9",
    md: "h-10 w-10",
    lg: "h-14 w-14",
  };

  const fallbackTextSizes = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg",
  };

  return (
    <div className="relative inline-block">
      <Avatar className={sizeClasses[size]}>
        <AvatarImage src={user?.avatarUrl} alt={user?.name || "User"} />
        <AvatarFallback
          className={`bg-muted text-muted-foreground font-semibold ${fallbackTextSizes[size]}`}
        >
          {initial}
        </AvatarFallback>
      </Avatar>
      {showBadge && (
        <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-brand ring-2 ring-background" />
      )}
    </div>
  );
}
