import { useState, useMemo, useCallback } from "react";
import { useEditorStore } from "../../stores/editorStore";
import { ModalShell } from "./modals/ModalShell";
import {
  UniversalTableEditor, CodeModalEditor, TextModalEditor,
  ScoreGaugeModalEditor, RiskMatrixModalEditor, RiskAssessmentModalEditor,
  BarChartModalEditor,
  PieChartEditor, FunnelChartEditor, TreemapEditor,
  LineChartEditor, AreaChartEditor, StackedBarEditor,
  GaugeChartEditor, RadarChartEditor, HeatmapEditor,
  ScatterPlotEditor, SparklineEditor, WaterfallEditor, SankeyEditor,
  VulnerabilityCardEditor, ScopeBlockEditor, RecommendationEditor,
  CVSSCalculatorEditor,
  AttackTimelineEditor, AttackPathEditor, PrivilegeEscalationEditor,
  EbiosTargetEditor,
  GapAnalysisEditor, MaturityRadarEditor, RiskAppetiteEditor,
  ComplianceGaugeEditor,
  NetworkTopologyEditor,
  VlanDiagramEditor, NetworkFlowEditor, ArchitectureDiagramEditor,
  CertificateInfoEditor,
  SubnetMapEditor, CloudArchitectureEditor,
} from "./modals";

const MODAL_TYPES = {
  // Universal table — handles table + 14 specialized table types
  table: { title: "Éditeur de tableau", icon: "table", Component: UniversalTableEditor },
  "credentials-table": { title: "Éditeur identifiants", icon: "key", Component: UniversalTableEditor },
  "cve-table": { title: "Éditeur CVE", icon: "shield-alt", Component: UniversalTableEditor },
  "ebios-feared-events": { title: "Événements redoutés EBIOS", icon: "exclamation-triangle", Component: UniversalTableEditor },
  "ebios-scenarios": { title: "Scénarios EBIOS", icon: "chess", Component: UniversalTableEditor },
  "compliance-checklist": { title: "Checklist de conformité", icon: "clipboard-check", Component: UniversalTableEditor },
  "risk-register": { title: "Registre des risques", icon: "clipboard-list", Component: UniversalTableEditor },
  "action-plan": { title: "Plan d'action", icon: "tasks", Component: UniversalTableEditor },
  "raci-matrix": { title: "Matrice RACI", icon: "th", Component: UniversalTableEditor },
  "control-matrix": { title: "Matrice de contrôle", icon: "border-all", Component: UniversalTableEditor },
  "port-scan-table": { title: "Scan de ports", icon: "search", Component: UniversalTableEditor },
  "firewall-rules": { title: "Règles firewall", icon: "shield-alt", Component: UniversalTableEditor },
  "server-inventory": { title: "Inventaire serveurs", icon: "server", Component: UniversalTableEditor },
  "dns-records": { title: "Enregistrements DNS", icon: "globe", Component: UniversalTableEditor },
  "wireless-survey": { title: "Audit Wi-Fi", icon: "wifi", Component: UniversalTableEditor },
  // Other blocks
  code: { title: "Éditeur de code", icon: "code", Component: CodeModalEditor },
  text: { title: "Éditeur de texte", icon: "align-left", Component: TextModalEditor },
  "score-gauge": { title: "Éditeur de jauges", icon: "tachometer-alt", Component: ScoreGaugeModalEditor },
  "risk-matrix": { title: "Éditeur de matrice", icon: "th", Component: RiskMatrixModalEditor },
  "risk-assessment": { title: "Évaluation des risques", icon: "shield-alt", Component: RiskAssessmentModalEditor },
  "bar-chart": { title: "Éditeur de graphique", icon: "chart-bar", Component: BarChartModalEditor },
  "line-chart": { title: "Éditeur de courbes", icon: "chart-line", Component: LineChartEditor },
  "pie-chart": { title: "Éditeur camembert", icon: "chart-pie", Component: PieChartEditor },
  "gauge-chart": { title: "Éditeur de jauge", icon: "bullseye", Component: GaugeChartEditor },
  "radar-chart": { title: "Éditeur radar", icon: "crosshairs", Component: RadarChartEditor },
  "heatmap": { title: "Éditeur heatmap", icon: "border-all", Component: HeatmapEditor },
  "stacked-bar": { title: "Barres empilées", icon: "layer-group", Component: StackedBarEditor },
  "area-chart": { title: "Éditeur courbe d'aire", icon: "chart-area", Component: AreaChartEditor },
  "scatter-plot": { title: "Nuage de points", icon: "project-diagram", Component: ScatterPlotEditor },
  "sparkline": { title: "Éditeur sparkline", icon: "grip-lines", Component: SparklineEditor },
  "funnel-chart": { title: "Éditeur entonnoir", icon: "filter", Component: FunnelChartEditor },
  "waterfall-chart": { title: "Éditeur cascade", icon: "signal", Component: WaterfallEditor },
  "treemap": { title: "Éditeur treemap", icon: "th-large", Component: TreemapEditor },
  "sankey-diagram": { title: "Éditeur Sankey", icon: "random", Component: SankeyEditor },
  "vulnerability-card": { title: "Fiche vulnérabilité", icon: "bug", Component: VulnerabilityCardEditor },
  "scope-block": { title: "Éditeur périmètre", icon: "crosshairs", Component: ScopeBlockEditor },
  "recommendation": { title: "Éditeur recommandation", icon: "lightbulb", Component: RecommendationEditor },
  "cvss-calculator": { title: "Calculateur CVSS 3.1", icon: "calculator", Component: CVSSCalculatorEditor },
  "attack-timeline": { title: "Éditeur kill chain", icon: "stream", Component: AttackTimelineEditor },
  "attack-path": { title: "Éditeur chemin d'attaque", icon: "project-diagram", Component: AttackPathEditor },
  "privilege-escalation": { title: "Éditeur escalade", icon: "level-up-alt", Component: PrivilegeEscalationEditor },
  "ebios-target": { title: "Socle de sécurité EBIOS", icon: "bullseye", Component: EbiosTargetEditor },
  "gap-analysis": { title: "Analyse d'écarts", icon: "chart-bar", Component: GapAnalysisEditor },
  "maturity-radar": { title: "Radar de maturité", icon: "crosshairs", Component: MaturityRadarEditor },
  "risk-appetite": { title: "Appétit pour le risque", icon: "balance-scale", Component: RiskAppetiteEditor },
  "compliance-gauge": { title: "Jauge de conformité", icon: "tachometer-alt", Component: ComplianceGaugeEditor },
  // Network
  "network-topology": { title: "Topologie réseau", icon: "network-wired", Component: NetworkTopologyEditor },
  "vlan-diagram": { title: "Diagramme VLAN", icon: "layer-group", Component: VlanDiagramEditor },
  "network-flow": { title: "Flux réseau", icon: "random", Component: NetworkFlowEditor },
  "architecture-diagram": { title: "Architecture système", icon: "project-diagram", Component: ArchitectureDiagramEditor },
  "certificate-info": { title: "Certificat TLS", icon: "lock", Component: CertificateInfoEditor },
  "subnet-map": { title: "Carte sous-réseau", icon: "th", Component: SubnetMapEditor },
  "cloud-architecture": { title: "Architecture cloud", icon: "cloud", Component: CloudArchitectureEditor },
};

function findBlockDeep(blocks, id) {
  if (!blocks) return null;
  for (const b of blocks) {
    if (b.id === id) return b;
    if (b.children?.length) {
      const found = findBlockDeep(b.children, id);
      if (found) return found;
    }
  }
  return null;
}

export function EditorModal({ blockId, blockType, onClose }) {
  const blocks = useEditorStore((s) => s.report?.content?.blocks || []);
  const block = useMemo(() => findBlockDeep(blocks, blockId), [blocks, blockId]);
  const config = MODAL_TYPES[blockType];

  if (!block || !config) return null;

  return (
    <ModalShell title={config.title} icon={config.icon} onClose={onClose}>
      <config.Component block={block} onClose={onClose} />
    </ModalShell>
  );
}

export function useEditorModal() {
  const [modal, setModal] = useState(null);
  const open = useCallback((blockId, blockType) => setModal({ blockId, blockType }), []);
  const close = useCallback(() => setModal(null), []);
  return { modal, openModal: open, closeModal: close };
}
