import { useState, useEffect, useCallback } from "react";
import { useEditorStore } from "../../../stores/editorStore";
import { blockRenderers } from "../blocks";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { colors } from "../../../styles/tokens";
import { labelStyle, smallInput, tinyBtn, splitLayout, editorSide, previewSide } from "./shared";

export function CertificateInfoEditor({ block }) {
  const updateBlock = useEditorStore((s) => s.updateBlock);
  const accentColor = useEditorStore((s) => s.report?.accent_color) || colors.accentBright;
  const [data, setData] = useState(() => ({ ...block.data }));

  const update = useCallback((patch) => setData((prev) => ({ ...prev, ...patch })), []);
  useEffect(() => { updateBlock(block.id, data); }, [data, block.id, updateBlock]);

  const sanArr = Array.isArray(data.san) ? data.san : (data.san || "").split(",").map((s) => s.trim()).filter(Boolean);

  const Renderer = blockRenderers["certificate-info"];
  const previewBlock = { ...block, data };

  return (
    <div style={splitLayout}>
      <div style={editorSide}>
        <div>
          <div style={labelStyle}>Titre</div>
          <input value={data.title || ""} onChange={(e) => update({ title: e.target.value })} style={smallInput} />
        </div>

        <div style={{ display: "flex", gap: 8 }}>
          <div style={{ flex: 1 }}>
            <div style={labelStyle}>Sujet (CN)</div>
            <input value={data.subject || ""} onChange={(e) => update({ subject: e.target.value })} style={smallInput} placeholder="*.example.com" />
          </div>
          <div style={{ flex: 1 }}>
            <div style={labelStyle}>Émetteur</div>
            <input value={data.issuer || ""} onChange={(e) => update({ issuer: e.target.value })} style={smallInput} placeholder="Let's Encrypt Authority X3" />
          </div>
        </div>

        <div style={{ display: "flex", gap: 8 }}>
          <div style={{ flex: 1 }}>
            <div style={labelStyle}>Valide du</div>
            <input value={data.validFrom || ""} onChange={(e) => update({ validFrom: e.target.value })} style={smallInput} placeholder="2026-01-01" />
          </div>
          <div style={{ flex: 1 }}>
            <div style={labelStyle}>Valide jusqu'au</div>
            <input value={data.validTo || ""} onChange={(e) => update({ validTo: e.target.value })} style={smallInput} placeholder="2027-01-01" />
          </div>
        </div>

        <div style={{ display: "flex", gap: 8 }}>
          <div style={{ flex: 1 }}>
            <div style={labelStyle}>Algorithme</div>
            <input value={data.algorithm || ""} onChange={(e) => update({ algorithm: e.target.value })} style={smallInput} placeholder="RSA-SHA256" />
          </div>
          <div style={{ flex: 1 }}>
            <div style={labelStyle}>Taille clé</div>
            <input value={data.keySize || ""} onChange={(e) => update({ keySize: e.target.value })} style={smallInput} placeholder="2048" />
          </div>
        </div>

        <div>
          <div style={labelStyle}>SAN (séparés par virgules)</div>
          <input value={sanArr.join(", ")} onChange={(e) => update({ san: e.target.value.split(",").map((s) => s.trim()).filter(Boolean) })} style={smallInput} placeholder="example.com, www.example.com" />
        </div>

        <div>
          <div style={labelStyle}>N° série</div>
          <input value={data.serialNumber || ""} onChange={(e) => update({ serialNumber: e.target.value })} style={smallInput} />
        </div>

        <div>
          <div style={labelStyle}>Empreinte SHA-256</div>
          <input value={data.fingerprint || ""} onChange={(e) => update({ fingerprint: e.target.value })} style={smallInput} />
        </div>

        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <div style={labelStyle}>Chaîne de confiance valide</div>
          <div onClick={() => update({ chainValid: !data.chainValid })} style={{
            ...smallInput, width: "auto", cursor: "pointer", display: "flex", alignItems: "center", gap: 6,
            color: data.chainValid ? "#27ae60" : colors.error,
          }}>
            <FontAwesomeIcon icon={data.chainValid ? "check-circle" : "times-circle"} style={{ fontSize: 12 }} />
            {data.chainValid ? "Valide" : "Invalide"}
          </div>
        </div>
      </div>

      <div style={previewSide}>
        <div style={labelStyle}>Aperçu</div>
        {Renderer && <Renderer block={previewBlock} accentColor={accentColor} />}
      </div>
    </div>
  );
}
