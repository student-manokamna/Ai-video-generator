import { SidebarDemo } from "@/module/dashboard/Navbar";

export default function SharedLayout({ children }: { children: React.ReactNode }) {
    return <div className="flex h-screen w-full overflow-hidden border border-neutral-200 bg-gray-100 dark:border-neutral-700 dark:bg-neutral-800">
          <SidebarDemo />
          <main className="flex-1 overflow-auto">
            {children}
          </main>
        </div>
}