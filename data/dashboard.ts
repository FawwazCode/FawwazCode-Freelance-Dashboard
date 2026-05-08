import {
  Activity,
  ChartPoint,
  Client,
  Deadline,
  Project,
  Stat,
  TaskColumn,
} from "@/types/dashboard";
import {
  BadgeDollarSign,
  BriefcaseBusiness,
  CheckCheck,
  UsersRound,
} from "lucide-react";

export const stats: Stat[] = [
  {
    label: "Total Clients",
    value: "128",
    change: "+14.2%",
    trend: "up",
    icon: UsersRound,
    sparkline: [18, 22, 20, 28, 31, 35, 39],
  },
  {
    label: "Active Projects",
    value: "34",
    change: "+8.7%",
    trend: "up",
    icon: BriefcaseBusiness,
    sparkline: [9, 12, 15, 13, 18, 21, 24],
  },
  {
    label: "Revenue",
    value: "Rp1,38 M",
    change: "+22.5%",
    trend: "up",
    icon: BadgeDollarSign,
    sparkline: [24, 32, 29, 41, 46, 58, 63],
  },
  {
    label: "Completed Tasks",
    value: "942",
    change: "-3.1%",
    trend: "down",
    icon: CheckCheck,
    sparkline: [42, 46, 44, 40, 38, 36, 35],
  },
];

export const chartData: ChartPoint[] = [
  { label: "Jan", revenue: 18, projects: 8, tasks: 36 },
  { label: "Feb", revenue: 26, projects: 11, tasks: 44 },
  { label: "Mar", revenue: 22, projects: 14, tasks: 52 },
  { label: "Apr", revenue: 38, projects: 13, tasks: 61 },
  { label: "May", revenue: 44, projects: 17, tasks: 68 },
  { label: "Jun", revenue: 58, projects: 21, tasks: 74 },
  { label: "Jul", revenue: 64, projects: 24, tasks: 81 },
  { label: "Aug", revenue: 72, projects: 27, tasks: 86 },
];

export const projects: Project[] = [
  {
    name: "Ecommerce Sinar Abadi",
    client: "Atlas Creative",
    status: "Ongoing",
    priority: "High",
    progress: 72,
    deadline: "May 18",
    budget: "Rp296 jt",
    team: ["AR", "MN", "VK"],
  },
  {
    name: "Product Showcase Finly",
    client: "Finly Labs",
    status: "Revision",
    priority: "Medium",
    progress: 54,
    deadline: "May 24",
    budget: "Rp195 jt",
    team: ["JL", "SK"],
  },
  {
    name: "Profile Company Northstar",
    client: "Northstar Ops",
    status: "Completed",
    priority: "Low",
    progress: 100,
    deadline: "May 06",
    budget: "Rp397 jt",
    team: ["DM", "AR", "QS"],
  },
];

export const activities: Activity[] = [
  { title: "New proposal accepted", meta: "Stellar Group, 12 minutes ago", tone: "cyan" },
  { title: "Invoice #XR-204 paid", meta: "Rp124,8 jt received, 42 minutes ago", tone: "emerald" },
  { title: "Design review requested", meta: "Finly Labs, 2 hours ago", tone: "violet" },
  { title: "Deadline shifted", meta: "Atlas Studio moved to May 18", tone: "amber" },
];

export const deadlines: Deadline[] = [
  { title: "Landing page handoff", date: "Today, 16:00", urgency: "Critical" },
  { title: "Finly prototype review", date: "Tomorrow, 10:30", urgency: "High" },
  { title: "Retainer renewal deck", date: "May 12", urgency: "Medium" },
];

export const taskColumns: TaskColumn[] = [
  {
    title: "Todo",
    count: 3,
    tasks: [
      { title: "Prepare discovery notes", project: "Stellar CRM", priority: "Medium" },
      { title: "Audit invoice templates", project: "Finance Core", priority: "Low" },
    ],
  },
  {
    title: "In Progress",
    count: 4,
    tasks: [
      { title: "Build analytics hero states", project: "XInrenOS", priority: "High" },
      { title: "Refine onboarding flow", project: "Atlas Studio", priority: "Medium" },
    ],
  },
  {
    title: "Review",
    count: 2,
    tasks: [
      { title: "QA responsive task board", project: "Finly Mobile", priority: "High" },
    ],
  },
  {
    title: "Done",
    count: 8,
    tasks: [
      { title: "Ship file preview polish", project: "Northstar", priority: "Low" },
      { title: "Update client health scores", project: "XInrenOS", priority: "Medium" },
    ],
  },
];

export const clients: Client[] = [
  { name: "Maya Chen", company: "Atlas Creative", value: "Rp674 jt", health: 94 },
  { name: "Jon Bell", company: "Finly Labs", value: "Rp506 jt", health: 82 },
  { name: "Rina Vale", company: "Northstar Ops", value: "Rp462 jt", health: 88 },
];
