import { usePage, router } from "@inertiajs/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useTranslation } from "../lib/useTranslation";
import { colors, typography, radii } from "../styles/tokens";

const s = {
  container: {
    minHeight: "100vh",
    background: colors.bg,
    display: "flex",
    justifyContent: "center",
    padding: "80px 40px",
  },
  content: { maxWidth: 960, width: "100%" },
  header: { marginBottom: 40 },
  title: {
    fontFamily: typography.fontFamily.heading,
    fontSize: typography.fontSize["3xl"],
    fontWeight: typography.fontWeight.light,
    color: colors.text.primary,
    letterSpacing: "-0.02em",
    marginBottom: 16,
  },
  newBtn: {
    padding: "8px 20px",
    background: colors.accentBright,
    color: colors.text.primary,
    border: "none",
    borderRadius: radii.md,
    fontFamily: typography.fontFamily.body,
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.medium,
    cursor: "pointer",
    letterSpacing: "0.02em",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
    gap: 16,
  },
  card: {
    background: colors.surface,
    border: `1px solid ${colors.border}`,
    borderRadius: radii.lg,
    padding: 20,
    boxShadow: colors.shadow.card,
    cursor: "pointer",
    transition: "all 0.15s",
    position: "relative",
  },
  cardTitle: {
    fontFamily: typography.fontFamily.heading,
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.light,
    color: colors.text.primary,
    marginBottom: 8,
  },
  badge: {
    display: "inline-block",
    padding: "2px 8px",
    background: `${colors.accentBright}22`,
    color: colors.accentBright,
    borderRadius: radii.md,
    fontFamily: typography.fontFamily.body,
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.medium,
    letterSpacing: "0.06em",
    textTransform: "uppercase",
    marginBottom: 8,
  },
  date: {
    fontFamily: typography.fontFamily.body,
    fontSize: typography.fontSize.sm,
    color: colors.text.muted,
  },
  deleteBtn: {
    position: "absolute",
    top: 12,
    right: 12,
    padding: "4px 8px",
    background: "transparent",
    color: colors.text.muted,
    border: "none",
    borderRadius: radii.md,
    fontSize: "14px",
    cursor: "pointer",
    opacity: 0,
    transition: "opacity 0.15s",
  },
  empty: {
    textAlign: "center",
    padding: 60,
    color: colors.text.muted,
    fontFamily: typography.fontFamily.body,
    fontSize: typography.fontSize.md,
  },
};

export default function Home() {
  const { reports } = usePage().props;
  const { t } = useTranslation();

  return (
    <div style={s.container}>
      <div style={s.content}>
        <div style={s.header}>
          <h1 style={s.title}>{t("reports.title")}</h1>
          <button style={s.newBtn} onClick={() => router.post("/reports")}>
            + {t("reports.new")}
          </button>
        </div>

        {reports?.length > 0 ? (
          <div style={s.grid}>
            {reports.map((r) => (
              <div
                key={r.id}
                style={{ ...s.card, borderLeft: `3px solid ${r.accent_color || colors.accentBright}` }}
                onClick={() => router.visit(`/reports/${r.id}`)}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow = colors.shadow.page;
                  e.currentTarget.querySelector("[data-delete]").style.opacity = "1";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "";
                  e.currentTarget.style.boxShadow = colors.shadow.card;
                  e.currentTarget.querySelector("[data-delete]").style.opacity = "0";
                }}
              >
                <button
                  data-delete
                  style={s.deleteBtn}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (confirm(t("reports.delete_confirm"))) {
                      router.delete(`/reports/${r.id}`);
                    }
                  }}
                >
                  <FontAwesomeIcon icon="times" />
                </button>
                <h3 style={s.cardTitle}>{r.title}</h3>
                <div style={s.badge}>{t(`reports.types.${r.report_type}`)}</div>
                <p style={s.date}>{new Date(r.updated_at).toLocaleDateString()}</p>
              </div>
            ))}
          </div>
        ) : (
          <p style={s.empty}>{t("reports.empty")}</p>
        )}
      </div>
    </div>
  );
}
