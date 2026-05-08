"use client";

import { useCallback, useEffect, useState } from "react";
import type { ReactNode } from "react";
import {
  CalendarDays,
  Download,
  FileText,
  FolderKanban,
  Sparkles,
  UsersRound,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { DashboardSidebar } from "@/components/sidebar/dashboard-sidebar";
import { TopNavbar } from "@/components/dashboard/top-navbar";
import { StatCard } from "@/components/cards/stat-card";
import { MiniBars } from "@/components/charts/mini-bars";
import { RevenueChart } from "@/components/charts/revenue-chart";
import {
  ActivityPanel,
  ClientOverview,
  CompletionRing,
  DeadlinePanel,
  ProjectsSection,
  TaskBoard,
} from "@/components/dashboard/dashboard-sections";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  activities,
  chartData,
  clients,
  deadlines,
  projects,
  stats,
  taskColumns,
} from "@/data/dashboard";
import { cn } from "@/lib/utils";
import { MotionDiv } from "@/components/dashboard/motion";
import type { Project } from "@/types/dashboard";
import {
  CalendarDropdown,
  ExportOverlay,
  InviteModal,
  ProjectModal,
  ProposalModal,
  ToastViewport,
} from "@/components/dashboard/interactive-overlays";
import type { ToastMessage } from "@/components/dashboard/interactive-overlays";
import {
  exportDashboardExcel,
  exportDashboardPdf,
  type ReportPayload,
} from "@/lib/report-export";

type DashboardView =
  | "dashboard"
  | "clients"
  | "projects"
  | "tasks"
  | "finance"
  | "invoices"
  | "analytics"
  | "calendar"
  | "files"
  | "settings";

export function DashboardShell({ view = "dashboard" }: { view?: DashboardView }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [projectModalOpen, setProjectModalOpen] = useState(false);
  const [proposalModalOpen, setProposalModalOpen] = useState(false);
  const [inviteModalOpen, setInviteModalOpen] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [projectList, setProjectList] = useState<Project[]>(projects);
  const [proposalCount, setProposalCount] = useState(0);
  const [exportOpen, setExportOpen] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [exportFormat, setExportFormat] = useState<"pdf" | "excel">("pdf");
  const [query, setQuery] = useState("");
  const params = new URLSearchParams(query);
  const overdue = view === "tasks" && params.get("filter") === "overdue";
  const revenueHighlight = view === "analytics" && params.get("highlight") === "revenue";

  const pushToast = useCallback((message: string) => {
    const id = Date.now();
    setToasts((items) => [...items, { id, message }]);
    setTimeout(() => setToasts((items) => items.filter((toast) => toast.id !== id)), 3000);
  }, []);

  function exportReport(format: "pdf" | "excel") {
    if (exportOpen) return;
    setExportFormat(format);
    setExportOpen(true);
    setExportProgress(12);
  }

  useEffect(() => {
    if (!exportOpen) return;
    if (exportProgress >= 100) {
      const timeout = setTimeout(() => {
        const payload: ReportPayload = {
          stats,
          chartData,
          projects: projectList,
          clients,
          taskColumns,
        };

        if (exportFormat === "pdf") {
          exportDashboardPdf(payload);
        } else {
          exportDashboardExcel(payload);
        }

        setExportOpen(false);
        setExportProgress(0);
        pushToast(
          exportFormat === "pdf"
            ? "PDF report downloaded"
            : "Excel report downloaded",
        );
      }, 450);
      return () => clearTimeout(timeout);
    }
    const timeout = setTimeout(() => {
      setExportProgress((value) => Math.min(value + 18, 100));
    }, 220);
    return () => clearTimeout(timeout);
  }, [exportFormat, exportOpen, exportProgress, projectList, pushToast]);

  useEffect(() => {
    const syncQuery = () => setQuery(window.location.search);
    syncQuery();
    window.addEventListener("popstate", syncQuery);
    return () => window.removeEventListener("popstate", syncQuery);
  }, []);

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#05060a] text-zinc-100">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(34,211,238,0.16),transparent_28%),radial-gradient(circle_at_80%_0%,rgba(124,58,237,0.15),transparent_26%),linear-gradient(180deg,rgba(255,255,255,0.03),transparent_42%)]" />
      <div className="pointer-events-none fixed inset-0 bg-[linear-gradient(rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[size:72px_72px] opacity-40" />

      <DashboardSidebar
        collapsed={collapsed}
        mobileOpen={mobileOpen}
        onCloseMobile={() => setMobileOpen(false)}
        onToggleCollapsed={() => setCollapsed((value) => !value)}
      />

      <div
        className={cn(
          "relative z-10 min-h-screen transition-[padding] duration-300",
          collapsed ? "lg:pl-[124px]" : "lg:pl-[312px]",
        )}
      >
        <TopNavbar
          onOpenSidebar={() => setMobileOpen(true)}
          onCreateProject={() => setProjectModalOpen(true)}
          onCreateProposal={() => setProposalModalOpen(true)}
          onInviteClient={() => setInviteModalOpen(true)}
          onToast={pushToast}
        />
        <main className="mx-auto w-full max-w-[1600px] px-4 py-6 sm:px-6 lg:py-8">
          {view === "dashboard" ? (
            <DashboardHome
              projects={projectList}
              onExportReport={exportReport}
              onToast={pushToast}
              proposalCount={proposalCount}
            />
          ) : view === "analytics" ? (
            <AnalyticsPage highlighted={revenueHighlight} />
          ) : view === "projects" ? (
            <ProjectsPage projects={projectList} onCreateProject={() => setProjectModalOpen(true)} />
          ) : view === "tasks" ? (
            <TasksPage overdue={overdue} />
          ) : (
            <WorkspacePage view={view} />
          )}
        </main>
      </div>
      <ProjectModal
        open={projectModalOpen}
        onClose={() => setProjectModalOpen(false)}
        onSubmit={(project) => {
          setProjectList((items) => [
            {
              name: project.name,
              client: project.client,
              status: project.status,
              priority: project.priority,
              progress: project.status === "Completed" ? 100 : 18,
              deadline: project.deadline,
              budget: "Rp154 jt",
              team: ["XR", "NL"],
            },
            ...items,
          ]);
          pushToast("Project created");
        }}
      />
      <ProposalModal
        open={proposalModalOpen}
        onClose={() => setProposalModalOpen(false)}
        onSubmit={(proposal) => {
          setProposalCount((count) => count + 1);
          pushToast(`${proposal.title} proposal created for ${proposal.client}`);
        }}
      />
      <InviteModal
        open={inviteModalOpen}
        onClose={() => setInviteModalOpen(false)}
        onSubmit={(email, role) => pushToast(`${role} invite sent to ${email}`)}
      />
      <ExportOverlay open={exportOpen} progress={exportProgress} format={exportFormat} />
      <ToastViewport toasts={toasts} />
    </div>
  );
}

function DashboardHome({
  projects,
  onExportReport,
  onToast,
  proposalCount,
}: {
  projects: Project[];
  onExportReport: (format: "pdf" | "excel") => void;
  onToast: (message: string) => void;
  proposalCount: number;
}) {
  return (
    <>
      <WelcomeHeader onExportReport={onExportReport} onToast={onToast} proposalCount={proposalCount} />

      <section className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat, index) => (
          <StatCard key={stat.label} stat={stat} index={index} />
        ))}
      </section>

      <section className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1.55fr)_minmax(340px,0.8fr)]">
        <RevenueChart data={chartData} />
        <MiniBars data={chartData} />
      </section>

      <section className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1.25fr)_minmax(340px,0.75fr)]">
        <ProjectsSection projects={projects} />
        <div className="grid gap-6">
          <ActivityPanel activities={activities} />
          <DeadlinePanel deadlines={deadlines} />
        </div>
      </section>

      <section className="mt-6 grid gap-6 2xl:grid-cols-[minmax(0,1.45fr)_minmax(360px,0.55fr)]">
        <TaskBoard columns={taskColumns} />
        <div className="grid gap-6">
          <CompletionRing />
          <ClientOverview clients={clients} />
        </div>
      </section>
    </>
  );
}

function WelcomeHeader({
  onExportReport,
  onToast,
  proposalCount,
}: {
  onExportReport: (format: "pdf" | "excel") => void;
  onToast: (message: string) => void;
  proposalCount: number;
}) {
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [exportMenuOpen, setExportMenuOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(() => new Date(2026, 4, 8));
  const selectedDateLabel = selectedDate.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <MotionDiv
      className="relative z-[120] overflow-visible rounded-2xl border border-white/10 bg-white/[0.055] p-5 shadow-[0_32px_100px_rgba(0,0,0,0.32)] backdrop-blur-2xl sm:p-6"
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="pointer-events-none absolute inset-0 rounded-2xl bg-[linear-gradient(120deg,rgba(34,211,238,0.16),transparent_34%,rgba(139,92,246,0.15))]" />
      <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-3xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1 text-xs font-medium text-cyan-100">
            <Sparkles className="h-3.5 w-3.5" />
            Portfolio preview mode
          </div>
          <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            Welcome back to FawwazDesk.
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-400 sm:text-base">
            A polished command center for client relationships, project velocity,
            deadlines, revenue, and the tiny signals that keep freelance work calm.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <div className="relative z-[130]">
            <Button
              variant="glass"
              onClick={() => {
                setExportMenuOpen(false);
                setCalendarOpen((open) => !open);
              }}
            >
              <CalendarDays className="h-4 w-4" />
              {selectedDateLabel}
            </Button>
            <CalendarDropdown
              open={calendarOpen}
              selectedDate={selectedDate}
              onSelect={(date) => {
                setSelectedDate(date);
                setCalendarOpen(false);
                onToast(
                  `Calendar set to ${date.toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}`,
                );
              }}
            />
          </div>
          <div className="relative z-[130]">
            <Button
              onClick={() => {
                setCalendarOpen(false);
                setExportMenuOpen((open) => !open);
              }}
            >
              <Download className="h-4 w-4" />
              Export Report
            </Button>
            {exportMenuOpen ? (
              <div className="fixed inset-x-3 top-24 z-[999] mx-auto w-auto max-w-56 rounded-2xl border border-white/10 bg-zinc-950/95 p-2 shadow-[0_30px_100px_rgba(0,0,0,0.55)] backdrop-blur-2xl sm:absolute sm:inset-x-auto sm:right-0 sm:top-full sm:mx-0 sm:mt-3 sm:w-56">
                {[
                  ["pdf", "Export as PDF"],
                  ["excel", "Export as Excel"],
                ].map(([format, label]) => (
                  <button
                    key={format}
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm text-zinc-300 transition hover:bg-cyan-300/10 hover:text-white"
                    onClick={() => {
                      setExportMenuOpen(false);
                      onExportReport(format as "pdf" | "excel");
                    }}
                  >
                    <Download className="h-4 w-4 text-cyan-200" />
                    {label}
                  </button>
                ))}
              </div>
            ) : null}
          </div>
        </div>
      </div>
      {proposalCount > 0 ? (
        <div className="relative mt-5 inline-flex rounded-2xl border border-emerald-300/20 bg-emerald-300/10 px-3 py-2 text-sm text-emerald-100">
          {proposalCount} local proposal{proposalCount > 1 ? "s" : ""} created this session
        </div>
      ) : null}
    </MotionDiv>
  );
}

function AnalyticsPage({ highlighted }: { highlighted: boolean }) {
  return (
    <MotionDiv initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
      <HeaderBlock eyebrow="Analytics" title="Revenue intelligence" description="Smoothly focused from the command menu with a temporary chart highlight." />
      <div className={cn("mt-6 rounded-2xl transition duration-700", highlighted && "ring-2 ring-cyan-300/70 shadow-[0_0_80px_rgba(34,211,238,0.22)]")}>
        <RevenueChart data={chartData} />
      </div>
      <section className="mt-6 grid gap-6 lg:grid-cols-2">
        <MiniBars data={chartData} />
        <CompletionRing />
      </section>
    </MotionDiv>
  );
}

function ProjectsPage({ projects, onCreateProject }: { projects: Project[]; onCreateProject: () => void }) {
  return (
    <MotionDiv initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
      <HeaderBlock eyebrow="Projects" title="Project command board" description="Create local projects and watch them animate into the workstream." action={<Button onClick={onCreateProject}><FolderKanban className="h-4 w-4" />New Project</Button>} />
      <section className="mt-6">
        <ProjectsSection projects={projects} />
      </section>
    </MotionDiv>
  );
}

function TasksPage({ overdue }: { overdue: boolean }) {
  return (
    <MotionDiv initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
      <HeaderBlock
        eyebrow="Tasks"
        title={overdue ? "Overdue task review" : "Task operating board"}
        description="Kanban workflow with local filters, priority labels, hover motion, and realistic review states."
        action={overdue ? <Badge className="animate-pulse border-rose-300/25 bg-rose-400/10 text-rose-100">3 overdue</Badge> : undefined}
      />
      <section className={cn("mt-6 transition", overdue && "rounded-2xl ring-2 ring-rose-300/50 shadow-[0_0_80px_rgba(251,113,133,0.16)]")}>
        <TaskBoard columns={taskColumns} />
      </section>
    </MotionDiv>
  );
}

function WorkspacePage({ view }: { view: Exclude<DashboardView, "dashboard" | "analytics" | "projects" | "tasks"> }) {
  const pageCopy: Record<typeof view, { eyebrow: string; title: string; description: string; icon: LucideIcon }> = {
    clients: { eyebrow: "Clients", title: "Relationship workspace", description: "Track premium accounts, health signals, and client-side momentum.", icon: UsersRound },
    finance: { eyebrow: "Finance", title: "Cashflow control", description: "Monitor retainers, revenue movement, and margin snapshots.", icon: Download },
    invoices: { eyebrow: "Invoices", title: "Billing center", description: "Review paid, pending, and upcoming invoice states.", icon: FileText },
    calendar: { eyebrow: "Calendar", title: "Delivery calendar", description: "Plan deadlines and review windows across May 2026.", icon: CalendarDays },
    files: { eyebrow: "Files", title: "Asset library", description: "Organize handoffs, decks, contracts, and project resources.", icon: FolderKanban },
    settings: { eyebrow: "Settings", title: "Workspace preferences", description: "Tune notifications, theme behavior, and account details.", icon: Sparkles },
  };
  const copy = pageCopy[view];
  const Icon = copy.icon;

  return (
    <MotionDiv initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
      <HeaderBlock eyebrow={copy.eyebrow} title={copy.title} description={copy.description} />
      <section className="mt-6 grid gap-4 md:grid-cols-3">
        {[1, 2, 3, 4, 5, 6].map((item) => (
          <Card key={item} className="transition hover:-translate-y-1 hover:border-cyan-300/25 hover:bg-cyan-300/[0.04]">
            <CardHeader>
              <span className="grid h-11 w-11 place-items-center rounded-2xl bg-white/[0.07] text-cyan-200">
                <Icon className="h-5 w-5" />
              </span>
              <Badge>Local</Badge>
            </CardHeader>
            <CardContent>
              <h3 className="font-semibold text-white">{copy.eyebrow} item {item}</h3>
              <p className="mt-2 text-sm leading-6 text-zinc-500">Dummy state card with premium hover treatment and no backend dependency.</p>
            </CardContent>
          </Card>
        ))}
      </section>
    </MotionDiv>
  );
}

function HeaderBlock({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow: string;
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.055] p-5 shadow-[0_24px_80px_rgba(0,0,0,0.28)] backdrop-blur-2xl sm:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-cyan-200">{eyebrow}</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-white">{title}</h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-400">{description}</p>
        </div>
        {action}
      </div>
    </div>
  );
}
