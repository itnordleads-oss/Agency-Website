import React, { useEffect, useMemo, useState } from "react";
import {
  Activity,
  Bell,
  ChartNoAxesCombined,
  LayoutDashboard,
  LocateFixed,
  Mail,
  MapPinned,
  Megaphone,
  Search,
  Settings,
  Shield,
  Users,
  Workflow,
  ArrowLeft,
} from "lucide-react";
import { navigateAppPath } from "../../App";
import {
  DEMO_ACCOUNTS,
  DEMO_ACTIVITY,
  DEMO_ADS,
  DEMO_AUTOMATION,
  DEMO_BASE_PATH,
  DEMO_CHART_POINTS,
  DEMO_GMAIL,
  DEMO_LOCATIONS,
  DEMO_STATS,
  MEGA_DEMO_NAV,
  resolveMegaDemoPage,
  type MegaDemoPageId,
} from "./data";
import "./megapersonalsDemo.css";

type Props = {
  path: string;
};

const NAV_ICONS: Record<MegaDemoPageId, React.ReactNode> = {
  dashboard: <LayoutDashboard className="h-4 w-4" aria-hidden />,
  accounts: <Users className="h-4 w-4" aria-hidden />,
  advertisements: <Megaphone className="h-4 w-4" aria-hidden />,
  gmail: <Mail className="h-4 w-4" aria-hidden />,
  locations: <MapPinned className="h-4 w-4" aria-hidden />,
  automation: <Workflow className="h-4 w-4" aria-hidden />,
  reports: <ChartNoAxesCombined className="h-4 w-4" aria-hidden />,
  settings: <Settings className="h-4 w-4" aria-hidden />,
};

function StatusPill({
  label,
  tone,
}: {
  label: string;
  tone: "green" | "red" | "orange" | "blue" | "violet" | "muted";
}) {
  return <span className={`mp-demo__pill ${tone}`}>{label}</span>;
}

function accountStatusTone(status: string) {
  return status === "Active" ? "green" : "red";
}

function adStatusTone(status: string) {
  if (status === "Posted") {
    return "green";
  }
  if (status === "Pending") {
    return "orange";
  }
  return "muted";
}

function QuickStatsChart() {
  const width = 520;
  const height = 160;
  const pad = 18;
  const maxY = 110;
  const toX = (index: number) =>
    pad + (index / Math.max(DEMO_CHART_POINTS.length - 1, 1)) * (width - pad * 2);
  const toY = (value: number) => height - pad - (value / maxY) * (height - pad * 2);

  const line = (key: "accounts" | "ads" | "active") =>
    DEMO_CHART_POINTS.map((point, index) => `${toX(index)},${toY(point[key])}`).join(" ");

  return (
    <div>
      <svg
        className="mp-demo__chart"
        viewBox={`0 0 ${width} ${height}`}
        role="img"
        aria-label="Quick stats chart"
      >
        <polyline fill="none" stroke="#3b82f6" strokeWidth="2.5" points={line("accounts")} />
        <polyline fill="none" stroke="#6366f1" strokeWidth="2.5" points={line("ads")} />
        <polyline fill="none" stroke="#10b981" strokeWidth="2.5" points={line("active")} />
      </svg>
      <div className="mp-demo__legend">
        <span>
          <i style={{ background: "#3b82f6" }} /> Accounts
        </span>
        <span>
          <i style={{ background: "#6366f1" }} /> Ads Posted
        </span>
        <span>
          <i style={{ background: "#10b981" }} /> Active Accounts
        </span>
      </div>
    </div>
  );
}

function UsMap() {
  return (
    <div className="mp-demo__map" aria-label="US location targeting map">
      <svg viewBox="0 0 400 220" aria-hidden>
        <path
          d="M40 70 L90 55 L140 60 L180 48 L230 52 L280 45 L330 58 L360 80 L350 120 L320 150 L270 165 L220 155 L170 170 L120 160 L70 145 L45 110 Z"
          fill="rgba(148,163,184,0.12)"
          stroke="rgba(148,163,184,0.35)"
          strokeWidth="2"
        />
      </svg>
      <span className="mp-demo__pin" style={{ left: "68%", top: "28%" }} />
      <span className="mp-demo__pin" style={{ left: "18%", top: "42%" }} />
      <span className="mp-demo__pin" style={{ left: "48%", top: "38%" }} />
      <span className="mp-demo__pin" style={{ left: "62%", top: "58%" }} />
      <span className="mp-demo__pin" style={{ left: "28%", top: "55%" }} />
    </div>
  );
}

function DashboardPage({
  automation,
  setAutomation,
}: {
  automation: typeof DEMO_AUTOMATION;
  setAutomation: React.Dispatch<React.SetStateAction<typeof DEMO_AUTOMATION>>;
}) {
  return (
    <>
      <div className="mp-demo__grid-stats">
        {DEMO_STATS.map((stat) => (
          <article key={stat.id} className="mp-demo__card mp-demo__stat">
            <div>
              <div className="mp-demo__stat-label">{stat.label}</div>
              <div className="mp-demo__stat-value">{stat.value}</div>
              <div className={`mp-demo__stat-delta mp-demo__delta ${stat.tone}`}>{stat.delta}</div>
            </div>
            <div className={`mp-demo__stat-icon ${stat.tone}`}>
              {stat.id === "total" ? <Users className="h-4 w-4" /> : null}
              {stat.id === "active" ? <Shield className="h-4 w-4" /> : null}
              {stat.id === "ads" ? <Megaphone className="h-4 w-4" /> : null}
              {stat.id === "pending" ? <Activity className="h-4 w-4" /> : null}
            </div>
          </article>
        ))}
      </div>

      <div className="mp-demo__grid-actions">
        <article className="mp-demo__card mp-demo__action">
          <div className="mp-demo__stat-icon violet">
            <Users className="h-4 w-4" />
          </div>
          <h3>Bulk Account Registration</h3>
          <p>Create multiple demo accounts with shared defaults and location presets.</p>
          <button type="button" className="mp-demo__btn violet">
            Start Registration
          </button>
        </article>
        <article className="mp-demo__card mp-demo__action">
          <div className="mp-demo__stat-icon blue">
            <Mail className="h-4 w-4" />
          </div>
          <h3>Gmail Integration</h3>
          <p>Connect demo inboxes used for account verification and recovery flows.</p>
          <button type="button" className="mp-demo__btn blue">
            Manage Gmail
          </button>
        </article>
        <article className="mp-demo__card mp-demo__action">
          <div className="mp-demo__stat-icon green">
            <Megaphone className="h-4 w-4" />
          </div>
          <h3>Advertisement Posting</h3>
          <p>Draft and schedule demo listings across selected US cities.</p>
          <button type="button" className="mp-demo__btn green">
            Create New Ad
          </button>
        </article>
        <article className="mp-demo__card mp-demo__action">
          <div className="mp-demo__stat-icon orange">
            <LocateFixed className="h-4 w-4" />
          </div>
          <h3>Location Targeting</h3>
          <p>Choose metro areas for demo account distribution and ad coverage.</p>
          <button type="button" className="mp-demo__btn orange">
            Select Locations
          </button>
        </article>
      </div>

      <section className="mp-demo__card mp-demo__table-wrap">
        <h2 className="mp-demo__section-title">Accounts Overview</h2>
        <table className="mp-demo__table">
          <thead>
            <tr>
              <th>#</th>
              <th>Gmail ID</th>
              <th>MegaPersonals ID</th>
              <th>Profile Token</th>
              <th>Account Status</th>
              <th>Ad Status</th>
              <th>Location</th>
              <th>Created At</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {DEMO_ACCOUNTS.map((account) => (
              <tr key={account.id}>
                <td>{account.id}</td>
                <td>{account.gmailId}</td>
                <td>{account.megaPersonalsId}</td>
                <td>{account.profileToken}</td>
                <td>
                  <StatusPill
                    label={account.accountStatus}
                    tone={accountStatusTone(account.accountStatus)}
                  />
                </td>
                <td>
                  <StatusPill label={account.adStatus} tone={adStatusTone(account.adStatus)} />
                </td>
                <td>{account.location}</td>
                <td>{account.createdAt}</td>
                <td>
                  <button type="button" className="mp-demo__btn ghost">
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <div className="mp-demo__grid-bottom">
        <section className="mp-demo__card">
          <h2 className="mp-demo__section-title">Advertisement Manager</h2>
          {DEMO_ADS.map((ad) => (
            <div key={ad.id} className="mp-demo__ad-row">
              <div className={`mp-demo__thumb ${ad.tone}`} aria-hidden />
              <div className="mp-demo__ad-meta">
                <strong>{ad.title}</strong>
                <span>
                  {ad.location} · {ad.date}
                </span>
              </div>
              <StatusPill label={ad.status} tone={adStatusTone(ad.status)} />
            </div>
          ))}
        </section>

        <section className="mp-demo__card">
          <h2 className="mp-demo__section-title">US Location Targeting</h2>
          <UsMap />
        </section>

        <section className="mp-demo__card">
          <h2 className="mp-demo__section-title">Automation Control</h2>
          {(
            [
              ["autoRegistration", "Auto Account Registration"],
              ["autoAdPosting", "Auto Ad Posting"],
              ["autoAdUpdate", "Auto Ad Update"],
            ] as const
          ).map(([key, label]) => (
            <div key={key} className="mp-demo__toggle-row">
              <span>{label}</span>
              <button
                type="button"
                className={`mp-demo__switch${automation[key] ? " is-on" : ""}`}
                aria-pressed={automation[key]}
                onClick={() => setAutomation((prev) => ({ ...prev, [key]: !prev[key] }))}
              >
                <span />
              </button>
            </div>
          ))}
          <button type="button" className="mp-demo__btn blue">
            Set Schedule · {automation.scheduleLabel}
          </button>
        </section>
      </div>

      <div className="mp-demo__grid-footer">
        <section className="mp-demo__card">
          <h2 className="mp-demo__section-title">Recent Activity Logs</h2>
          {DEMO_ACTIVITY.map((item) => (
            <div key={item.id} className="mp-demo__activity">
              <i className={`mp-demo__dot ${item.tone}`} />
              <div>
                <strong>{item.message}</strong>
                <span>{item.time}</span>
              </div>
            </div>
          ))}
        </section>
        <section className="mp-demo__card">
          <h2 className="mp-demo__section-title">Quick Stats</h2>
          <QuickStatsChart />
        </section>
      </div>
    </>
  );
}

function AccountsPage() {
  return (
    <section className="mp-demo__card mp-demo__table-wrap">
      <h2 className="mp-demo__section-title">All demo accounts</h2>
      <table className="mp-demo__table">
        <thead>
          <tr>
            <th>#</th>
            <th>Gmail ID</th>
            <th>MegaPersonals ID</th>
            <th>Status</th>
            <th>Ad Status</th>
            <th>Location</th>
            <th>Created</th>
          </tr>
        </thead>
        <tbody>
          {DEMO_ACCOUNTS.map((account) => (
            <tr key={account.id}>
              <td>{account.id}</td>
              <td>{account.gmailId}</td>
              <td>{account.megaPersonalsId}</td>
              <td>
                <StatusPill
                  label={account.accountStatus}
                  tone={accountStatusTone(account.accountStatus)}
                />
              </td>
              <td>
                <StatusPill label={account.adStatus} tone={adStatusTone(account.adStatus)} />
              </td>
              <td>{account.location}</td>
              <td>{account.createdAt}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}

function AdvertisementsPage() {
  return (
    <div className="mp-demo__stack">
      {DEMO_ADS.map((ad) => (
        <article key={ad.id} className="mp-demo__card mp-demo__ad-row" style={{ borderBottom: 0 }}>
          <div className={`mp-demo__thumb ${ad.tone}`} aria-hidden />
          <div className="mp-demo__ad-meta">
            <strong>{ad.title}</strong>
            <span>
              {ad.location} · {ad.date}
            </span>
          </div>
          <StatusPill label={ad.status} tone={adStatusTone(ad.status)} />
          <button type="button" className="mp-demo__btn ghost">
            Edit
          </button>
        </article>
      ))}
    </div>
  );
}

function GmailPage() {
  return (
    <section className="mp-demo__card mp-demo__table-wrap">
      <h2 className="mp-demo__section-title">Connected Gmail accounts (dummy)</h2>
      <table className="mp-demo__table">
        <thead>
          <tr>
            <th>Email</th>
            <th>Linked accounts</th>
            <th>Status</th>
            <th>Last sync</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {DEMO_GMAIL.map((row) => (
            <tr key={row.id}>
              <td>{row.email}</td>
              <td>{row.linkedAccounts}</td>
              <td>
                <StatusPill
                  label={row.status}
                  tone={
                    row.status === "Connected"
                      ? "green"
                      : row.status === "Needs reauth"
                        ? "orange"
                        : "muted"
                  }
                />
              </td>
              <td>{row.lastSync}</td>
              <td>
                <button type="button" className="mp-demo__btn ghost">
                  Manage
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}

function LocationsPage() {
  return (
    <div className="mp-demo__grid-footer">
      <section className="mp-demo__card">
        <h2 className="mp-demo__section-title">Target cities</h2>
        <table className="mp-demo__table">
          <thead>
            <tr>
              <th>City</th>
              <th>State</th>
              <th>Accounts</th>
              <th>Coverage</th>
            </tr>
          </thead>
          <tbody>
            {DEMO_LOCATIONS.map((loc) => (
              <tr key={loc.id}>
                <td>{loc.city}</td>
                <td>{loc.state}</td>
                <td>{loc.accounts}</td>
                <td>
                  <StatusPill
                    label={loc.active ? "Active" : "Paused"}
                    tone={loc.active ? "green" : "muted"}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
      <section className="mp-demo__card">
        <h2 className="mp-demo__section-title">Map preview</h2>
        <UsMap />
      </section>
    </div>
  );
}

function AutomationPage({
  automation,
  setAutomation,
}: {
  automation: typeof DEMO_AUTOMATION;
  setAutomation: React.Dispatch<React.SetStateAction<typeof DEMO_AUTOMATION>>;
}) {
  return (
    <section className="mp-demo__card" style={{ maxWidth: "40rem" }}>
      <h2 className="mp-demo__section-title">Automation rules</h2>
      {(
        [
          ["autoRegistration", "Auto Account Registration"],
          ["autoAdPosting", "Auto Ad Posting"],
          ["autoAdUpdate", "Auto Ad Update"],
        ] as const
      ).map(([key, label]) => (
        <div key={key} className="mp-demo__toggle-row">
          <span>{label}</span>
          <button
            type="button"
            className={`mp-demo__switch${automation[key] ? " is-on" : ""}`}
            aria-pressed={automation[key]}
            onClick={() => setAutomation((prev) => ({ ...prev, [key]: !prev[key] }))}
          >
            <span />
          </button>
        </div>
      ))}
      <p style={{ color: "#9aa6b8", fontSize: "0.85rem", margin: "0 0 0.85rem" }}>
        Schedule: {automation.scheduleLabel}
      </p>
      <button type="button" className="mp-demo__btn blue">
        Save schedule (demo)
      </button>
    </section>
  );
}

function ReportsPage() {
  return (
    <div className="mp-demo__grid-footer">
      <section className="mp-demo__card">
        <h2 className="mp-demo__section-title">Trend report</h2>
        <QuickStatsChart />
      </section>
      <section className="mp-demo__card">
        <h2 className="mp-demo__section-title">Summary (dummy)</h2>
        <div className="mp-demo__stack">
          <div className="mp-demo__toggle-row">
            <span>Accounts created this month</span>
            <strong>38</strong>
          </div>
          <div className="mp-demo__toggle-row">
            <span>Ads posted this month</span>
            <strong>46</strong>
          </div>
          <div className="mp-demo__toggle-row">
            <span>Cities with active coverage</span>
            <strong>6</strong>
          </div>
          <div className="mp-demo__toggle-row">
            <span>Pending reviews</span>
            <strong>7</strong>
          </div>
        </div>
      </section>
    </div>
  );
}

function SettingsPage() {
  return (
    <section className="mp-demo__card" style={{ maxWidth: "40rem" }}>
      <h2 className="mp-demo__section-title">Demo settings</h2>
      <div className="mp-demo__stack">
        <label className="mp-demo__search" style={{ maxWidth: "none" }}>
          Workspace name
          <input defaultValue="MegaPersonals Automation Panel" readOnly />
        </label>
        <label className="mp-demo__search" style={{ maxWidth: "none" }}>
          Admin email
          <input defaultValue="admin@demo.local" readOnly />
        </label>
        <label className="mp-demo__search" style={{ maxWidth: "none" }}>
          Timezone
          <input defaultValue="America/New_York (ET)" readOnly />
        </label>
        <p style={{ color: "#9aa6b8", fontSize: "0.82rem", margin: 0 }}>
          Settings are read-only in this portfolio demo. No credentials are stored.
        </p>
      </div>
    </section>
  );
}

const PAGE_COPY: Record<MegaDemoPageId, { title: string; subtitle: string }> = {
  dashboard: {
    title: "Dashboard",
    subtitle: "Operations overview with dummy accounts, ads, and automation controls.",
  },
  accounts: {
    title: "Accounts",
    subtitle: "Dummy MegaPersonals-linked accounts for portfolio walkthrough.",
  },
  advertisements: {
    title: "Advertisements",
    subtitle: "Sample listings and posting statuses — not live marketplace content.",
  },
  gmail: {
    title: "Gmail Accounts",
    subtitle: "Demo inbox connections used only for UI presentation.",
  },
  locations: {
    title: "Location Targeting",
    subtitle: "US city coverage presets for the demo panel.",
  },
  automation: {
    title: "Automation",
    subtitle: "Toggle demo automation rules. Nothing runs against a real platform.",
  },
  reports: {
    title: "Reports",
    subtitle: "Charts and summaries generated from static dummy data.",
  },
  settings: {
    title: "Settings",
    subtitle: "Read-only workspace preferences for the portfolio demo.",
  },
};

/**
 * Full-screen portfolio demo of the MegaPersonals Automation Panel.
 * Dummy data only — no live MegaPersonals integration.
 */
export default function MegaPersonalsDemoApp({ path }: Props) {
  const page = useMemo(() => resolveMegaDemoPage(path), [path]);
  const [automation, setAutomation] = useState(DEMO_AUTOMATION);
  const copy = PAGE_COPY[page];

  useEffect(() => {
    const previousTitle = document.title;
    document.title = "MegaPersonals Automation Panel · Demo";
    const robots = document.querySelector('meta[name="robots"]');
    const previousRobots = robots?.getAttribute("content") ?? null;
    robots?.setAttribute("content", "noindex, nofollow");
    window.scrollTo({ top: 0, behavior: "auto" });
    return () => {
      document.title = previousTitle;
      if (robots) {
        if (previousRobots) {
          robots.setAttribute("content", previousRobots);
        } else {
          robots.removeAttribute("content");
        }
      }
    };
  }, [page]);

  const go = (nextPath: string) => {
    navigateAppPath(nextPath);
  };

  return (
    <div className="mp-demo">
      <aside className="mp-demo__sidebar">
        <div className="mp-demo__brand">
          <div className="mp-demo__brand-mark">MP</div>
          <div className="mp-demo__brand-copy">
            <strong>MegaPersonals</strong>
            <span>Automation Panel</span>
          </div>
        </div>

        <nav className="mp-demo__nav" aria-label="Demo navigation">
          {MEGA_DEMO_NAV.map((item) => (
            <a
              key={item.id}
              href={item.path}
              className={`mp-demo__nav-link${page === item.id ? " is-active" : ""}`}
              onClick={(event) => {
                event.preventDefault();
                go(item.path);
              }}
            >
              {NAV_ICONS[item.id]}
              {item.label}
            </a>
          ))}
        </nav>

        <button
          type="button"
          className="mp-demo__sidebar-cta"
          onClick={() => go(`${DEMO_BASE_PATH}/accounts`)}
        >
          Create New Account
        </button>
      </aside>

      <div className="mp-demo__main">
        <header className="mp-demo__topbar">
          <a
            href="/projects"
            className="mp-demo__exit"
            onClick={(event) => {
              event.preventDefault();
              go("/projects");
            }}
          >
            <ArrowLeft className="h-3.5 w-3.5" aria-hidden />
            Back to Projects
          </a>
          <label className="mp-demo__search">
            <Search className="h-4 w-4" aria-hidden />
            <input type="search" placeholder="Search accounts, ads, locations…" readOnly />
          </label>
          <div className="mp-demo__top-actions">
            <button type="button" className="mp-demo__icon-btn" aria-label="Notifications">
              <Bell className="h-4 w-4" />
              <span className="mp-demo__badge">3</span>
            </button>
            <div className="mp-demo__profile">
              <span className="mp-demo__avatar">AD</span>
              Admin
            </div>
          </div>
        </header>

        <main className="mp-demo__content">
          <div className="mp-demo__banner" role="note">
            Portfolio demo · all data is dummy · no live MegaPersonals connection
          </div>
          <div className="mp-demo__page-head">
            <div>
              <h1>{copy.title}</h1>
              <p>{copy.subtitle}</p>
            </div>
          </div>

          {page === "dashboard" ? (
            <DashboardPage automation={automation} setAutomation={setAutomation} />
          ) : null}
          {page === "accounts" ? <AccountsPage /> : null}
          {page === "advertisements" ? <AdvertisementsPage /> : null}
          {page === "gmail" ? <GmailPage /> : null}
          {page === "locations" ? <LocationsPage /> : null}
          {page === "automation" ? (
            <AutomationPage automation={automation} setAutomation={setAutomation} />
          ) : null}
          {page === "reports" ? <ReportsPage /> : null}
          {page === "settings" ? <SettingsPage /> : null}
        </main>
      </div>
    </div>
  );
}
