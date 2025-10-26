// Database types for Cloudflare D1
export type CloudflareBindings = {
  DB: D1Database;
};

export interface User {
  id: string;
  email: string;
  password_hash: string;
  role: 'admin' | 'agent';
  first_name?: string;
  last_name?: string;
  is_active: number;
  created_at: string;
  last_login?: string;
}

export interface Project {
  id: string;
  name: string;
  created_by: string;
  api_tier: 'full' | 'partial' | 'minimal';
  status: 'pending' | 'processing' | 'completed' | 'error';
  total_leads: number;
  processed_leads: number;
  created_at: string;
  updated_at: string;
}

export interface Lead {
  id: string;
  project_id: string;
  domain: string;
  company?: string;
  contact_name?: string;
  phone?: string;
  email?: string;
  assigned_to?: string;
  assigned_at?: string;
  original_csv_data?: string;
  created_at: string;
}

export interface SpyFuData {
  id: string;
  domain: string;
  api_1_trends?: string; // JSON string
  api_2_page1?: string; // JSON string
  api_3_money?: string; // JSON string
  api_4_competitors?: string; // JSON string
  tier_used?: 'full' | 'partial' | 'minimal';
  fetched_at: string;
  error_message?: string;
}

export interface RankingNuggets {
  id: string;
  lead_id: string;
  domain: string;
  nugget_1_snapshot?: string;
  nugget_2_page1?: string;
  nugget_3_page2?: string;
  nugget_4_quickwins?: string;
  nugget_5_historical?: string;
  nugget_6_local_l1?: string;
  nugget_7_local_l2?: string;
  nugget_8_kw_traffic?: string;
  nugget_9_top_cpc_kw?: string;
  nugget_10_top_traffic_kw?: string;
  nugget_11_competitor_1?: string;
  nugget_12_competitor_2?: string;
  nugget_13_competitor_ranks?: string;
  nugget_14_competitor_3?: string;
  nugget_15_competitor_4?: string;
  nugget_16_comp_hot_buttons?: string;
  nugget_17_client_1mo?: string;
  nugget_18_client_2mo?: string;
  nugget_19_client_3mo?: string;
  nugget_20_client_4mo?: string;
  nugget_21_local_l3?: string;
  nugget_22_local_l4?: string;
  nugget_23_local_l5?: string;
  nugget_24_lowhang_1?: string;
  nugget_25_lowhang_2?: string;
  nugget_26_lowhang_3?: string;
  nugget_27_lowhang_4?: string;
  nugget_28_lowhang_5?: string;
  nugget_29_money_kw_2?: string;
  nugget_30_money_kw_3?: string;
  nugget_31_money_kw_4?: string;
  nugget_32_money_kw_5?: string;
  calculated_at: string;
}

export interface Export {
  id: string;
  project_id: string;
  export_type: 'readymode' | 'mail' | 'full' | 'custom' | 'hotsheet';
  filename: string;
  download_url?: string;
  created_at: string;
  config?: string; // JSON string
}

// CSV Parsing Types
export interface ParsedLead {
  domain: string;
  company?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  originalData: Record<string, any>;
}

export interface CsvParseResult {
  leads: ParsedLead[];
  totalRows: number;
  validLeads: number;
  websiteColumn: string;
  errors: string[];
}
