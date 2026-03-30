import { useMemo, useCallback } from "react";
import hljs from "highlight.js/lib/core";
import bash from "highlight.js/lib/languages/bash";
import powershell from "highlight.js/lib/languages/powershell";
import python from "highlight.js/lib/languages/python";
import javascript from "highlight.js/lib/languages/javascript";
import json from "highlight.js/lib/languages/json";
import yaml from "highlight.js/lib/languages/yaml";
import sql from "highlight.js/lib/languages/sql";
import plaintext from "highlight.js/lib/languages/plaintext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { colors, typography, radii } from "../../../styles/tokens";

hljs.registerLanguage("bash", bash);
hljs.registerLanguage("powershell", powershell);
hljs.registerLanguage("python", python);
hljs.registerLanguage("javascript", javascript);
hljs.registerLanguage("json", json);
hljs.registerLanguage("yaml", yaml);
hljs.registerLanguage("sql", sql);
hljs.registerLanguage("plaintext", plaintext);

const langMap = { text: "plaintext" };

const langColors = {
  bash: "#4EAA25", powershell: "#5391FE", python: "#3776AB",
  javascript: "#F7DF1E", json: "#A8A8A8", yaml: "#CB171E",
  sql: "#E48E00", text: "#888",
};

export function CodeBlock({ block, accentColor }) {
  const { code = "", language = "bash" } = block.data;
  const lang = langMap[language] || language;
  const langColor = langColors[language] || accentColor;

  const highlighted = useMemo(() => {
    if (!code) return "";
    try {
      return hljs.highlight(code, { language: lang }).value;
    } catch {
      return hljs.highlightAuto(code).value;
    }
  }, [code, lang]);

  const lineCount = (code || "").split("\n").length;

  const handleCopy = useCallback(() => {
    navigator.clipboard?.writeText(code);
  }, [code]);

  return (
    <div style={{
      borderRadius: radii.xl,
      overflow: "hidden",
      background: "#0d1117",
      border: "1px solid rgba(255,255,255,0.08)",
      boxShadow: "0 4px 24px rgba(0,0,0,0.2), 0 1px 4px rgba(0,0,0,0.1)",
    }}>
      {/* Header bar */}
      <div style={{
        display: "flex",
        alignItems: "center",
        padding: "8px 16px",
        background: "rgba(255,255,255,0.03)",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        gap: 10,
      }}>
        {/* Language badge */}
        <span style={{
          display: "inline-flex", alignItems: "center", gap: 5,
          padding: "2px 8px", borderRadius: radii.full,
          background: `${langColor}20`, border: `1px solid ${langColor}40`,
          fontFamily: typography.fontFamily.body,
          fontSize: typography.fontSize.xs,
          color: langColor, letterSpacing: "0.04em",
          textTransform: "uppercase", fontWeight: 500,
        }}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: langColor }} />
          {language}
        </span>

        <span style={{ flex: 1 }} />

        {/* Line count */}
        <span style={{
          fontFamily: typography.fontFamily.body,
          fontSize: typography.fontSize.xs,
          color: "rgba(255,255,255,0.2)",
        }}>
          {lineCount} ligne{lineCount > 1 ? "s" : ""}
        </span>

        {/* Copy button */}
        <button
          onClick={(e) => { e.stopPropagation(); handleCopy(); }}
          style={{
            background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: radii.md, padding: "3px 8px", cursor: "pointer",
            color: "rgba(255,255,255,0.4)", fontSize: 10,
            display: "flex", alignItems: "center", gap: 4,
            fontFamily: typography.fontFamily.body,
            transition: "all 0.15s",
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.12)"; e.currentTarget.style.color = "rgba(255,255,255,0.7)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.06)"; e.currentTarget.style.color = "rgba(255,255,255,0.4)"; }}
        >
          <FontAwesomeIcon icon="copy" /> Copier
        </button>
      </div>

      {/* Code area with line numbers */}
      <div style={{ display: "flex", overflow: "auto" }}>
        {/* Line numbers gutter */}
        <div style={{
          padding: "14px 0",
          paddingRight: 12,
          paddingLeft: 16,
          borderRight: "1px solid rgba(255,255,255,0.05)",
          background: "rgba(0,0,0,0.15)",
          userSelect: "none",
          flexShrink: 0,
        }}>
          {Array.from({ length: lineCount }, (_, i) => (
            <div key={i} style={{
              fontFamily: typography.fontFamily.body,
              fontSize: typography.fontSize.sm,
              color: "rgba(255,255,255,0.15)",
              lineHeight: 1.75,
              textAlign: "right",
              minWidth: lineCount >= 100 ? 28 : 18,
            }}>
              {i + 1}
            </div>
          ))}
        </div>

        {/* Code */}
        <pre style={{
          fontFamily: typography.fontFamily.body,
          fontSize: typography.fontSize.md,
          padding: "14px 20px",
          color: "#e6edf3",
          lineHeight: 1.75,
          margin: 0,
          flex: 1,
          overflowX: "auto",
          whiteSpace: "pre",
          tabSize: 2,
        }}>
          {code ? (
            <code dangerouslySetInnerHTML={{ __html: highlighted }} />
          ) : (
            <span style={{ opacity: 0.25, fontStyle: "italic" }}>{"// Code..."}</span>
          )}
        </pre>
      </div>

      <style>{`
        .hljs-comment, .hljs-quote { color: #8b949e; font-style: italic; }
        .hljs-keyword, .hljs-selector-tag { color: #ff7b72; }
        .hljs-string, .hljs-attr { color: #a5d6ff; }
        .hljs-number, .hljs-literal { color: #79c0ff; }
        .hljs-built_in, .hljs-builtin-name { color: #ffa657; }
        .hljs-function .hljs-title, .hljs-title.function_ { color: #d2a8ff; }
        .hljs-variable, .hljs-params { color: #ffa657; }
        .hljs-type, .hljs-class .hljs-title { color: #7ee787; }
        .hljs-symbol, .hljs-bullet { color: #79c0ff; }
        .hljs-meta, .hljs-meta .hljs-keyword { color: #ff7b72; }
        .hljs-meta .hljs-string { color: #a5d6ff; }
        .hljs-section { color: #7ee787; font-weight: 600; }
        .hljs-addition { color: #aff5b4; background: rgba(46,160,67,0.15); }
        .hljs-deletion { color: #ffdcd7; background: rgba(248,81,73,0.15); }
        .hljs-subst { color: #e6edf3; }
        .hljs-property { color: #79c0ff; }
        .hljs-doctag { color: #ff7b72; }
        .hljs-regexp { color: #7ee787; }
      `}</style>
    </div>
  );
}
