import { redirect } from "next/navigation";
import { isSupabaseConfigured, supabaseServer } from "@/lib/supabase/server";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminPalette from "@/components/admin/AdminPalette";
import { ToastProvider } from "@/components/admin/Toast";

export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  if (!isSupabaseConfigured()) redirect("/admin/login");

  const db = await supabaseServer();
  const {
    data: { user },
  } = await db.auth.getUser();
  if (!user) redirect("/admin/login");

  return (
    <ToastProvider>
      <div className="flex min-h-dvh bg-base">
        <AdminSidebar userEmail={user.email ?? "admin"} />
        <AdminPalette />
        <div className="min-w-0 flex-1">
          <div className="lg:hidden border-b border-white/[0.07] px-5 py-4 text-sm text-muted">
            Portfolio CMS — best experienced on a larger screen.
          </div>
          <main className="mx-auto w-full max-w-4xl px-5 py-8 md:px-8 md:py-10">{children}</main>
        </div>
      </div>
    </ToastProvider>
  );
}
