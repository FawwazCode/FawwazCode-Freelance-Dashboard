"use client";

import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { MotionDiv } from "@/components/dashboard/motion";
import { Card } from "@/components/ui/card";
import type { Stat } from "@/types/dashboard";
import { cn } from "@/lib/utils";

export function StatCard({ stat, index }: { stat: Stat; index: number }) {
  const Icon = stat.icon;
  const max = Math.max(...stat.sparkline);
  const min = Math.min(...stat.sparkline);
  const points = stat.sparkline
    .map((value, pointIndex) => {
      const x = (pointIndex / (stat.sparkline.length - 1)) * 100;
      const y = 36 - ((value - min) / Math.max(max - min, 1)) * 28;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <MotionDiv
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.45 }}
      whileHover={{ y: -6, scale: 1.01 }}
    >
      <Card className="group relative h-full overflow-hidden p-5">
        <div className="absolute inset-x-6 -top-10 h-24 rounded-full bg-cyan-300/10 blur-3xl transition group-hover:bg-cyan-300/20" />
        <div className="relative flex items-start justify-between gap-4">
          <div>
            <p className="text-sm text-zinc-500">{stat.label}</p>
            <div className="mt-3 flex items-end gap-3">
              <p className="text-3xl font-semibold tracking-tight text-white">{stat.value}</p>
              <span
                className={cn(
                  "mb-1 inline-flex items-center gap-1 text-xs font-medium",
                  stat.trend === "up" ? "text-emerald-300" : "text-rose-300",
                )}
              >
                {stat.trend === "up" ? <ArrowUpRight className="h-3.5 w-3.5" /> : <ArrowDownRight className="h-3.5 w-3.5" />}
                {stat.change}
              </span>
            </div>
          </div>
          <div className="grid h-12 w-12 place-items-center rounded-2xl border border-white/10 bg-white/[0.07] text-cyan-200 shadow-[0_0_32px_rgba(34,211,238,0.12)]">
            <Icon className="h-5 w-5" />
          </div>
        </div>
        <svg className="relative mt-6 h-11 w-full overflow-visible" viewBox="0 0 100 40" preserveAspectRatio="none">
          <defs>
            <linearGradient id={`spark-${index}`} x1="0" x2="1">
              <stop offset="0%" stopColor="#22d3ee" />
              <stop offset="55%" stopColor="#3b82f6" />
              <stop offset="100%" stopColor="#a78bfa" />
            </linearGradient>
          </defs>
          <polyline
            fill="none"
            stroke={`url(#spark-${index})`}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="3"
            points={points}
          />
        </svg>
      </Card>
    </MotionDiv>
  );
}
