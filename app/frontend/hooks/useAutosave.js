import { useEffect, useRef, useCallback } from "react";
import { useEditorStore } from "../stores/editorStore";

export function useAutosave(reportId, { delay = 1500 } = {}) {
  const isDirty = useEditorStore((s) => s.isDirty);
  const report = useEditorStore((s) => s.report);
  const markClean = useEditorStore((s) => s.markClean);
  const timerRef = useRef(null);
  const csrfToken = document.querySelector('meta[name="csrf-token"]')?.content;

  const save = useCallback(async () => {
    if (!report || !reportId) return;

    try {
      const res = await fetch(`/reports/${reportId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-Token": csrfToken,
          Accept: "application/json",
        },
        body: JSON.stringify({
          report: {
            title: report.title,
            report_type: report.report_type,
            accent_color: report.accent_color,
            content: report.content,
          },
        }),
      });

      if (res.ok) markClean();
    } catch (err) {
      console.error("Autosave failed:", err);
    }
  }, [report, reportId, csrfToken, markClean]);

  useEffect(() => {
    if (!isDirty) return;
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(save, delay);
    return () => clearTimeout(timerRef.current);
  }, [isDirty, save, delay]);

  // Save on unmount if dirty
  useEffect(() => {
    return () => {
      if (useEditorStore.getState().isDirty) save();
    };
  }, [save]);

  return { save };
}
