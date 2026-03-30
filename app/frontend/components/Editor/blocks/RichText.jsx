/**
 * RichText — Renders a string that may contain inline HTML badges/cartouches.
 *
 * Usage:  <RichText html={title} style={{ fontWeight: 600 }} />
 *
 * Only allows safe inline elements: <span>, <code> with arbor-badge / arbor-cartouche classes.
 * Falls back to plain text if no HTML tags detected.
 */
export function RichText({ html, style = {}, tag = "span", className = "" }) {
  if (!html) return null;

  // Fast path: no HTML → plain text
  if (!/<[a-z][\s\S]*>/i.test(html)) {
    const Tag = tag;
    return <Tag style={style} className={className}>{html}</Tag>;
  }

  const Tag = tag;
  return (
    <Tag
      className={className}
      style={style}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
