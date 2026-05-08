"use client";

import {
  CalendarClock,
  CheckCircle2,
  Circle,
  Clock3,
  MoreHorizontal,
  TimerReset,
  UsersRound,
} from "lucide-react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { Activity, Client, Deadline, Priority, Project, ProjectStatus, TaskColumn } from "@/types/dashboard";
import { cn } from "@/lib/utils";

const statusStyles: Record<ProjectStatus, string> = {
  Ongoing: "border-blue-300/25 bg-blue-400/10 text-blue-100",
  Completed: "border-emerald-300/25 bg-emerald-400/10 text-emerald-100",
  Revision: "border-yellow-300/25 bg-yellow-400/10 text-yellow-100",
  Pending: "border-zinc-300/20 bg-zinc-400/10 text-zinc-200",
};

const priorityStyles: Record<Priority, string> = {
  Low: "text-zinc-400",
  Medium: "text-cyan-200",
  High: "text-rose-200",
};

export function ProjectsSection({ projects }: { projects: Project[] }) {
  return (
    <Card>
      <CardHeader>
        <div>
          <p className="text-sm text-zinc-500">Active projects</p>
          <h2 className="mt-1 text-xl font-semibold tracking-tight text-white">High-value workstream</h2>
        </div>
        <Badge>3 live</Badge>
      </CardHeader>
      <CardContent className="space-y-4">
        {projects.map((project, index) => (
          <motion.div
            key={project.name}
            className="rounded-2xl border border-white/10 bg-zinc-950/35 p-4 transition hover:border-cyan-300/25 hover:bg-cyan-300/[0.045]"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.06 }}
            whileHover={{ y: -3 }}
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h3 className="font-semibold text-white">{project.name}</h3>
                <p className="mt-1 text-sm text-zinc-500">{project.client}</p>
              </div>
              <Badge className={statusStyles[project.status]}>{project.status}</Badge>
            </div>
            <div className="mt-5">
              <div className="mb-2 flex justify-between text-xs text-zinc-500">
                <span>Progress</span>
                <span>{project.progress}%</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-white/10">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-cyan-300 via-blue-500 to-violet-500"
                  initial={{ width: 0 }}
                  animate={{ width: `${project.progress}%` }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                />
              </div>
            </div>
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-sm">
              <div className="flex -space-x-2">
                {project.team.map((member) => (
                  <span
                    key={member}
                    className="grid h-8 w-8 place-items-center rounded-full border border-zinc-950 bg-white text-[11px] font-bold text-zinc-950"
                  >
                    {member}
                  </span>
                ))}
              </div>
              <div className="flex flex-wrap items-center gap-3 text-zinc-400">
                <span className={cn("inline-flex items-center gap-1", priorityStyles[project.priority])}>
                  <Circle className="h-2.5 w-2.5 fill-current" />
                  {project.priority}
                </span>
                <span className="inline-flex items-center gap-1">
                  <CalendarClock className="h-4 w-4" />
                  {project.deadline}
                </span>
                <span>{formatRupiahBudget(project.budget)}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </CardContent>
    </Card>
  );
}

function formatRupiahBudget(budget: string) {
  if (!budget.includes("$")) {
    return budget;
  }

  const value = Number(budget.replace(/[$K,\s]/g, ""));
  if (Number.isNaN(value)) {
    return budget.replace("$", "Rp");
  }

  return `Rp${Math.round(value * 16)} jt`;
}

export function ActivityPanel({ activities }: { activities: Activity[] }) {
  const tones = {
    cyan: "bg-cyan-300",
    violet: "bg-violet-300",
    emerald: "bg-emerald-300",
    amber: "bg-amber-300",
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <div>
          <p className="text-sm text-zinc-500">Recent activity</p>
          <h2 className="mt-1 text-xl font-semibold tracking-tight text-white">Live pulse</h2>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {activities.map((activity) => (
          <div key={activity.title} className="flex gap-3">
            <span className={cn("mt-1 h-2.5 w-2.5 rounded-full shadow-[0_0_18px_currentColor]", tones[activity.tone])} />
            <div>
              <p className="text-sm font-medium text-white">{activity.title}</p>
              <p className="mt-1 text-sm text-zinc-500">{activity.meta}</p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

export function DeadlinePanel({ deadlines }: { deadlines: Deadline[] }) {
  return (
    <Card className="h-full">
      <CardHeader>
        <div>
          <p className="text-sm text-zinc-500">Upcoming deadlines</p>
          <h2 className="mt-1 text-xl font-semibold tracking-tight text-white">Next commitments</h2>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {deadlines.map((deadline) => (
          <div key={deadline.title} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] p-3">
            <span className="grid h-10 w-10 place-items-center rounded-2xl bg-white/[0.07] text-cyan-200">
              <Clock3 className="h-4 w-4" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-white">{deadline.title}</p>
              <p className="mt-1 text-xs text-zinc-500">{deadline.date}</p>
            </div>
            <Badge className="shrink-0">{deadline.urgency}</Badge>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

export function TaskBoard({ columns }: { columns: TaskColumn[] }) {
  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <div>
          <p className="text-sm text-zinc-500">Task progress</p>
          <h2 className="mt-1 text-xl font-semibold tracking-tight text-white">Kanban operating board</h2>
        </div>
        <Badge className="border-violet-300/20 bg-violet-300/10 text-violet-100">Drag style UI</Badge>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 lg:grid-cols-4">
          {columns.map((column, columnIndex) => (
            <motion.div
              key={column.title}
              className="min-h-[260px] rounded-2xl border border-white/10 bg-zinc-950/35 p-3"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: columnIndex * 0.05 }}
            >
              <div className="mb-3 flex items-center justify-between px-1">
                <h3 className="text-sm font-semibold text-white">{column.title}</h3>
                <span className="text-xs text-zinc-500">{column.count}</span>
              </div>
              <div className="space-y-3">
                {column.tasks.map((task) => (
                  <motion.div
                    key={task.title}
                    className="cursor-grab rounded-2xl border border-white/10 bg-white/[0.055] p-3 shadow-[0_16px_40px_rgba(0,0,0,0.18)] transition hover:border-cyan-300/25 hover:bg-cyan-300/[0.06]"
                    whileHover={{ y: -4, rotate: -0.25 }}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <p className="text-sm font-medium leading-5 text-white">{task.title}</p>
                      <MoreHorizontal className="h-4 w-4 shrink-0 text-zinc-600" />
                    </div>
                    <div className="mt-4 flex items-center justify-between text-xs">
                      <span className="text-zinc-500">{task.project}</span>
                      <span className={priorityStyles[task.priority]}>{task.priority}</span>
                    </div>
                  </motion.div>
                ))}
                {column.tasks.length === 1 ? <Skeleton className="h-20 opacity-60" /> : null}
              </div>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export function ClientOverview({ clients }: { clients: Client[] }) {
  return (
    <Card className="h-full">
      <CardHeader>
        <div>
          <p className="text-sm text-zinc-500">Client overview</p>
          <h2 className="mt-1 text-xl font-semibold tracking-tight text-white">Relationship health</h2>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {clients.map((client) => (
          <div key={client.name} className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
            <div className="flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-2xl bg-gradient-to-br from-white to-cyan-200 text-xs font-bold text-zinc-950">
                {client.name.split(" ").map((part) => part[0]).join("")}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-white">{client.name}</p>
                <p className="truncate text-xs text-zinc-500">{client.company}</p>
              </div>
              <span className="text-sm font-semibold text-white">{client.value}</span>
            </div>
            <div className="mt-4 flex items-center gap-3">
              <UsersRound className="h-4 w-4 text-zinc-500" />
              <div className="h-2 flex-1 overflow-hidden rounded-full bg-white/10">
                <div className="h-full rounded-full bg-gradient-to-r from-emerald-300 to-cyan-300" style={{ width: `${client.health}%` }} />
              </div>
              <span className="text-xs text-zinc-500">{client.health}%</span>
            </div>
          </div>
        ))}
        <div className="rounded-2xl border border-dashed border-white/15 p-5 text-center">
          <CheckCircle2 className="mx-auto h-5 w-5 text-cyan-200" />
          <p className="mt-2 text-sm font-medium text-white">No at-risk clients</p>
          <p className="mt-1 text-xs text-zinc-500">All current accounts are healthy.</p>
        </div>
      </CardContent>
    </Card>
  );
}

export function CompletionRing() {
  return (
    <Card className="h-full">
      <CardHeader>
        <div>
          <p className="text-sm text-zinc-500">Task completion</p>
          <h2 className="mt-1 text-xl font-semibold tracking-tight text-white">Weekly focus</h2>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid place-items-center py-4">
          <div
            className="relative grid h-44 w-44 place-items-center rounded-full p-3 shadow-[0_0_70px_rgba(34,211,238,0.13)]"
            style={{ background: "conic-gradient(from 210deg, #22d3ee 0deg, #3b82f6 225deg, #27272a 226deg 360deg)" }}
          >
            <div className="grid h-full w-full place-items-center rounded-full bg-zinc-950">
              <div className="text-center">
                <p className="text-4xl font-semibold text-white">86%</p>
                <p className="mt-1 text-xs text-zinc-500">completed</p>
              </div>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-3 text-center">
          {[
            ["42", "Done"],
            ["7", "Review"],
            ["13", "Open"],
          ].map(([value, label]) => (
            <div key={label} className="rounded-2xl border border-white/10 bg-white/[0.04] p-3">
              <p className="text-lg font-semibold text-white">{value}</p>
              <p className="text-xs text-zinc-500">{label}</p>
            </div>
          ))}
        </div>
        <div className="mt-4 flex items-center justify-center gap-2 text-sm text-zinc-400">
          <TimerReset className="h-4 w-4 text-cyan-200" />
          18 tasks cleared this week
        </div>
      </CardContent>
    </Card>
  );
}
