"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  CalendarDays,
  CreditCard,
  Files,
  FolderKanban,
  Home,
  ListTodo,
  PanelLeftClose,
  PanelLeftOpen,
  ReceiptText,
  Settings,
  UsersRound,
  WalletCards,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const navItems = [
  { label: "Dashboard", href: "/", icon: Home },
  { label: "Clients", href: "/clients", icon: UsersRound },
  { label: "Projects", href: "/projects", icon: FolderKanban },
  { label: "Tasks", href: "/tasks", icon: ListTodo },
  { label: "Finance", href: "/finance", icon: WalletCards },
  { label: "Invoices", href: "/invoices", icon: ReceiptText },
  { label: "Analytics", href: "/analytics", icon: BarChart3 },
  { label: "Calendar", href: "/calendar", icon: CalendarDays },
  { label: "Files", href: "/files", icon: Files },
  { label: "Settings", href: "/settings", icon: Settings },
];

type DashboardSidebarProps = {
  collapsed: boolean;
  mobileOpen: boolean;
  onToggleCollapsed: () => void;
  onCloseMobile: () => void;
};

export function DashboardSidebar({
  collapsed,
  mobileOpen,
  onToggleCollapsed,
  onCloseMobile,
}: DashboardSidebarProps) {
  return (
    <>
      <aside
        className={cn(
          "fixed inset-y-4 left-4 z-40 hidden overflow-hidden rounded-2xl border border-white/10 bg-zinc-950/70 shadow-[0_30px_100px_rgba(0,0,0,0.45)] backdrop-blur-2xl transition-all duration-300 lg:block",
          collapsed ? "w-[92px]" : "w-[280px]",
        )}
      >
        <SidebarContent
          collapsed={collapsed}
          onToggleCollapsed={onToggleCollapsed}
        />
      </aside>

      <AnimatePresence>
        {mobileOpen ? (
          <>
            <motion.button
              aria-label="Close sidebar overlay"
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onCloseMobile}
            />
            <motion.aside
              className="fixed inset-y-3 left-3 z-50 w-[calc(100vw-1.5rem)] max-w-[330px] overflow-hidden rounded-2xl border border-white/10 bg-zinc-950/90 shadow-2xl backdrop-blur-2xl lg:hidden"
              initial={{ x: -360, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -360, opacity: 0 }}
              transition={{ type: "spring", damping: 24, stiffness: 220 }}
            >
              <SidebarContent
                collapsed={false}
                onToggleCollapsed={onCloseMobile}
                mobile
              />
            </motion.aside>
          </>
        ) : null}
      </AnimatePresence>
    </>
  );
}

function SidebarContent({
  collapsed,
  onToggleCollapsed,
  mobile = false,
}: {
  collapsed: boolean;
  onToggleCollapsed: () => void;
  mobile?: boolean;
}) {
  const pathname = usePathname();

  return (
    <div className="flex h-full flex-col">
      <div className="flex h-20 items-center justify-between gap-3 border-b border-white/10 px-4">
        <div className="flex min-w-0 items-center gap-3">
          <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-cyan-300 via-blue-500 to-violet-500 text-sm font-black text-white shadow-[0_0_40px_rgba(34,211,238,0.35)]">
            FC
          </div>
          {!collapsed ? (
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-white">FawwazCode</p>
              <p className="truncate text-xs text-zinc-500">Freelance command center</p>
            </div>
          ) : null}
        </div>
        <Button
          aria-label={mobile ? "Close sidebar" : "Collapse sidebar"}
          size="icon"
          variant="ghost"
          onClick={onToggleCollapsed}
          className="shrink-0"
        >
          {mobile ? <X className="h-4 w-4" /> : collapsed ? <PanelLeftOpen className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}
        </Button>
      </div>

      <nav className="flex-1 space-y-2 overflow-y-auto px-3 py-5">
        {navItems.map((item, index) => {
          const active = pathname === item.href;

          return (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.025 }}
            whileHover={{ x: collapsed ? 0 : 3 }}
          >
            <Link
              href={item.href}
              onClick={mobile ? onToggleCollapsed : undefined}
              className={cn(
                "group relative flex h-12 w-full items-center gap-3 rounded-2xl px-3 text-left text-sm font-medium text-zinc-400 transition-all hover:bg-white/[0.07] hover:text-white",
                active && "bg-cyan-300/10 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_0_32px_rgba(34,211,238,0.12)]",
                collapsed && "justify-center px-0",
              )}
            >
              {active ? (
                <span className="absolute inset-y-2 left-0 w-1 rounded-full bg-cyan-300 shadow-[0_0_18px_rgba(103,232,249,0.9)]" />
              ) : null}
              <item.icon className="h-5 w-5 shrink-0" />
              {!collapsed ? <span className="truncate">{item.label}</span> : null}
            </Link>
          </motion.div>
        )})}
      </nav>

      <div className="m-3 rounded-2xl border border-cyan-300/15 bg-cyan-300/[0.06] p-4 shadow-[0_0_50px_rgba(34,211,238,0.08)]">
        {!collapsed ? (
          <>
            <div className="mb-3 flex items-center gap-2 text-xs font-medium uppercase tracking-[0.18em] text-cyan-200">
              <CreditCard className="h-4 w-4" />
              Pro Suite
            </div>
            <p className="text-sm font-semibold text-white">Pipeline health is excellent.</p>
            <p className="mt-1 text-xs leading-5 text-zinc-400">8 high-value opportunities are ready for follow-up.</p>
          </>
        ) : (
          <CreditCard className="mx-auto h-5 w-5 text-cyan-200" />
        )}
      </div>
    </div>
  );
}
