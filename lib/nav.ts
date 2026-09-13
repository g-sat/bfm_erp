import {
  LayoutDashboard,
  Users,
  Briefcase,
  Sparkles,
  GitBranch,
  MessageSquare,
  ClipboardList,
  BadgeCheck,
  Wallet,
  Building2,
  Star,
  Bell,
  type LucideIcon,
} from "lucide-react";

export type NavItem = {
  label: string;
  href?: string;
  icon?: LucideIcon;
  children?: { label: string; href: string }[];
  roles?: string[];
};

export const NAV: NavItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  {
    label: "Users & Roles",
    icon: Users,
    children: [
      { label: "Users", href: "/users" },
      { label: "Businesses", href: "/businesses" },
      { label: "Creatives", href: "/creatives" },
    ],
  },
  {
    label: "Project Intake",
    icon: Briefcase,
    children: [
      { label: "All Projects", href: "/projects" },
      { label: "New Intake", href: "/projects/new" },
    ],
  },
  {
    label: "Talent Matching",
    icon: Sparkles,
    children: [
      { label: "Matching Board", href: "/matching" },
      { label: "Assignments", href: "/assignments" },
    ],
  },
  {
    label: "Collaboration",
    icon: MessageSquare,
    children: [
      { label: "Messages", href: "/collaboration" },
      { label: "Notifications", href: "/notifications" },
    ],
  },
  {
    label: "Project Mgmt",
    icon: ClipboardList,
    children: [
      { label: "Active Work", href: "/delivery" },
      { label: "Projects", href: "/projects" },
    ],
  },
  {
    label: "Quality & Delivery",
    icon: BadgeCheck,
    children: [{ label: "QA Reviews", href: "/quality" }],
  },
  {
    label: "Billing & Payments",
    icon: Wallet,
    children: [
      { label: "Invoices", href: "/billing/invoices" },
      { label: "Payments & Payouts", href: "/billing/payments" },
    ],
  },
  {
    label: "Reviews",
    icon: Star,
    href: "/reviews",
  },
  {
    label: "Platform",
    icon: Building2,
    children: [{ label: "Company", href: "/settings/company" }],
  },
];

export const ROLE_LABELS: Record<string, string> = {
  admin: "Admin",
  business: "Business / Client",
  creative: "Creative Professional",
  pm: "Project Manager",
};
