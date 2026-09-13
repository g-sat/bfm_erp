export type ApiResponse<T> = {
  result: number;
  message: string;
  data: T;
};

export type User = {
  id: number;
  username: string;
  full_name: string;
  email: string;
  role: string;
  phone?: string | null;
  is_verified: boolean;
  business_id?: number | null;
  creator_id?: number | null;
};

export type Company = {
  id: number;
  code: string;
  name: string;
  tagline: string;
  email?: string | null;
  phone?: string | null;
};

export type Business = {
  id: number;
  code: string;
  name: string;
  industry?: string | null;
  contact_name?: string | null;
  email?: string | null;
  phone?: string | null;
  subscription: string;
  team_size: number;
  is_active: boolean;
};

export type Creator = {
  id: number;
  code: string;
  display_name: string;
  headline?: string | null;
  bio?: string | null;
  skills?: string | null;
  categories?: string | null;
  experience_years: number;
  hourly_rate: number;
  day_rate: number;
  availability: string;
  portfolio_url?: string | null;
  location?: string | null;
  rating_avg: number;
  rating_count: number;
  is_verified: boolean;
};

export type Milestone = {
  id: number;
  project_id: number;
  title: string;
  description?: string | null;
  due_date?: string | null;
  amount: number;
  status: string;
  sort_order: number;
};

export type Task = {
  id: number;
  project_id: number;
  title: string;
  status: string;
  due_date?: string | null;
  estimated_hours: number;
  logged_hours: number;
};

export type Project = {
  id: number;
  code: string;
  title: string;
  brief?: string | null;
  category?: string | null;
  status: string;
  priority: string;
  budget: number;
  quoted_amount?: number | null;
  currency: string;
  start_date?: string | null;
  due_date?: string | null;
  business_id: number;
  pm_user_id?: number | null;
  creator_id?: number | null;
  progress_pct: number;
  requirements?: string | null;
  business?: Business;
  creator?: Creator;
  milestones?: Milestone[];
  tasks?: Task[];
};

export type Assignment = {
  id: number;
  project_id: number;
  creator_id: number;
  status: string;
  match_score: number;
  offer_amount?: number | null;
  notes?: string | null;
  creator?: Creator;
  project?: Project;
};

export type Message = {
  id: number;
  project_id: number;
  sender_user_id: number;
  body: string;
  message_type: string;
  created_at?: string;
  sender?: User;
};

export type ProjectFile = {
  id: number;
  project_id: number;
  name: string;
  file_type: string;
  url: string;
  version: number;
  notes?: string | null;
  uploaded_by?: number | null;
};

export type QualityReview = {
  id: number;
  project_id: number;
  milestone_id?: number | null;
  stage: string;
  status: string;
  feedback?: string | null;
  reviewer_user_id?: number | null;
};

export type Invoice = {
  id: number;
  invoice_no: string;
  project_id: number;
  business_id: number;
  amount: number;
  tax_amount: number;
  total_amount: number;
  currency: string;
  status: string;
  due_date?: string | null;
  project?: Project;
  business?: Business;
};

export type Payment = {
  id: number;
  payment_no: string;
  invoice_id?: number | null;
  project_id: number;
  direction: string;
  amount: number;
  currency: string;
  status: string;
  gateway: string;
  gateway_ref?: string | null;
  payee_creator_id?: number | null;
  notes?: string | null;
};

export type Review = {
  id: number;
  project_id: number;
  from_user_id: number;
  to_role: string;
  to_creator_id?: number | null;
  to_business_id?: number | null;
  rating: number;
  comment?: string | null;
};

export type Notification = {
  id: number;
  user_id: number;
  title: string;
  body: string;
  channel: string;
  is_read: boolean;
  link?: string | null;
};

export type ChartSlice = { name: string; value: number };
export type CashflowPoint = { name: string; inbound: number; payout: number };
export type ProgressPoint = { name: string; progress: number; status: string };

export type Dashboard = {
  projects_total: number;
  projects_active: number;
  projects_in_qa: number;
  businesses: number;
  creators: number;
  creators_available: number;
  invoices_open: number;
  revenue_collected: number;
  payouts_pending: number;
  unread_notifications: number;
  recent_projects: Project[];
  recent_invoices: Invoice[];
  projects_by_status?: ChartSlice[];
  projects_by_category?: ChartSlice[];
  creators_by_availability?: ChartSlice[];
  invoices_by_status?: ChartSlice[];
  cashflow?: CashflowPoint[];
  delivery_progress?: ProgressPoint[];
  avg_progress?: number;
  assignments_open?: number;
  quality_pending?: number;
};
