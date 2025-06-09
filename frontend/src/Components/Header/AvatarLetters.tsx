import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { User } from "lucide-react";
import useStore from "@/hooks/useStore";
import type { IMember } from "@/models/member.model";

function stringToColor(string: string): string {
  let hash = 0;
  for (let i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }

  let color = "#";
  for (let i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.slice(-2);
  }
  return color;
}

function stringAvatar(name: string): { className: string; initials: string } {
  return {
    className: `bg-[${stringToColor(name)}] text-white`,
    initials: name.split(" ").length > 1 ? `${name.split(" ")[0][0]}${name.split(" ")[1][0]}` : name[0] || "G",
  };
}

interface MemberStore {
  loggedInMember: IMember | null;
}

export default function AvatarLetters() {
  const { loggedInMember } = useStore((state: MemberStore) => ({
    loggedInMember: state.loggedInMember,
  }));

  const avatarProps = loggedInMember && loggedInMember.firstName && loggedInMember.lastName ? stringAvatar(`${loggedInMember.firstName} ${loggedInMember.lastName}`) : { className: "bg-gray-500 text-white", initials: <User className="h-5 w-5" /> };

  return (
    <Avatar className="h-10 w-10 cursor-pointer">
      <AvatarImage src="" alt={loggedInMember ? `${loggedInMember.firstName} ${loggedInMember.lastName}` : "Default Avatar"} />
      <AvatarFallback className={avatarProps.className}>{typeof avatarProps.initials === "string" ? avatarProps.initials : avatarProps.initials}</AvatarFallback>
    </Avatar>
  );
}
