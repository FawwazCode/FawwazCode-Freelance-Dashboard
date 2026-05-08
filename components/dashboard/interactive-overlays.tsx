"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  BellRing,
  CalendarDays,
  Check,
  ChevronLeft,
  ChevronRight,
  Loader2,
  LogOut,
  Moon,
  Send,
  Settings,
  Shield,
  UserRound,
  X,
} from "lucide-react";
import { FormEvent, useState } from "react";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Priority, ProjectStatus } from "@/types/dashboard";

export type ToastMessage = {
  id: number;
  message: string;
};

const fieldClass =
  "h-11 w-full rounded-2xl border border-white/10 bg-white/[0.06] px-4 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-cyan-300/40 focus:bg-cyan-300/[0.06]";

export function ModalShell({
  open,
  title,
  subtitle,
  children,
  onClose,
}: {
  open: boolean;
  title: string;
  subtitle: string;
  children: ReactNode;
  onClose: () => void;
}) {
  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="fixed inset-0 z-[80] grid place-items-center overflow-y-auto bg-black/65 px-3 py-4 backdrop-blur-md sm:px-4 sm:py-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="my-auto max-h-[calc(100dvh-2rem)] w-full max-w-xl overflow-hidden rounded-2xl border border-white/10 bg-zinc-950/95 shadow-[0_40px_140px_rgba(0,0,0,0.65)]"
            initial={{ y: 24, scale: 0.96, opacity: 0 }}
            animate={{ y: 0, scale: 1, opacity: 1 }}
            exit={{ y: 24, scale: 0.96, opacity: 0 }}
            transition={{ type: "spring", damping: 24, stiffness: 240 }}
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4 border-b border-white/10 p-4 sm:p-5">
              <div>
                <h2 className="text-xl font-semibold text-white">{title}</h2>
                <p className="mt-1 text-sm text-zinc-500">{subtitle}</p>
              </div>
              <Button aria-label="Close modal" variant="ghost" size="icon" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="max-h-[calc(100dvh-9rem)] overflow-y-auto">
              {children}
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

export function ProposalModal({
  open,
  onClose,
  onSubmit,
}: {
  open: boolean;
  onClose: () => void;
  onSubmit: (proposal: { client: string; title: string; budget: string; deadline: string; notes: string }) => void;
}) {
  const [loading, setLoading] = useState(false);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setLoading(true);
    setTimeout(() => {
      onSubmit({
        client: String(form.get("client") || "New Client"),
        title: String(form.get("title") || "Premium Proposal"),
        budget: String(form.get("budget") || "Rp128 jt"),
        deadline: String(form.get("deadline") || "May 28"),
        notes: String(form.get("notes") || "Discovery and delivery plan."),
      });
      setLoading(false);
      onClose();
    }, 700);
  }

  return (
    <ModalShell open={open} onClose={onClose} title="Create proposal" subtitle="Shape a polished proposal from dummy local data.">
      <form className="grid gap-4 p-4 sm:p-5" onSubmit={submit}>
        <input name="client" className={fieldClass} placeholder="Client name" required />
        <input name="title" className={fieldClass} placeholder="Project title" required />
        <div className="grid gap-4 sm:grid-cols-2">
          <input name="budget" className={fieldClass} placeholder="Budget" required />
          <input name="deadline" className={fieldClass} placeholder="Deadline" required />
        </div>
        <textarea name="notes" className={cn(fieldClass, "min-h-28 resize-none py-3")} placeholder="Notes" />
        <Button className="mt-1" disabled={loading}>
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          {loading ? "Creating..." : "Create Proposal"}
        </Button>
      </form>
    </ModalShell>
  );
}

export function InviteModal({
  open,
  onClose,
  onSubmit,
}: {
  open: boolean;
  onClose: () => void;
  onSubmit: (email: string, role: string) => void;
}) {
  const [loading, setLoading] = useState(false);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setLoading(true);
    setTimeout(() => {
      onSubmit(String(form.get("email") || "client@example.com"), String(form.get("role") || "Viewer"));
      setLoading(false);
      onClose();
    }, 650);
  }

  return (
    <ModalShell open={open} onClose={onClose} title="Invite client" subtitle="Send a polished portal invite with local feedback.">
      <form className="grid gap-4 p-4 sm:p-5" onSubmit={submit}>
        <input name="email" type="email" className={fieldClass} placeholder="client@company.com" required />
        <select name="role" className={fieldClass} defaultValue="Collaborator">
          <option>Viewer</option>
          <option>Collaborator</option>
          <option>Approver</option>
        </select>
        <Button disabled={loading}>
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          {loading ? "Inviting..." : "Invite Client"}
        </Button>
      </form>
    </ModalShell>
  );
}

export function ProjectModal({
  open,
  onClose,
  onSubmit,
}: {
  open: boolean;
  onClose: () => void;
  onSubmit: (project: {
    name: string;
    client: string;
    status: ProjectStatus;
    priority: Priority;
    deadline: string;
    description: string;
  }) => void;
}) {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<ProjectStatus>("Ongoing");
  const [priority, setPriority] = useState<Priority>("High");

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setLoading(true);
    setTimeout(() => {
      onSubmit({
        name: String(form.get("name") || "New Client Portal"),
        client: String(form.get("client") || "Nova Labs"),
        status,
        priority,
        deadline: String(form.get("deadline") || "May 30"),
        description: String(form.get("description") || "Premium project created locally."),
      });
      setLoading(false);
      onClose();
    }, 800);
  }

  return (
    <ModalShell open={open} onClose={onClose} title="New project" subtitle="Create a local project and animate it into the board.">
      <form className="grid gap-4 p-4 sm:p-5" onSubmit={submit}>
        <input name="name" className={fieldClass} placeholder="Project name" required />
        <input name="client" className={fieldClass} placeholder="Client" required />
        <div className="grid gap-4">
          <OptionGroup
            label="Status"
            value={status}
            options={["Ongoing", "Completed", "Revision", "Pending"]}
            onChange={(value) => setStatus(value as ProjectStatus)}
          />
          <OptionGroup
            label="Priority"
            value={priority}
            options={["Low", "Medium", "High"]}
            onChange={(value) => setPriority(value as Priority)}
          />
        </div>
        <input name="deadline" className={fieldClass} placeholder="Deadline" required />
        <textarea name="description" className={cn(fieldClass, "min-h-24 resize-none py-3")} placeholder="Description" />
        <Button disabled={loading}>
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
          {loading ? "Launching..." : "Create Project"}
        </Button>
      </form>
    </ModalShell>
  );
}

function OptionGroup<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: T;
  options: T[];
  onChange: (value: T) => void;
}) {
  return (
    <div>
      <p className="mb-2 text-xs font-medium uppercase tracking-[0.18em] text-zinc-500">
        {label}
      </p>
      <div
        className={cn(
          "grid gap-2 rounded-2xl border border-white/10 bg-white/[0.035] p-1.5",
          options.length === 3 ? "sm:grid-cols-3" : "sm:grid-cols-4",
        )}
      >
        {options.map((option) => {
          const active = option === value;

          return (
            <button
              key={option}
              type="button"
              className={cn(
                "relative h-10 overflow-hidden rounded-xl px-3 text-sm font-medium text-zinc-400 transition hover:bg-white/[0.07] hover:text-white",
                active && "text-white shadow-[0_0_28px_rgba(34,211,238,0.14)]",
                label === "Priority" && "sm:col-span-1",
              )}
              onClick={() => onChange(option)}
            >
              {active ? (
                <motion.span
                  layoutId={`${label}-active-option`}
                  className="absolute inset-0 rounded-xl border border-cyan-300/25 bg-cyan-300/[0.12]"
                  transition={{ type: "spring", damping: 26, stiffness: 320 }}
                />
              ) : null}
              <span className="relative z-10">{option}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function ExportOverlay({
  open,
  progress,
  format,
}: {
  open: boolean;
  progress: number;
  format: "pdf" | "excel";
}) {
  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="fixed inset-x-3 bottom-3 z-[75] mx-auto max-w-md rounded-2xl border border-cyan-300/20 bg-zinc-950/90 p-4 shadow-[0_24px_80px_rgba(0,0,0,0.45)] backdrop-blur-2xl sm:inset-x-4 sm:bottom-5"
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 40, opacity: 0 }}
        >
          <div className="flex items-center gap-3">
            <Loader2 className="h-5 w-5 animate-spin text-cyan-200" />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-white">
                Exporting {format === "pdf" ? "PDF" : "Excel"} report
              </p>
              <p className="text-xs text-zinc-500">
                Generating file from local dashboard data...
              </p>
            </div>
            <span className="text-sm text-cyan-100">{progress}%</span>
          </div>
          <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/10">
            <motion.div className="h-full rounded-full bg-gradient-to-r from-cyan-300 to-violet-400" animate={{ width: `${progress}%` }} />
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

export function CalendarDropdown({
  open,
  selectedDate,
  onSelect,
}: {
  open: boolean;
  selectedDate: Date;
  onSelect: (date: Date) => void;
}) {
  const [viewDate, setViewDate] = useState(
    () => new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1),
  );
  const monthName = viewDate.toLocaleString("en-US", { month: "long" });
  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay();
  const days = Array.from({ length: daysInMonth }, (_, index) => index + 1);
  const leadingBlanks = Array.from({ length: firstDay }, (_, index) => index);

  function moveMonth(direction: number) {
    setViewDate((date) => new Date(date.getFullYear(), date.getMonth() + direction, 1));
  }

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="absolute left-0 top-full z-[999] mt-3 w-[min(calc(100vw-1.5rem),20rem)] rounded-2xl border border-white/10 bg-zinc-950/95 p-4 shadow-[0_30px_100px_rgba(0,0,0,0.55)] backdrop-blur-2xl sm:left-auto sm:right-0 sm:w-80"
          initial={{ y: -8, opacity: 0, scale: 0.98 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: -8, opacity: 0, scale: 0.98 }}
        >
          <div className="mb-4 flex items-center justify-between">
            <button
              type="button"
              className="rounded-xl p-2 text-zinc-500 hover:bg-white/10 hover:text-white"
              onClick={() => moveMonth(-1)}
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <div className="flex items-center gap-2 text-sm font-semibold text-white">
              <CalendarDays className="h-4 w-4 text-cyan-200" />
              {monthName} {year}
            </div>
            <button
              type="button"
              className="rounded-xl p-2 text-zinc-500 hover:bg-white/10 hover:text-white"
              onClick={() => moveMonth(1)}
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
          <div className="mb-2 grid grid-cols-7 gap-1 text-center text-xs text-zinc-500">
            {["S", "M", "T", "W", "TH", "F", "ST"].map((day) => <span key={day}>{day}</span>)}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {leadingBlanks.map((blank) => (
              <span key={`blank-${blank}`} className="h-9" />
            ))}
            {days.map((day) => (
              <button
                key={day}
                className={cn(
                  "h-9 rounded-xl text-sm text-zinc-300 transition hover:bg-cyan-300/10 hover:text-white",
                  day === 8 && month === 4 && year === 2026 && "ring-1 ring-cyan-300/40",
                  selectedDate.getDate() === day &&
                    selectedDate.getMonth() === month &&
                    selectedDate.getFullYear() === year &&
                    "bg-cyan-300 text-zinc-950 shadow-[0_0_24px_rgba(34,211,238,0.35)]",
                )}
                onClick={() => onSelect(new Date(year, month, day))}
              >
                {day}
              </button>
            ))}
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

export function NotificationDropdown({
  open,
  onClose,
  onToast,
}: {
  open: boolean;
  onClose: () => void;
  onToast: (message: string) => void;
}) {
  const [unread, setUnread] = useState([true, true, true, false]);
  const notifications = ["New client added", "Invoice paid", "Deadline approaching", "Task completed"];

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="fixed inset-x-3 top-20 z-[999] mx-auto max-h-[calc(100dvh-6rem)] w-auto max-w-80 overflow-y-auto rounded-2xl border border-white/10 bg-zinc-950/95 p-3 shadow-[0_30px_100px_rgba(0,0,0,0.55)] backdrop-blur-2xl sm:absolute sm:inset-x-auto sm:right-0 sm:top-full sm:mx-0 sm:mt-3 sm:w-80"
          initial={{ y: -8, opacity: 0, scale: 0.98 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: -8, opacity: 0, scale: 0.98 }}
        >
          <div className="flex items-center justify-between px-2 py-2">
            <p className="text-sm font-semibold text-white">Notifications</p>
            <button
              className="text-xs text-cyan-200 hover:text-cyan-100"
              onClick={() => {
                setUnread(unread.map(() => false));
                onToast("Notifications marked as read");
                onClose();
              }}
            >
              Mark all read
            </button>
          </div>
          <div className="space-y-2">
            {notifications.map((item, index) => (
              <button
                key={item}
                className="flex w-full items-center gap-3 rounded-2xl p-3 text-left transition hover:bg-white/[0.07]"
                onClick={() => {
                  setUnread((values) => values.map((value, itemIndex) => itemIndex === index ? false : value));
                  onToast(`${item} opened`);
                }}
              >
                <span className={cn("grid h-10 w-10 place-items-center rounded-2xl bg-white/[0.07] text-zinc-400", unread[index] && "text-cyan-200")}>
                  <BellRing className="h-4 w-4" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-medium text-white">{item}</span>
                  <span className="block text-xs text-zinc-500">{index + 1}h ago</span>
                </span>
                {unread[index] ? <span className="h-2 w-2 rounded-full bg-cyan-300" /> : null}
              </button>
            ))}
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

export function ProfileDropdown({
  open,
  onClose,
  onToast,
}: {
  open: boolean;
  onClose: () => void;
  onToast: (message: string) => void;
}) {
  const items = [
    ["Profile", UserRound],
    ["Account Settings", Settings],
    ["Theme Toggle", Moon],
    ["Notifications", BellRing],
    ["Logout", LogOut],
  ] as const;

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="fixed inset-x-3 top-20 z-[999] mx-auto max-h-[calc(100dvh-6rem)] w-auto max-w-72 overflow-y-auto rounded-2xl border border-white/10 bg-zinc-950/95 shadow-[0_30px_100px_rgba(0,0,0,0.55)] backdrop-blur-2xl sm:absolute sm:inset-x-auto sm:right-0 sm:top-full sm:mx-0 sm:mt-3 sm:w-72"
          initial={{ y: -8, opacity: 0, scale: 0.98 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: -8, opacity: 0, scale: 0.98 }}
        >
          <div className="border-b border-white/10 p-4">
            <div className="flex items-center gap-3">
              <span className="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-violet-400 to-cyan-300 text-sm font-bold text-zinc-950">FC</span>
              <div>
                <p className="text-sm font-semibold text-white">FawwazCode</p>
                <p className="text-xs text-zinc-500">FawwazCode@gmail.com</p>
              </div>
            </div>
          </div>
          <div className="p-2">
            {items.map(([label, Icon]) => (
              <button
                key={label}
                className="flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-sm text-zinc-300 transition hover:bg-white/[0.07] hover:text-white"
                onClick={() => {
                  onToast(label === "Logout" ? "Signed out locally" : `${label} selected`);
                  onClose();
                }}
              >
                <Icon className="h-4 w-4 text-cyan-200" />
                {label}
                {label === "Theme Toggle" ? <Shield className="ml-auto h-4 w-4 text-zinc-600" /> : null}
              </button>
            ))}
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

export function ToastViewport({ toasts }: { toasts: ToastMessage[] }) {
  return (
    <div className="fixed inset-x-3 top-3 z-[1300] grid gap-3 sm:inset-x-auto sm:right-4 sm:top-4 sm:w-80">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            className="flex w-full items-center gap-3 rounded-2xl border border-cyan-300/20 bg-zinc-950/90 p-4 text-sm text-white shadow-[0_24px_80px_rgba(0,0,0,0.45)] backdrop-blur-2xl"
            initial={{ x: 40, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 40, opacity: 0 }}
          >
            <span className="grid h-8 w-8 place-items-center rounded-xl bg-cyan-300 text-zinc-950">
              <Check className="h-4 w-4" />
            </span>
            {toast.message}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
