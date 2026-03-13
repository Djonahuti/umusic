import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";


export default function Logo() {

  return (
    <>
    <Avatar className="w-20 h-20">
      <AvatarImage src="/utmusic.png" />
      <AvatarFallback>UT</AvatarFallback>
    </Avatar>
    </>
  );
}