import type { LucideIcon } from "lucide-react";

export type Stat = {
  label: string;
  value: string;
  change: string;
  trend: "up" | "down";
  icon: LucideIcon;
  sparkline: number[];
};

export type ChartPoint = {
  label: string;
  revenue: number;
  projects: number;
  tasks: number;
};

export type ProjectStatus = "Ongoing" | "Completed" | "Revision" | "Pending";
export type Priority = "Low" | "Medium" | "High";

export type Project = {
  name: string;
  client: string;
  status: ProjectStatus;
  priority: Priority;
  progress: number;
  deadline: string;
  budget: string;
  team: string[];
};

export type Activity = {
  title: string;
  meta: string;
  tone: "cyan" | "violet" | "emerald" | "amber";
};

export type Deadline = {
  title: string;
  date: string;
  urgency: string;
};

export type Task = {
  title: string;
  project: string;
  priority: Priority;
};

export type TaskColumn = {
  title: string;
  count: number;
  tasks: Task[];
};

export type Client = {
  name: string;
  company: string;
  value: string;
  health: number;
};
