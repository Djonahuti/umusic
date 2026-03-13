import { Added } from "@/components/shared/Added";
import { MobileNav } from "@/components/shared/MobileNav";

export default async function HomePage() {

  return (
    <>
    <MobileNav />
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Recently Added</h1>
      <Added />
    </div>
    </>
  );
}
