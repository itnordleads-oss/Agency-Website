/**
 * Dummy data for the MegaPersonals Automation Panel portfolio demo.
 * Not connected to any live MegaPersonals API or real accounts.
 */

export type AccountStatus = "Active" | "Inactive";
export type AdStatus = "Posted" | "Pending" | "Draft";

export type DemoAccount = {
  id: number;
  gmailId: string;
  megaPersonalsId: string;
  profileToken: string;
  accountStatus: AccountStatus;
  adStatus: AdStatus;
  location: string;
  createdAt: string;
};

export type DemoAd = {
  id: string;
  title: string;
  location: string;
  date: string;
  status: AdStatus;
  tone: "violet" | "blue" | "rose" | "amber";
};

export type DemoGmail = {
  id: string;
  email: string;
  linkedAccounts: number;
  status: "Connected" | "Needs reauth" | "Idle";
  lastSync: string;
};

export type DemoActivity = {
  id: string;
  message: string;
  time: string;
  tone: "green" | "blue" | "orange" | "red";
};

export type DemoLocation = {
  id: string;
  city: string;
  state: string;
  accounts: number;
  active: boolean;
};

export const DEMO_STATS = [
  { id: "total", label: "Total Accounts", value: 100, delta: "+12%", tone: "blue" as const },
  { id: "active", label: "Active Accounts", value: 87, delta: "+8%", tone: "green" as const },
  { id: "ads", label: "Total Ads Posted", value: 86, delta: "+15%", tone: "violet" as const },
  {
    id: "pending",
    label: "Pending Actions",
    value: 7,
    delta: "Needs review",
    tone: "orange" as const,
  },
];

export const DEMO_ACCOUNTS: DemoAccount[] = [
  {
    id: 1,
    gmailId: "demo.user01@gmail.com",
    megaPersonalsId: "MP-10482",
    profileToken: "tok_8f2a…c91",
    accountStatus: "Active",
    adStatus: "Posted",
    location: "New York, NY",
    createdAt: "2026-10-02",
  },
  {
    id: 2,
    gmailId: "demo.user02@gmail.com",
    megaPersonalsId: "MP-10491",
    profileToken: "tok_3bb1…a04",
    accountStatus: "Active",
    adStatus: "Pending",
    location: "Los Angeles, CA",
    createdAt: "2026-10-05",
  },
  {
    id: 3,
    gmailId: "demo.user03@gmail.com",
    megaPersonalsId: "MP-10503",
    profileToken: "tok_91cd…e77",
    accountStatus: "Inactive",
    adStatus: "Draft",
    location: "Chicago, IL",
    createdAt: "2026-10-08",
  },
  {
    id: 4,
    gmailId: "demo.user04@gmail.com",
    megaPersonalsId: "MP-10518",
    profileToken: "tok_55e0…b12",
    accountStatus: "Active",
    adStatus: "Posted",
    location: "Miami, FL",
    createdAt: "2026-10-11",
  },
  {
    id: 5,
    gmailId: "demo.user05@gmail.com",
    megaPersonalsId: "MP-10527",
    profileToken: "tok_c0a9…441",
    accountStatus: "Active",
    adStatus: "Posted",
    location: "Houston, TX",
    createdAt: "2026-10-14",
  },
  {
    id: 6,
    gmailId: "demo.user06@gmail.com",
    megaPersonalsId: "MP-10541",
    profileToken: "tok_17d4…9fe",
    accountStatus: "Inactive",
    adStatus: "Pending",
    location: "Seattle, WA",
    createdAt: "2026-10-16",
  },
];

export const DEMO_ADS: DemoAd[] = [
  {
    id: "ad-1",
    title: "Relaxing Massage Service",
    location: "New York, NY",
    date: "Oct 18, 2026",
    status: "Posted",
    tone: "violet",
  },
  {
    id: "ad-2",
    title: "Professional Companion Listing",
    location: "Los Angeles, CA",
    date: "Oct 17, 2026",
    status: "Pending",
    tone: "blue",
  },
  {
    id: "ad-3",
    title: "Evening Wellness Session",
    location: "Miami, FL",
    date: "Oct 16, 2026",
    status: "Posted",
    tone: "rose",
  },
  {
    id: "ad-4",
    title: "Private Appointment Booking",
    location: "Houston, TX",
    date: "Oct 15, 2026",
    status: "Draft",
    tone: "amber",
  },
];

export const DEMO_GMAIL: DemoGmail[] = [
  {
    id: "g1",
    email: "demo.user01@gmail.com",
    linkedAccounts: 2,
    status: "Connected",
    lastSync: "2 min ago",
  },
  {
    id: "g2",
    email: "demo.user02@gmail.com",
    linkedAccounts: 1,
    status: "Connected",
    lastSync: "14 min ago",
  },
  {
    id: "g3",
    email: "demo.ops@gmail.com",
    linkedAccounts: 4,
    status: "Needs reauth",
    lastSync: "1 day ago",
  },
  {
    id: "g4",
    email: "demo.batch@gmail.com",
    linkedAccounts: 0,
    status: "Idle",
    lastSync: "Never",
  },
];

export const DEMO_ACTIVITY: DemoActivity[] = [
  {
    id: "a1",
    message: "Account registered successfully (MP-10541)",
    time: "2 minutes ago",
    tone: "green",
  },
  {
    id: "a2",
    message: "Ad posted to New York, NY",
    time: "18 minutes ago",
    tone: "blue",
  },
  {
    id: "a3",
    message: "Gmail sync completed for 3 inboxes",
    time: "1 hour ago",
    tone: "blue",
  },
  {
    id: "a4",
    message: "Pending review: 2 ads awaiting approval",
    time: "3 hours ago",
    tone: "orange",
  },
  {
    id: "a5",
    message: "Inactive account flagged (MP-10503)",
    time: "Yesterday",
    tone: "red",
  },
];

export const DEMO_LOCATIONS: DemoLocation[] = [
  { id: "ny", city: "New York", state: "NY", accounts: 18, active: true },
  { id: "la", city: "Los Angeles", state: "CA", accounts: 14, active: true },
  { id: "chi", city: "Chicago", state: "IL", accounts: 9, active: true },
  { id: "mia", city: "Miami", state: "FL", accounts: 11, active: true },
  { id: "hou", city: "Houston", state: "TX", accounts: 8, active: false },
  { id: "sea", city: "Seattle", state: "WA", accounts: 6, active: true },
  { id: "atl", city: "Atlanta", state: "GA", accounts: 7, active: false },
  { id: "den", city: "Denver", state: "CO", accounts: 5, active: true },
];

export const DEMO_CHART_POINTS = [
  { day: "Oct 1", accounts: 62, ads: 40, active: 51 },
  { day: "Oct 5", accounts: 71, ads: 48, active: 58 },
  { day: "Oct 10", accounts: 79, ads: 57, active: 66 },
  { day: "Oct 15", accounts: 88, ads: 69, active: 74 },
  { day: "Oct 20", accounts: 94, ads: 78, active: 81 },
  { day: "Oct 25", accounts: 98, ads: 83, active: 85 },
  { day: "Oct 31", accounts: 100, ads: 86, active: 87 },
];

export const DEMO_AUTOMATION = {
  autoRegistration: true,
  autoAdPosting: true,
  autoAdUpdate: false,
  scheduleLabel: "Daily at 09:00 AM ET",
};

export const DEMO_BASE_PATH = "/demos/megapersonals-automation";

export type MegaDemoPageId =
  | "dashboard"
  | "accounts"
  | "advertisements"
  | "gmail"
  | "locations"
  | "automation"
  | "reports"
  | "settings";

export const MEGA_DEMO_NAV: { id: MegaDemoPageId; label: string; path: string }[] = [
  { id: "dashboard", label: "Dashboard", path: DEMO_BASE_PATH },
  { id: "accounts", label: "Accounts", path: `${DEMO_BASE_PATH}/accounts` },
  { id: "advertisements", label: "Advertisements", path: `${DEMO_BASE_PATH}/advertisements` },
  { id: "gmail", label: "Gmail Accounts", path: `${DEMO_BASE_PATH}/gmail` },
  { id: "locations", label: "Location Targeting", path: `${DEMO_BASE_PATH}/locations` },
  { id: "automation", label: "Automation", path: `${DEMO_BASE_PATH}/automation` },
  { id: "reports", label: "Reports", path: `${DEMO_BASE_PATH}/reports` },
  { id: "settings", label: "Settings", path: `${DEMO_BASE_PATH}/settings` },
];

export function resolveMegaDemoPage(pathname: string): MegaDemoPageId {
  const normalized = pathname.replace(/\/+$/, "") || DEMO_BASE_PATH;
  if (normalized === DEMO_BASE_PATH) {
    return "dashboard";
  }
  const match = MEGA_DEMO_NAV.find(
    (item) => item.path !== DEMO_BASE_PATH && normalized === item.path
  );
  return match?.id ?? "dashboard";
}
