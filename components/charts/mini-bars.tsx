"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import type { ChartPoint } from "@/types/dashboard";

export function MiniBars({ data }: { data: ChartPoint[] }) {
  const maxProjects = Math.max(...data.map((item) => item.projects));
  const totalProjects = data.reduce((total, item) => total + item.projects, 0);
  const averageTasks = Math.round(
    data.reduce((total, item) => total + item.tasks, 0) / data.length,
  );
  const utilization = Math.round((data[data.length - 1].projects / maxProjects) * 92);

  return (
    <Card className="h-full">
      <CardHeader>
        <div>
          <p className="text-sm text-zinc-500">Monthly projects</p>
          <h2 className="mt-1 text-xl font-semibold tracking-tight text-white">Capacity curve</h2>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-5 grid gap-3 sm:grid-cols-3">
          {[
            ["Total projects", totalProjects.toString()],
            ["Avg tasks", averageTasks.toString()],
            ["Utilization", `${utilization}%`],
          ].map(([label, value]) => (
            <div
              key={label}
              className="rounded-2xl border border-white/10 bg-white/[0.045] p-3"
            >
              <p className="text-xs text-zinc-500">{label}</p>
              <p className="mt-1 text-lg font-semibold text-white">{value}</p>
            </div>
          ))}
        </div>
        <div className="flex h-48 items-end gap-2">
          {data.map((item, index) => (
            <div key={item.label} className="flex flex-1 flex-col items-center gap-2">
              <motion.div
                className="group relative w-full rounded-t-2xl bg-gradient-to-t from-violet-500 via-blue-500 to-cyan-300 shadow-[0_0_28px_rgba(34,211,238,0.16)]"
                initial={{ height: 0 }}
                animate={{ height: `${(item.projects / maxProjects) * 100}%` }}
                transition={{ delay: index * 0.04, duration: 0.7, ease: "easeOut" }}
              >
                <span className="pointer-events-none absolute bottom-full left-1/2 mb-2 hidden w-32 -translate-x-1/2 rounded-xl border border-white/10 bg-zinc-950/95 px-3 py-2 text-center text-[11px] text-zinc-300 shadow-2xl group-hover:block">
                  {item.projects} projects
                  <br />
                  {item.tasks}% task completion
                </span>
              </motion.div>
              <span className="text-[11px] text-zinc-500">{item.label}</span>
            </div>
          ))}
        </div>
        <div className="mt-5 space-y-3">
          {data.slice(-3).map((item) => (
            <div
              key={item.label}
              className="flex items-center justify-between rounded-2xl border border-white/10 bg-zinc-950/35 px-4 py-3 text-sm"
            >
              <div>
                <p className="font-medium text-white">{item.label} capacity</p>
                <p className="mt-1 text-xs text-zinc-500">
                  {item.projects} active projects, {item.tasks}% task completion
                </p>
              </div>
              <span className="rounded-full border border-cyan-300/20 bg-cyan-300/10 px-2.5 py-1 text-xs text-cyan-100">
                +{Math.max(item.projects - 12, 1)} growth
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
