"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  Bell,
  ChevronDown,
  Command,
  Menu,
  Plus,
  Search,
  Sparkles,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { NotificationDropdown, ProfileDropdown } from "@/components/dashboard/interactive-overlays";

export function TopNavbar({
  onOpenSidebar,
  onCreateProject,
  onCreateProposal,
  onInviteClient,
  onToast,
}: {
  onOpenSidebar: () => void;
  onCreateProject: () => void;
  onCreateProposal: () => void;
  onInviteClient: () => void;
  onToast: (message: string) => void;
}) {
  const [commandOpen, setCommandOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setCommandOpen((open) => !open);
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <>
      <header className="sticky top-0 z-[300] border-b border-white/10 bg-zinc-950/55 backdrop-blur-2xl">
        <div className="flex h-20 items-center gap-3 px-4 sm:px-6">
          <Button
            aria-label="Open sidebar"
            size="icon"
            variant="glass"
            className="lg:hidden"
            onClick={onOpenSidebar}
          >
            <Menu className="h-5 w-5" />
          </Button>

          <button
            className="hidden h-11 min-w-0 flex-1 items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.055] px-4 text-left text-sm text-zinc-500 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] transition hover:border-cyan-300/25 hover:bg-cyan-300/[0.06] sm:flex"
            onClick={() => setCommandOpen(true)}
          >
            <Search className="h-4 w-4 text-zinc-400" />
            <span className="min-w-0 flex-1 truncate">Search clients, projects, invoices...</span>
            <span className="rounded-xl border border-white/10 bg-white/[0.06] px-2 py-1 text-xs text-zinc-400">
              Ctrl K
            </span>
          </button>

          <div className="ml-auto flex items-center gap-2">
            <Button
              aria-label="Open search"
              variant="glass"
              size="icon"
              className="sm:hidden"
              onClick={() => setCommandOpen(true)}
            >
              <Search className="h-5 w-5" />
            </Button>
            <Button variant="glass" size="sm" className="hidden sm:inline-flex" onClick={onCreateProject}>
              <Plus className="h-4 w-4" />
              New Project
            </Button>
            <div className="relative">
              <Button
                aria-label="Notifications"
                variant="glass"
                size="icon"
                className="relative"
                onClick={() => setNotificationsOpen((open) => !open)}
              >
                <Bell className="h-5 w-5" />
                <span className="absolute right-3 top-3 h-2 w-2 rounded-full bg-cyan-300 shadow-[0_0_12px_rgba(103,232,249,0.9)]" />
              </Button>
              <NotificationDropdown
                open={notificationsOpen}
                onClose={() => setNotificationsOpen(false)}
                onToast={onToast}
              />
            </div>
            <div className="relative">
              <button
                className="flex h-11 items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.055] px-2 pl-2.5 text-left transition hover:bg-white/[0.08]"
                onClick={() => setProfileOpen((open) => !open)}
              >
                <span className="grid h-8 w-8 place-items-center rounded-xl bg-gradient-to-br from-violet-400 to-cyan-300 text-xs font-bold text-zinc-950">
                  F
                </span>
                <span className="hidden sm:block">
                  <span className="block text-sm font-medium text-white">Fawwaz</span>
                  <span className="block text-xs text-zinc-500">Founder</span>
                </span>
                <ChevronDown className="hidden h-4 w-4 text-zinc-500 sm:block" />
              </button>
              <ProfileDropdown
                open={profileOpen}
                onClose={() => setProfileOpen(false)}
                onToast={onToast}
              />
            </div>
          </div>
        </div>
      </header>
      <CommandMenu
        open={commandOpen}
        onOpenChange={setCommandOpen}
        onCreateProposal={onCreateProposal}
        onInviteClient={onInviteClient}
        onToast={onToast}
      />
    </>
  );
}

function CommandMenu({
  open,
  onOpenChange,
  onCreateProposal,
  onInviteClient,
  onToast,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateProposal: () => void;
  onInviteClient: () => void;
  onToast: (message: string) => void;
}) {
  const router = useRouter();
  const commands = [
    {
      label: "Create new proposal",
      action: () => onCreateProposal(),
    },
    {
      label: "Open revenue analytics",
      action: () => {
        router.push("/analytics?highlight=revenue");
        onToast("Revenue analytics opened");
      },
    },
    {
      label: "Review overdue tasks",
      action: () => {
        router.push("/tasks?filter=overdue");
        onToast("Showing overdue tasks");
      },
    },
    {
      label: "Invite client to portal",
      action: () => onInviteClient(),
    },
  ];

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="fixed inset-0 z-[1200] grid place-items-start justify-center overflow-y-auto bg-black/60 px-3 py-5 pt-16 backdrop-blur-sm sm:px-4 sm:pt-28"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => onOpenChange(false)}
        >
          <motion.div
            className="w-full max-w-2xl overflow-hidden rounded-2xl border border-white/10 bg-zinc-950/95 shadow-[0_40px_120px_rgba(0,0,0,0.55)]"
            initial={{ y: 18, scale: 0.98, opacity: 0 }}
            animate={{ y: 0, scale: 1, opacity: 1 }}
            exit={{ y: 18, scale: 0.98, opacity: 0 }}
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center gap-3 border-b border-white/10 px-4 py-4">
              <Command className="h-5 w-5 text-cyan-200" />
              <input
                autoFocus
                className="min-w-0 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-zinc-600"
                placeholder="Type a command or search..."
              />
              <button
                aria-label="Close command menu"
                className="rounded-xl p-2 text-zinc-500 transition hover:bg-white/10 hover:text-white"
                onClick={() => onOpenChange(false)}
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="grid gap-2 p-3">
              {commands.map((item, index) => (
                <button
                  key={item.label}
                  className={cn(
                    "flex items-center gap-3 rounded-2xl px-3 py-3 text-left text-sm text-zinc-300 transition hover:bg-white/[0.07] hover:text-white",
                    index === 0 && "bg-cyan-300/[0.08] text-white",
                  )}
                  onClick={() => {
                    onOpenChange(false);
                    item.action();
                  }}
                >
                  <Sparkles className="h-4 w-4 text-cyan-200" />
                  {item.label}
                </button>
              ))}
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
