import LogoLuiz from "@/app/assets/LogoLuiz";
import Link from "next/link";

export default function SidebarAuth() {
  return (
    <div className="relative hidden h-full flex-col justify-between bg-black p-10 text-primary dark:border-r dark:border-gray-800 lg:flex">
      <Link
        href={"/"}
        title={"Voltar para página principal"}
        className="relative z-20 flex items-center text-lg font-medium"
      >
        <LogoLuiz className="w-full max-w-36" />
      </Link>

      <div className="z-20">
        <blockquote className="text-balance leading-normal text-white/80">
          “This library has saved me countless hours of work and helped me
          deliver stunning designs to my clients faster than ever before.” -
          Sofia Davis
        </blockquote>
      </div>
    </div>
  );
}
