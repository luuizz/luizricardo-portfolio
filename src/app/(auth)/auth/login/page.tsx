import { LoginForm } from "@/components/login-form";
import SidebarAuth from "@/app/(auth)/ui/SidebarAuth";

export default function LoginPage() {
  return (
    <div className="container relative flex-1 shrink-0 items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      <SidebarAuth />

      <div className="flex items-center justify-center">
        <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
          <div className="w-full max-w-sm">
            <LoginForm />
          </div>
        </div>
      </div>
    </div>
  );
}
