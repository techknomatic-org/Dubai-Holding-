import React from 'react';
import {
  ShieldCheck,
  ShieldAlert,
  Shield,
  Smile,
  GitCommit,
  AlertOctagon,
  AlertTriangle,
  AlertCircle,
  CheckCircle2,
  Check,
  Clock,
  Ticket,
  Zap,
  Cpu,
  Layers,
  Network,
  FileText,
  FileCheck,
  FolderGit2,
  Monitor,
  Terminal,
  Server,
  Users,
  UserX,
  Mail,
  Key,
  DollarSign,
  TrendingUp,
  TrendingDown,
  BarChart3,
  PieChart,
  HardDrive,
  Compass,
  ArrowRight,
  ArrowLeft,
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  Maximize2,
  Minimize2,
  Home,
  X,
  RefreshCw,
  Sparkles,
  RotateCcw,
  ExternalLink,
  Search,
  Activity,
  Headphones,
  Settings,
  Calendar,
  Briefcase,
  LucideProps
} from 'lucide-react';

/**
 * Standardized Icon Sizing Tokens (in px and Tailwind classes)
 */
export const IconSize = {
  micro: 'w-3 h-3',           // 12px - Status badges & breadcrumbs
  small: 'w-3.5 h-3.5',       // 14px - Sub-labels & tooltips
  medium: 'w-4 h-4',          // 16px - Buttons & section headers
  regular: 'w-4.5 h-4.5',     // 18px - Card headers & KPI icons
  large: 'w-5 h-5',           // 20px - Main feature & spotlight icons
  hero: 'w-6 h-6'             // 24px - Large drill-down modal icons
} as const;

/**
 * Standardized Semantic Icon Color Tokens
 */
export const IconColor = {
  primary: 'text-[#E31837]',             // Dubai Holding Red
  navy: 'text-[#0A0838] dark:text-white', // Deep Navy
  blue: 'text-[#0284C7] dark:text-[#38BDF8]', // Operational Blue
  green: 'text-[#16A34A] dark:text-[#4ADE80]', // Success Green
  emerald: 'text-[#059669] dark:text-[#10B981]',
  amber: 'text-[#D97706] dark:text-[#FBBF24]', // Warning / In Progress
  orange: 'text-[#EA580C] dark:text-[#FB923C]',
  red: 'text-[#E31837] dark:text-[#F87171]',    // Critical / Overdue
  neutral: 'text-[#4D4D4F] dark:text-slate-400',
  purple: 'text-[#7C3AED] dark:text-[#A78BFA]',
  teal: 'text-[#0D9488] dark:text-[#2DD4BF]'
} as const;

/**
 * Semantic Icon Mapping Dictionary
 */
export const SemanticIcons = {
  // Governance & Strategic
  home: Home,
  agenda: Compass,
  mom: CheckCircle2,
  delivery: Briefcase,
  projects: FolderGit2,
  roadmap: Compass,
  
  // Operations & Health
  uptime: ShieldCheck,
  availability: ShieldCheck,
  csat: Smile,
  change: GitCommit,
  majorIncident: AlertOctagon,
  kpiHealth: CheckCircle2,
  activity: Activity,
  
  // Service Management & Automation
  serviceDesk: Headphones,
  ticket: Ticket,
  automation: Zap,
  useCases: Network,
  sop: FileCheck,
  pipeline: Layers,
  aiops: Cpu,
  
  // Active Directory & Security
  activeDirectory: Users,
  licenses: Key,
  mailbox: Mail,
  staleIdentity: UserX,
  security: Shield,
  
  // Vulnerability & Risk Management
  vulnerability: ShieldAlert,
  risk: AlertTriangle,
  overdue: AlertTriangle,
  mitigation: CheckCircle2,
  schedule: Calendar,
  
  // Exposure & Hardware
  windowsExposure: Monitor,
  nonWindowsExposure: Terminal,
  servers: Server,
  storage: HardDrive,
  
  // Financial & Value Creation
  costOptimization: DollarSign,
  savings: TrendingDown,
  trendUp: TrendingUp,
  chart: BarChart3,
  pieChart: PieChart,
  
  // Navigation & Actions
  next: ArrowRight,
  prev: ArrowLeft,
  chevronRight: ChevronRight,
  chevronLeft: ChevronLeft,
  chevronDown: ChevronDown,
  close: X,
  refresh: RefreshCw,
  reset: RotateCcw,
  fullscreen: Maximize2,
  minimize: Minimize2,
  external: ExternalLink,
  search: Search,
  sparkles: Sparkles,
  
  // Status Indicators
  statusSuccess: CheckCircle2,
  statusWarning: AlertCircle,
  statusCritical: AlertTriangle,
  statusPending: Clock,
  statusCheck: Check
};

export type SemanticIconKey = keyof typeof SemanticIcons;

interface SemanticIconProps extends LucideProps {
  name: SemanticIconKey;
  sizeVariant?: keyof typeof IconSize;
  colorVariant?: keyof typeof IconColor;
}

export const SemanticIcon: React.FC<SemanticIconProps> = ({
  name,
  sizeVariant = 'medium',
  colorVariant = 'neutral',
  className = '',
  ...props
}) => {
  const IconComponent = SemanticIcons[name] || Activity;
  const sizeClass = IconSize[sizeVariant];
  const colorClass = IconColor[colorVariant];

  return (
    <IconComponent
      className={`${sizeClass} ${colorClass} ${className} shrink-0 stroke-[1.85]`}
      {...props}
    />
  );
};
