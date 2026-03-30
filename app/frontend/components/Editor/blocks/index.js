import { SectionTitle } from "./SectionTitle";
import { TextBlock } from "./TextBlock";
import { CodeBlock } from "./CodeBlock";
import { UniversalTableBlock } from "./UniversalTableBlock";
import { SeparatorBlock } from "./SeparatorBlock";
import { SpacerBlock } from "./SpacerBlock";
import { CalloutBlock } from "./CalloutBlock";
import { ImageBlock } from "./ImageBlock";
import { DrawerBlock } from "./DrawerBlock";
import { HorizontalDivBlock } from "./HorizontalDivBlock";
import { ScoreGaugeBlock } from "./ScoreGaugeBlock";
import { RiskMatrixBlock } from "./RiskMatrixBlock";
import { RiskAssessmentBlock } from "./RiskAssessmentBlock";
import { BarChartBlock } from "./BarChartBlock";
import { LineChartBlock } from "./LineChartBlock";
import { PieChartBlock } from "./PieChartBlock";
import { GaugeChartBlock } from "./GaugeChartBlock";
import { RadarChartBlock } from "./RadarChartBlock";
import { HeatmapBlock } from "./HeatmapBlock";
import { StackedBarBlock } from "./StackedBarBlock";
import { AreaChartBlock } from "./AreaChartBlock";
import { ScatterPlotBlock } from "./ScatterPlotBlock";
import { SparklineBlock } from "./SparklineBlock";
import { FunnelChartBlock } from "./FunnelChartBlock";
import { WaterfallChartBlock } from "./WaterfallChartBlock";
import { TreemapBlock } from "./TreemapBlock";
import { SankeyDiagramBlock } from "./SankeyDiagramBlock";
import { VulnerabilityCardBlock } from "./VulnerabilityCardBlock";
import { FindingsSummaryBlock } from "./FindingsSummaryBlock";
import { ScopeBlockBlock } from "./ScopeBlockBlock";
import { RecommendationBlock } from "./RecommendationBlock";
import { CVSSCalculatorBlock } from "./CVSSCalculatorBlock";
import { AttackTimelineBlock } from "./AttackTimelineBlock";
import { AttackPathBlock } from "./AttackPathBlock";
import { PrivilegeEscalationBlock } from "./PrivilegeEscalationBlock";
import { EbiosTargetBlock } from "./EbiosTargetBlock";
import { GapAnalysisBlock } from "./GapAnalysisBlock";
import { MaturityRadarBlock } from "./MaturityRadarBlock";
import { RiskAppetiteBlock } from "./RiskAppetiteBlock";
import { ComplianceGaugeBlock } from "./ComplianceGaugeBlock";
import { NetworkTopologyBlock } from "./NetworkTopologyBlock";
import { VlanDiagramBlock } from "./VlanDiagramBlock";
import { NetworkFlowBlock } from "./NetworkFlowBlock";
import { ArchitectureDiagramBlock } from "./ArchitectureDiagramBlock";
import { CertificateInfoBlock } from "./CertificateInfoBlock";
import { SubnetMapBlock } from "./SubnetMapBlock";
import { CloudArchitectureBlock } from "./CloudArchitectureBlock";

export const blockRenderers = {
  "section-title": SectionTitle,
  "text": TextBlock,
  "code": CodeBlock,
  "table": UniversalTableBlock,
  "separator": SeparatorBlock,
  "spacer": SpacerBlock,
  "callout": CalloutBlock,
  "image": ImageBlock,
  "drawer": DrawerBlock,
  "horizontal-div": HorizontalDivBlock,
  "score-gauge": ScoreGaugeBlock,
  "risk-matrix": RiskMatrixBlock,
  "risk-assessment": RiskAssessmentBlock,
  "bar-chart": BarChartBlock,
  "line-chart": LineChartBlock,
  "pie-chart": PieChartBlock,
  "gauge-chart": GaugeChartBlock,
  "radar-chart": RadarChartBlock,
  "heatmap": HeatmapBlock,
  "stacked-bar": StackedBarBlock,
  "area-chart": AreaChartBlock,
  "scatter-plot": ScatterPlotBlock,
  "sparkline": SparklineBlock,
  "funnel-chart": FunnelChartBlock,
  "waterfall-chart": WaterfallChartBlock,
  "treemap": TreemapBlock,
  "sankey-diagram": SankeyDiagramBlock,
  "vulnerability-card": VulnerabilityCardBlock,
  "findings-summary": FindingsSummaryBlock,
  "scope-block": ScopeBlockBlock,
  "recommendation": RecommendationBlock,
  // Universal table handles all table-derivative blocks
  "credentials-table": UniversalTableBlock,
  "cve-table": UniversalTableBlock,
  "cvss-calculator": CVSSCalculatorBlock,
  "attack-timeline": AttackTimelineBlock,
  "attack-path": AttackPathBlock,
  "privilege-escalation": PrivilegeEscalationBlock,
  "ebios-feared-events": UniversalTableBlock,
  "ebios-scenarios": UniversalTableBlock,
  "ebios-target": EbiosTargetBlock,
  "compliance-checklist": UniversalTableBlock,
  "gap-analysis": GapAnalysisBlock,
  "risk-register": UniversalTableBlock,
  "maturity-radar": MaturityRadarBlock,
  "risk-appetite": RiskAppetiteBlock,
  "action-plan": UniversalTableBlock,
  "raci-matrix": UniversalTableBlock,
  "control-matrix": UniversalTableBlock,
  "compliance-gauge": ComplianceGaugeBlock,
  // Network
  "network-topology": NetworkTopologyBlock,
  "port-scan-table": UniversalTableBlock,
  "firewall-rules": UniversalTableBlock,
  "vlan-diagram": VlanDiagramBlock,
  "network-flow": NetworkFlowBlock,
  "architecture-diagram": ArchitectureDiagramBlock,
  "server-inventory": UniversalTableBlock,
  "dns-records": UniversalTableBlock,
  "certificate-info": CertificateInfoBlock,
  "subnet-map": SubnetMapBlock,
  "cloud-architecture": CloudArchitectureBlock,
  "wireless-survey": UniversalTableBlock,
};
