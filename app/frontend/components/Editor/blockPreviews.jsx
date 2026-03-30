/**
 * Block Preview Thumbnails
 * Small SVG illustrations shown in the component drawer tooltip on hover.
 * Each preview is a 200×120 mini-rendering of what the block looks like.
 */
const W = 200;
const H = 120;
const bg = "#FDFCF9";
const border = "#E5E0D8";
const accent = "#C8B89A";
const textColor = "#4A473F";
const mutedColor = "#9A968E";
const greenColor = "#5CB85C";
const yellowColor = "#f39c12";
const redColor = "#e74c3c";
const orangeColor = "#e67e22";
const blueColor = "#2980b9";

function Svg({ children }) {
  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ display: "block" }}>
      <rect width={W} height={H} rx={6} fill={bg} stroke={border} strokeWidth={1} />
      {children}
    </svg>
  );
}

/* ─── Helpers ─── */
function TextLines({ x, y, widths, gap = 8, color = mutedColor, h = 4 }) {
  return widths.map((w, i) => (
    <rect key={i} x={x} y={y + i * gap} width={w} height={h} rx={2} fill={color} opacity={0.5} />
  ));
}

function Badge({ x, y, w = 30, color }) {
  return <rect x={x} y={y} width={w} height={10} rx={5} fill={color} />;
}

/* ─── Content ─── */
function SectionTitlePreview() {
  return (
    <Svg>
      <rect x={16} y={20} width={120} height={10} rx={3} fill={textColor} />
      <rect x={16} y={38} width={168} height={1} fill={accent} opacity={0.6} />
      <TextLines x={16} y={50} widths={[168, 140, 100]} />
    </Svg>
  );
}

function TextPreview() {
  return (
    <Svg>
      <TextLines x={16} y={20} widths={[168, 160, 148, 168, 130, 155, 90]} gap={10} h={5} />
    </Svg>
  );
}

function CodePreview() {
  return (
    <Svg>
      <rect x={12} y={10} width={176} height={100} rx={6} fill="#1E1E1E" />
      <rect x={20} y={22} width={40} height={5} rx={2} fill="#569CD6" opacity={0.8} />
      <rect x={64} y={22} width={60} height={5} rx={2} fill="#CE9178" opacity={0.8} />
      <rect x={28} y={34} width={50} height={5} rx={2} fill="#9CDCFE" opacity={0.8} />
      <rect x={82} y={34} width={30} height={5} rx={2} fill="#DCDCAA" opacity={0.8} />
      <rect x={28} y={46} width={70} height={5} rx={2} fill="#6A9955" opacity={0.8} />
      <rect x={20} y={58} width={55} height={5} rx={2} fill="#569CD6" opacity={0.8} />
      <rect x={79} y={58} width={40} height={5} rx={2} fill="#D4D4D4" opacity={0.6} />
      <rect x={28} y={70} width={80} height={5} rx={2} fill="#CE9178" opacity={0.8} />
    </Svg>
  );
}

function TablePreview() {
  return (
    <Svg>
      {/* Header */}
      <rect x={12} y={12} width={176} height={18} rx={3} fill={accent} opacity={0.2} />
      <rect x={20} y={18} width={40} height={5} rx={2} fill={textColor} opacity={0.7} />
      <rect x={80} y={18} width={40} height={5} rx={2} fill={textColor} opacity={0.7} />
      <rect x={140} y={18} width={40} height={5} rx={2} fill={textColor} opacity={0.7} />
      {/* Rows */}
      {[0, 1, 2, 3].map((i) => (
        <g key={i}>
          <rect x={12} y={34 + i * 20} width={176} height={18} rx={0} fill={i % 2 ? "transparent" : mutedColor} opacity={0.06} />
          <rect x={20} y={40 + i * 20} width={35} height={4} rx={2} fill={mutedColor} opacity={0.4} />
          <rect x={80} y={40 + i * 20} width={30} height={4} rx={2} fill={mutedColor} opacity={0.4} />
          <rect x={140} y={40 + i * 20} width={25} height={4} rx={2} fill={mutedColor} opacity={0.4} />
        </g>
      ))}
    </Svg>
  );
}

function CalloutPreview() {
  return (
    <Svg>
      <rect x={12} y={20} width={176} height={80} rx={8} fill="#2980b9" opacity={0.08} />
      <rect x={12} y={20} width={4} height={80} rx={2} fill={blueColor} />
      <circle cx={28} cy={36} r={6} fill={blueColor} opacity={0.3} />
      <text x={28} y={39} fontSize={9} fontWeight="bold" fill={blueColor} textAnchor="middle">i</text>
      <TextLines x={40} y={32} widths={[136, 120, 90]} gap={10} color={blueColor} />
    </Svg>
  );
}

/* ─── Layout ─── */
function SeparatorPreview() {
  return (
    <Svg>
      <TextLines x={40} y={30} widths={[120, 100]} />
      <line x1={30} y1={60} x2={170} y2={60} stroke={accent} strokeWidth={1.5} opacity={0.6} />
      <TextLines x={40} y={72} widths={[110, 120]} />
    </Svg>
  );
}

function SpacerPreview() {
  return (
    <Svg>
      <TextLines x={30} y={20} widths={[140, 120]} />
      <line x1={90} y1={42} x2={90} y2={78} stroke={accent} strokeWidth={1} strokeDasharray="3 3" opacity={0.4} />
      <path d="M86,46 L90,42 L94,46" fill="none" stroke={accent} strokeWidth={1} opacity={0.4} />
      <path d="M86,74 L90,78 L94,74" fill="none" stroke={accent} strokeWidth={1} opacity={0.4} />
      <TextLines x={30} y={88} widths={[130, 140]} />
    </Svg>
  );
}

function ColumnsPreview() {
  return (
    <Svg>
      <rect x={12} y={12} width={84} height={96} rx={6} fill={mutedColor} opacity={0.08} stroke={border} strokeWidth={1} />
      <TextLines x={20} y={24} widths={[68, 60, 50, 68]} />
      <rect x={104} y={12} width={84} height={96} rx={6} fill={mutedColor} opacity={0.08} stroke={border} strokeWidth={1} />
      <TextLines x={112} y={24} widths={[68, 55, 68, 40]} />
    </Svg>
  );
}

function DrawerPreview() {
  return (
    <Svg>
      <rect x={12} y={12} width={176} height={24} rx={6} fill={accent} opacity={0.15} />
      <path d="M24,21 L28,27 L32,21" fill="none" stroke={textColor} strokeWidth={1.5} />
      <rect x={38} y={20} width={80} height={7} rx={3} fill={textColor} opacity={0.6} />
      <rect x={20} y={44} width={168} height={64} rx={4} fill={mutedColor} opacity={0.06} stroke={border} strokeWidth={1} />
      <TextLines x={28} y={56} widths={[150, 140, 120, 100]} />
    </Svg>
  );
}

/* ─── Media ─── */
function ImagePreview() {
  return (
    <Svg>
      <rect x={24} y={10} width={152} height={85} rx={6} fill={mutedColor} opacity={0.1} stroke={border} strokeWidth={1} />
      <circle cx={55} cy={38} r={10} fill={accent} opacity={0.3} />
      <path d="M24,75 L60,50 L90,70 L120,45 L176,75 L176,89 Q176,95 170,95 L30,95 Q24,95 24,89 Z" fill={greenColor} opacity={0.15} />
      <rect x={60} y={102} width={80} height={5} rx={2} fill={mutedColor} opacity={0.4} />
    </Svg>
  );
}

/* ─── Pentest ─── */
function ScoreGaugePreview() {
  return (
    <Svg>
      <rect x={16} y={12} width={60} height={6} rx={3} fill={textColor} opacity={0.5} />
      {/* Gauge row 1 */}
      <rect x={16} y={26} width={40} height={5} rx={2} fill={mutedColor} opacity={0.3} />
      {[0,1,2,3,4,5,6,7,8].map((i) => (
        <rect key={`g1-${i}`} x={70 + i * 13} y={24} width={10} height={9} rx={2}
          fill={i < 3 ? greenColor : i < 6 ? yellowColor : redColor} opacity={i < 7 ? 0.8 : 0.15} />
      ))}
      {/* Gauge row 2 */}
      <rect x={16} y={42} width={50} height={5} rx={2} fill={mutedColor} opacity={0.3} />
      {[0,1,2,3,4,5,6,7,8].map((i) => (
        <rect key={`g2-${i}`} x={70 + i * 13} y={40} width={10} height={9} rx={2}
          fill={i < 3 ? greenColor : i < 6 ? yellowColor : redColor} opacity={i < 5 ? 0.8 : 0.15} />
      ))}
      {/* Gauge row 3 */}
      <rect x={16} y={58} width={35} height={5} rx={2} fill={mutedColor} opacity={0.3} />
      {[0,1,2,3,4,5,6,7,8].map((i) => (
        <rect key={`g3-${i}`} x={70 + i * 13} y={56} width={10} height={9} rx={2}
          fill={i < 3 ? greenColor : i < 6 ? yellowColor : redColor} opacity={i < 8 ? 0.8 : 0.15} />
      ))}
      {/* Gauge row 4 */}
      <rect x={16} y={74} width={45} height={5} rx={2} fill={mutedColor} opacity={0.3} />
      {[0,1,2,3,4,5,6,7,8].map((i) => (
        <rect key={`g4-${i}`} x={70 + i * 13} y={72} width={10} height={9} rx={2}
          fill={i < 3 ? greenColor : i < 6 ? yellowColor : redColor} opacity={i < 4 ? 0.8 : 0.15} />
      ))}
    </Svg>
  );
}

function RiskMatrixPreview() {
  const cellColors = ["#27ae60","#f1c40f","#e74c3c", "#27ae60","#e67e22","#e74c3c", "#f1c40f","#e74c3c","#1a1a18"];
  return (
    <Svg>
      {[0,1,2].map((r) => [0,1,2].map((c) => (
        <rect key={`${r}-${c}`} x={60 + c * 36} y={14 + r * 30} width={33} height={27} rx={3}
          fill={cellColors[r * 3 + c]} opacity={0.7} />
      )))}
      <circle cx={60 + 2 * 36 + 16} cy={14 + 0 * 30 + 13} r={5} fill="#fff" />
      <rect x={16} y={55} width={8} height={45} rx={2} fill={mutedColor} opacity={0.15} />
      <text x={12} y={80} fontSize={6} fill={mutedColor} transform="rotate(-90 12 80)" opacity={0.5}>Impact</text>
      <text x={110} y={108} fontSize={6} fill={mutedColor} textAnchor="middle" opacity={0.5}>Vraisemblance</text>
    </Svg>
  );
}

function RiskAssessmentPreview() {
  return (
    <Svg>
      {/* Left gauges */}
      {[0,1,2].map((i) => (
        <g key={`lg-${i}`}>
          <rect x={8} y={14 + i * 14} width={20} height={4} rx={2} fill={mutedColor} opacity={0.3} />
          {[0,1,2,3,4].map((j) => (
            <rect key={j} x={30 + j * 8} y={12 + i * 14} width={6} height={8} rx={1}
              fill={j < 2 ? greenColor : j < 4 ? yellowColor : redColor} opacity={j < 3 + i ? 0.7 : 0.15} />
          ))}
        </g>
      ))}
      {/* Right gauges */}
      {[0,1,2].map((i) => (
        <g key={`rg-${i}`}>
          <rect x={8} y={60 + i * 14} width={20} height={4} rx={2} fill={mutedColor} opacity={0.3} />
          {[0,1,2,3,4].map((j) => (
            <rect key={j} x={30 + j * 8} y={58 + i * 14} width={6} height={8} rx={1}
              fill={j < 2 ? greenColor : j < 4 ? yellowColor : redColor} opacity={j < 4 - i ? 0.7 : 0.15} />
          ))}
        </g>
      ))}
      {/* Matrix */}
      {[0,1,2].map((r) => [0,1,2].map((c) => (
        <rect key={`m-${r}-${c}`} x={108 + c * 26} y={16 + r * 26} width={24} height={24} rx={3}
          fill={["#27ae60","#f1c40f","#e74c3c","#27ae60","#e67e22","#e74c3c","#f1c40f","#e74c3c","#1a1a18"][r*3+c]} opacity={0.6} />
      )))}
      <circle cx={108 + 1 * 26 + 12} cy={16 + 1 * 26 + 12} r={4} fill="#fff" />
    </Svg>
  );
}

function VulnerabilityCardPreview() {
  return (
    <Svg>
      <rect x={12} y={10} width={176} height={100} rx={8} fill={bg} stroke={border} strokeWidth={1} />
      <rect x={12} y={10} width={4} height={100} rx={2} fill={redColor} />
      <rect x={24} y={18} width={100} height={8} rx={3} fill={textColor} opacity={0.7} />
      <Badge x={130} y={17} w={40} color={redColor} />
      <rect x={24} y={34} width={50} height={6} rx={3} fill={orangeColor} opacity={0.5} />
      <TextLines x={24} y={48} widths={[148, 140, 130]} gap={9} />
      <rect x={24} y={82} width={60} height={6} rx={3} fill={greenColor} opacity={0.4} />
      <TextLines x={24} y={94} widths={[148, 120]} gap={8} h={3} />
    </Svg>
  );
}

function CveTablePreview() {
  return (
    <Svg>
      <rect x={12} y={12} width={176} height={16} rx={3} fill={accent} opacity={0.15} />
      <rect x={16} y={17} width={50} height={5} rx={2} fill={textColor} opacity={0.6} />
      <rect x={72} y={17} width={24} height={5} rx={2} fill={textColor} opacity={0.6} />
      <rect x={102} y={17} width={36} height={5} rx={2} fill={textColor} opacity={0.6} />
      <rect x={144} y={17} width={36} height={5} rx={2} fill={textColor} opacity={0.6} />
      {[0,1,2,3].map((i) => (
        <g key={i}>
          <rect x={16} y={36 + i * 18} width={48} height={5} rx={2} fill={blueColor} opacity={0.5} />
          <rect x={72} y={34 + i * 18} width={20} height={9} rx={4} fill={[redColor, orangeColor, yellowColor, redColor][i]} opacity={0.7} />
          <rect x={102} y={36 + i * 18} width={32} height={5} rx={2} fill={mutedColor} opacity={0.3} />
          <rect x={144} y={36 + i * 18} width={30} height={5} rx={2} fill={mutedColor} opacity={0.3} />
        </g>
      ))}
    </Svg>
  );
}

function CvssCalculatorPreview() {
  return (
    <Svg>
      {/* Circular gauge */}
      <circle cx={50} cy={55} r={32} fill="none" stroke={mutedColor} strokeWidth={6} opacity={0.12} />
      <circle cx={50} cy={55} r={32} fill="none" stroke={redColor} strokeWidth={6}
        strokeDasharray="160 42" strokeLinecap="round" opacity={0.7} transform="rotate(-90 50 55)" />
      <text x={50} y={60} fontSize={16} fontWeight="bold" fill={redColor} textAnchor="middle" opacity={0.8}>8.5</text>
      {/* Metrics */}
      {[0,1,2,3,4].map((i) => (
        <g key={i}>
          <rect x={100} y={18 + i * 18} width={28} height={5} rx={2} fill={mutedColor} opacity={0.3} />
          <rect x={132} y={16 + i * 18} width={50} height={9} rx={4} fill={[redColor, orangeColor, yellowColor, redColor, greenColor][i]} opacity={0.2} />
          <rect x={134} y={18 + i * 18} width={[40,30,25,45,20][i]} height={5} rx={2} fill={[redColor, orangeColor, yellowColor, redColor, greenColor][i]} opacity={0.6} />
        </g>
      ))}
    </Svg>
  );
}

function AttackTimelinePreview() {
  const phases = [greenColor, "#2ecc71", yellowColor, orangeColor, redColor];
  return (
    <Svg>
      <line x1={20} y1={50} x2={180} y2={50} stroke={mutedColor} strokeWidth={2} opacity={0.2} />
      {phases.map((c, i) => (
        <g key={i}>
          <circle cx={28 + i * 36} cy={50} r={10} fill={c} opacity={0.7} />
          <rect x={16 + i * 36} y={66} width={24} height={4} rx={2} fill={mutedColor} opacity={0.3} />
        </g>
      ))}
      <text x={100} y={95} fontSize={7} fill={mutedColor} textAnchor="middle" opacity={0.4}>MITRE ATT&CK</text>
    </Svg>
  );
}

function ScopeBlockPreview() {
  return (
    <Svg>
      <rect x={12} y={10} width={84} height={100} rx={6} fill={greenColor} opacity={0.15} stroke={greenColor} strokeWidth={1} />
      <rect x={20} y={18} width={40} height={6} rx={3} fill={greenColor} opacity={0.5} />
      <TextLines x={20} y={32} widths={[60, 55, 50, 45]} gap={10} h={4} color={greenColor} />
      <rect x={104} y={10} width={84} height={100} rx={6} fill={redColor} opacity={0.15} stroke={redColor} strokeWidth={1} />
      <rect x={112} y={18} width={46} height={6} rx={3} fill={redColor} opacity={0.5} />
      <TextLines x={112} y={32} widths={[55, 50]} gap={10} h={4} color={redColor} />
    </Svg>
  );
}

function FindingsSummaryPreview() {
  const data = [
    { w: 30, color: redColor, label: "Critique" },
    { w: 70, color: orangeColor, label: "Élevé" },
    { w: 110, color: yellowColor, label: "Moyen" },
    { w: 50, color: greenColor, label: "Faible" },
  ];
  return (
    <Svg>
      {data.map((d, i) => (
        <g key={i}>
          <rect x={16} y={16 + i * 24} width={d.w} height={14} rx={4} fill={d.color} opacity={0.6} />
          <rect x={d.w + 22} y={19 + i * 24} width={20} height={5} rx={2} fill={mutedColor} opacity={0.3} />
        </g>
      ))}
    </Svg>
  );
}

function RecommendationPreview() {
  return (
    <Svg>
      <rect x={12} y={10} width={176} height={100} rx={8} fill={bg} stroke={border} strokeWidth={1} />
      <rect x={20} y={18} width={90} height={8} rx={3} fill={textColor} opacity={0.6} />
      <Badge x={116} y={17} w={34} color={orangeColor} />
      <Badge x={154} y={17} w={26} color={blueColor} />
      <TextLines x={20} y={36} widths={[156, 140, 148, 120]} gap={9} />
      <rect x={20} y={82} width={60} height={16} rx={6} fill={greenColor} opacity={0.2} />
      <rect x={28} y={87} width={44} height={5} rx={2} fill={greenColor} opacity={0.5} />
    </Svg>
  );
}

function AttackPathPreview() {
  return (
    <Svg>
      {/* Nodes */}
      <rect x={12} y={45} width={36} height={30} rx={6} fill={blueColor} opacity={0.2} stroke={blueColor} strokeWidth={1} />
      <rect x={20} y={56} width={20} height={4} rx={2} fill={blueColor} opacity={0.5} />
      <line x1={48} y1={60} x2={72} y2={60} stroke={mutedColor} strokeWidth={1.5} markerEnd="url(#arrow)" />
      <rect x={72} y={45} width={36} height={30} rx={6} fill={orangeColor} opacity={0.2} stroke={orangeColor} strokeWidth={1} />
      <rect x={80} y={56} width={20} height={4} rx={2} fill={orangeColor} opacity={0.5} />
      <line x1={108} y1={60} x2={132} y2={45} stroke={mutedColor} strokeWidth={1.5} />
      <line x1={108} y1={60} x2={132} y2={75} stroke={mutedColor} strokeWidth={1.5} />
      <rect x={132} y={30} width={36} height={28} rx={6} fill={redColor} opacity={0.2} stroke={redColor} strokeWidth={1} />
      <rect x={140} y={41} width={20} height={4} rx={2} fill={redColor} opacity={0.5} />
      <rect x={132} y={62} width={36} height={28} rx={6} fill={redColor} opacity={0.2} stroke={redColor} strokeWidth={1} />
      <rect x={140} y={73} width={20} height={4} rx={2} fill={redColor} opacity={0.5} />
    </Svg>
  );
}

function CredentialsTablePreview() {
  return (
    <Svg>
      <rect x={12} y={12} width={176} height={16} rx={3} fill={accent} opacity={0.15} />
      <rect x={16} y={17} width={34} height={5} rx={2} fill={textColor} opacity={0.6} />
      <rect x={56} y={17} width={38} height={5} rx={2} fill={textColor} opacity={0.6} />
      <rect x={100} y={17} width={36} height={5} rx={2} fill={textColor} opacity={0.6} />
      <rect x={142} y={17} width={38} height={5} rx={2} fill={textColor} opacity={0.6} />
      {[0,1,2].map((i) => (
        <g key={i}>
          <rect x={16} y={36 + i * 20} width={30} height={5} rx={2} fill={mutedColor} opacity={0.4} />
          <rect x={56} y={36 + i * 20} width={34} height={5} rx={2} fill={blueColor} opacity={0.4} />
          <rect x={100} y={34 + i * 20} width={32} height={9} rx={4} fill="#1a1a18" opacity={0.2} />
          <text x={106} y={41 + i * 20} fontSize={7} fill={mutedColor}>•••••</text>
          <rect x={142} y={34 + i * 20} width={24} height={9} rx={4} fill={[redColor, yellowColor, greenColor][i]} opacity={0.3} />
        </g>
      ))}
    </Svg>
  );
}

function PrivilegeEscalationPreview() {
  return (
    <Svg>
      {/* Vertical chain */}
      <rect x={70} y={10} width={60} height={22} rx={6} fill={greenColor} opacity={0.2} stroke={greenColor} strokeWidth={1} />
      <rect x={80} y={18} width={40} height={5} rx={2} fill={greenColor} opacity={0.5} />
      <line x1={100} y1={32} x2={100} y2={44} stroke={mutedColor} strokeWidth={1.5} strokeDasharray="3 2" />
      <rect x={70} y={44} width={60} height={22} rx={6} fill={orangeColor} opacity={0.2} stroke={orangeColor} strokeWidth={1} />
      <rect x={78} y={52} width={44} height={5} rx={2} fill={orangeColor} opacity={0.5} />
      <line x1={100} y1={66} x2={100} y2={78} stroke={mutedColor} strokeWidth={1.5} strokeDasharray="3 2" />
      <rect x={70} y={78} width={60} height={22} rx={6} fill={redColor} opacity={0.2} stroke={redColor} strokeWidth={1} />
      <rect x={84} y={86} width={32} height={5} rx={2} fill={redColor} opacity={0.5} />
      {/* Arrow */}
      <path d="M150,70 L160,55 L164,60 L175,30 L168,32 L164,28 L150,58" fill={redColor} opacity={0.15} />
    </Svg>
  );
}

/* ─── Network ─── */
function NetworkTopologyPreview() {
  return (
    <Svg>
      {/* Isometric boxes */}
      <rect x={80} y={15} width={40} height={25} rx={4} fill={blueColor} opacity={0.3} />
      <rect x={20} y={55} width={40} height={25} rx={4} fill={greenColor} opacity={0.3} />
      <rect x={140} y={55} width={40} height={25} rx={4} fill={orangeColor} opacity={0.3} />
      <rect x={50} y={88} width={40} height={25} rx={4} fill={mutedColor} opacity={0.2} />
      <rect x={110} y={88} width={40} height={25} rx={4} fill={mutedColor} opacity={0.2} />
      {/* Links */}
      <line x1={100} y1={40} x2={40} y2={55} stroke={mutedColor} strokeWidth={1} opacity={0.4} />
      <line x1={100} y1={40} x2={160} y2={55} stroke={mutedColor} strokeWidth={1} opacity={0.4} />
      <line x1={40} y1={80} x2={70} y2={88} stroke={mutedColor} strokeWidth={1} opacity={0.4} />
      <line x1={160} y1={80} x2={130} y2={88} stroke={mutedColor} strokeWidth={1} opacity={0.4} />
    </Svg>
  );
}

function PortScanTablePreview() {
  return (
    <Svg>
      <rect x={12} y={12} width={176} height={16} rx={3} fill={accent} opacity={0.15} />
      <rect x={16} y={17} width={24} height={5} rx={2} fill={textColor} opacity={0.6} />
      <rect x={50} y={17} width={36} height={5} rx={2} fill={textColor} opacity={0.6} />
      <rect x={96} y={17} width={36} height={5} rx={2} fill={textColor} opacity={0.6} />
      <rect x={142} y={17} width={24} height={5} rx={2} fill={textColor} opacity={0.6} />
      {[0,1,2,3].map((i) => (
        <g key={i}>
          <rect x={16} y={36 + i * 18} width={20} height={5} rx={2} fill={mutedColor} opacity={0.4} />
          <rect x={50} y={36 + i * 18} width={30} height={5} rx={2} fill={mutedColor} opacity={0.4} />
          <rect x={96} y={36 + i * 18} width={28} height={5} rx={2} fill={mutedColor} opacity={0.4} />
          <circle cx={154} cy={38 + i * 18} r={4} fill={[greenColor, greenColor, redColor, yellowColor][i]} opacity={0.6} />
        </g>
      ))}
    </Svg>
  );
}

function FirewallRulesPreview() {
  return (
    <Svg>
      <rect x={12} y={12} width={176} height={16} rx={3} fill={accent} opacity={0.15} />
      {[0,1,2,3].map((i) => (
        <g key={i}>
          <rect x={16} y={36 + i * 18} width={35} height={5} rx={2} fill={mutedColor} opacity={0.3} />
          <rect x={56} y={36 + i * 18} width={35} height={5} rx={2} fill={mutedColor} opacity={0.3} />
          <rect x={96} y={36 + i * 18} width={20} height={5} rx={2} fill={mutedColor} opacity={0.3} />
          <rect x={122} y={34 + i * 18} width={40} height={10} rx={5}
            fill={[greenColor, greenColor, redColor, greenColor][i]} opacity={0.2} />
          <rect x={128} y={36 + i * 18} width={28} height={5} rx={2}
            fill={[greenColor, greenColor, redColor, greenColor][i]} opacity={0.6} />
        </g>
      ))}
    </Svg>
  );
}

function GenericDiagramPreview() {
  return (
    <Svg>
      <rect x={30} y={20} width={50} height={30} rx={6} fill={blueColor} opacity={0.15} stroke={blueColor} strokeWidth={1} />
      <rect x={38} y={31} width={34} height={5} rx={2} fill={blueColor} opacity={0.4} />
      <rect x={120} y={20} width={50} height={30} rx={6} fill={orangeColor} opacity={0.15} stroke={orangeColor} strokeWidth={1} />
      <rect x={128} y={31} width={34} height={5} rx={2} fill={orangeColor} opacity={0.4} />
      <line x1={80} y1={35} x2={120} y2={35} stroke={mutedColor} strokeWidth={1.5} />
      <rect x={75} y={70} width={50} height={30} rx={6} fill={greenColor} opacity={0.15} stroke={greenColor} strokeWidth={1} />
      <rect x={83} y={81} width={34} height={5} rx={2} fill={greenColor} opacity={0.4} />
      <line x1={55} y1={50} x2={100} y2={70} stroke={mutedColor} strokeWidth={1} opacity={0.4} />
      <line x1={145} y1={50} x2={100} y2={70} stroke={mutedColor} strokeWidth={1} opacity={0.4} />
    </Svg>
  );
}

function GenericTablePreview() {
  return (
    <Svg>
      <rect x={12} y={12} width={176} height={16} rx={3} fill={accent} opacity={0.15} />
      {[0, 1, 2].map((c) => (
        <rect key={c} x={20 + c * 60} y={17} width={40} height={5} rx={2} fill={textColor} opacity={0.6} />
      ))}
      {[0,1,2,3].map((i) => (
        <g key={i}>
          {[0, 1, 2].map((c) => (
            <rect key={c} x={20 + c * 60} y={36 + i * 18} width={[35,30,40][c]} height={5} rx={2} fill={mutedColor} opacity={0.35} />
          ))}
        </g>
      ))}
    </Svg>
  );
}

function GenericCardPreview() {
  return (
    <Svg>
      <rect x={12} y={10} width={176} height={100} rx={8} fill={bg} stroke={border} strokeWidth={1} />
      <rect x={20} y={20} width={100} height={8} rx={3} fill={textColor} opacity={0.6} />
      <Badge x={130} y={19} w={40} color={blueColor} />
      <TextLines x={20} y={40} widths={[156, 140, 148, 120]} gap={10} />
      <rect x={20} y={90} width={50} height={6} rx={3} fill={mutedColor} opacity={0.25} />
    </Svg>
  );
}

/* ─── GRC ─── */
function MaturityRadarPreview() {
  return (
    <Svg>
      {/* Radar web */}
      <polygon points="100,20 150,50 140,95 60,95 50,50" fill="none" stroke={mutedColor} strokeWidth={0.5} opacity={0.3} />
      <polygon points="100,35 138,55 130,85 70,85 62,55" fill="none" stroke={mutedColor} strokeWidth={0.5} opacity={0.2} />
      {/* Target */}
      <polygon points="100,25 145,52 136,90 64,90 55,52" fill={blueColor} opacity={0.15} stroke={blueColor} strokeWidth={1} />
      {/* Actual */}
      <polygon points="100,38 135,56 125,82 75,85 65,52" fill={accent} opacity={0.15} stroke={accent} strokeWidth={1.5} />
      {/* Points */}
      {[[100,38],[135,56],[125,82],[75,85],[65,52]].map(([x,y], i) => (
        <circle key={i} cx={x} cy={y} r={3} fill={accent} />
      ))}
    </Svg>
  );
}

function ComplianceChecklistPreview() {
  return (
    <Svg>
      {[0,1,2,3,4].map((i) => (
        <g key={i}>
          <rect x={16} y={14 + i * 20} width={12} height={12} rx={3}
            fill={[greenColor, greenColor, redColor, yellowColor, greenColor][i]} opacity={0.2} />
          <text x={22} y={24 + i * 20} fontSize={10} fill={[greenColor, greenColor, redColor, yellowColor, greenColor][i]}
            textAnchor="middle" fontWeight="bold" opacity={0.7}>
            {["✓","✓","✗","!","✓"][i]}
          </text>
          <rect x={34} y={17 + i * 20} width={[100,80,90,110,70][i]} height={5} rx={2} fill={mutedColor} opacity={0.35} />
        </g>
      ))}
    </Svg>
  );
}

function RiskRegisterPreview() {
  return (
    <Svg>
      <rect x={12} y={12} width={176} height={16} rx={3} fill={accent} opacity={0.15} />
      {[0,1,2,3].map((i) => (
        <g key={i}>
          <rect x={16} y={36 + i * 18} width={14} height={5} rx={2} fill={mutedColor} opacity={0.4} />
          <rect x={34} y={36 + i * 18} width={60} height={5} rx={2} fill={mutedColor} opacity={0.3} />
          <rect x={100} y={34 + i * 18} width={24} height={9} rx={4}
            fill={[redColor, orangeColor, yellowColor, greenColor][i]} opacity={0.5} />
          <rect x={130} y={36 + i * 18} width={40} height={5} rx={2} fill={mutedColor} opacity={0.25} />
        </g>
      ))}
    </Svg>
  );
}

function GapAnalysisPreview() {
  const data = [
    { current: 50, target: 80 },
    { current: 70, target: 90 },
    { current: 30, target: 75 },
    { current: 60, target: 85 },
  ];
  return (
    <Svg>
      {data.map((d, i) => (
        <g key={i}>
          <rect x={16} y={16 + i * 24} width={30} height={5} rx={2} fill={mutedColor} opacity={0.35} />
          <rect x={52} y={14 + i * 24} width={d.target} height={14} rx={4} fill={blueColor} opacity={0.1} />
          <rect x={52} y={14 + i * 24} width={d.current} height={14} rx={4} fill={blueColor} opacity={0.4} />
        </g>
      ))}
    </Svg>
  );
}

/* ─── GRC specific ─── */
function EbiosFearedEventsPreview() {
  return (
    <Svg>
      <rect x={12} y={10} width={176} height={16} rx={3} fill={accent} opacity={0.15} />
      <rect x={16} y={15} width={30} height={5} rx={2} fill={textColor} opacity={0.6} />
      <rect x={50} y={15} width={45} height={5} rx={2} fill={textColor} opacity={0.6} />
      <rect x={100} y={15} width={30} height={5} rx={2} fill={textColor} opacity={0.6} />
      <rect x={136} y={15} width={30} height={5} rx={2} fill={textColor} opacity={0.6} />
      {[0,1,2,3].map((i) => (
        <g key={i}>
          <rect x={16} y={34 + i * 18} width={28} height={5} rx={2} fill={mutedColor} opacity={0.35} />
          <rect x={50} y={34 + i * 18} width={40} height={5} rx={2} fill={mutedColor} opacity={0.3} />
          <rect x={100} y={32 + i * 18} width={24} height={9} rx={4}
            fill={[redColor, redColor, orangeColor, yellowColor][i]} opacity={0.5} />
          <rect x={136} y={34 + i * 18} width={26} height={5} rx={2} fill={mutedColor} opacity={0.25} />
        </g>
      ))}
      <text x={100} y={108} fontSize={6} fill={mutedColor} textAnchor="middle" opacity={0.4}>Événements redoutés EBIOS</text>
    </Svg>
  );
}

function EbiosScenariosPreview() {
  return (
    <Svg>
      {/* Flow diagram: nodes + arrows */}
      <rect x={14} y={30} width={44} height={24} rx={6} fill={blueColor} opacity={0.2} stroke={blueColor} strokeWidth={1} />
      <rect x={20} y={38} width={32} height={5} rx={2} fill={blueColor} opacity={0.5} />
      <line x1={58} y1={42} x2={74} y2={42} stroke={mutedColor} strokeWidth={1.5} />
      <rect x={74} y={30} width={52} height={24} rx={6} fill={orangeColor} opacity={0.2} stroke={orangeColor} strokeWidth={1} />
      <rect x={80} y={38} width={40} height={5} rx={2} fill={orangeColor} opacity={0.5} />
      <line x1={126} y1={42} x2={142} y2={42} stroke={mutedColor} strokeWidth={1.5} />
      <rect x={142} y={30} width={44} height={24} rx={6} fill={redColor} opacity={0.2} stroke={redColor} strokeWidth={1} />
      <rect x={148} y={38} width={32} height={5} rx={2} fill={redColor} opacity={0.5} />
      {/* Likelihood / severity badges below */}
      {[0,1,2].map((i) => (
        <g key={i}>
          <rect x={14 + i * 66} y={62} width={44} height={10} rx={4}
            fill={[greenColor, orangeColor, redColor][i]} opacity={0.15} />
          <rect x={20 + i * 66} y={65} width={[20,24,18][i]} height={4} rx={2}
            fill={[greenColor, orangeColor, redColor][i]} opacity={0.5} />
        </g>
      ))}
      <text x={100} y={90} fontSize={6} fill={mutedColor} textAnchor="middle" opacity={0.4}>Scénarios opérationnels</text>
    </Svg>
  );
}

function EbiosTargetPreview() {
  return (
    <Svg>
      {/* Concentric circles (EBIOS RM cible) */}
      <circle cx={100} cy={55} r={44} fill={redColor} fillOpacity={0.1} stroke={redColor} strokeWidth={0.5} strokeOpacity={0.3} />
      <circle cx={100} cy={55} r={33} fill={orangeColor} fillOpacity={0.1} stroke={orangeColor} strokeWidth={0.5} strokeOpacity={0.3} />
      <circle cx={100} cy={55} r={22} fill={yellowColor} fillOpacity={0.1} stroke={yellowColor} strokeWidth={0.5} strokeOpacity={0.3} />
      <circle cx={100} cy={55} r={11} fill={greenColor} fillOpacity={0.1} stroke={greenColor} strokeWidth={0.5} strokeOpacity={0.3} />
      {/* Sector lines */}
      <line x1={100} y1={11} x2={100} y2={99} stroke={mutedColor} strokeWidth={0.5} strokeDasharray="3 2" opacity={0.3} />
      <line x1={56} y1={55} x2={144} y2={55} stroke={mutedColor} strokeWidth={0.5} strokeDasharray="3 2" opacity={0.3} />
      <line x1={69} y1={23} x2={131} y2={87} stroke={mutedColor} strokeWidth={0.5} strokeDasharray="3 2" opacity={0.3} />
      {/* Couples as dots */}
      <circle cx={85} cy={35} r={4} fill={blueColor} opacity={0.8} />
      <circle cx={115} cy={42} r={4} fill={blueColor} opacity={0.8} />
      <circle cx={90} cy={68} r={4} fill={mutedColor} opacity={0.5} />
      <circle cx={120} cy={60} r={4} fill={blueColor} opacity={0.8} />
      <circle cx={80} cy={55} r={4} fill={mutedColor} opacity={0.5} />
      <text x={100} y={110} fontSize={6} fill={mutedColor} textAnchor="middle" opacity={0.4}>Cible EBIOS RM</text>
    </Svg>
  );
}

function ActionPlanPreview() {
  return (
    <Svg>
      {/* Gantt-like bars */}
      {[0,1,2,3,4].map((i) => (
        <g key={i}>
          <rect x={16} y={14 + i * 20} width={[40,35,45,30,38][i]} height={5} rx={2} fill={mutedColor} opacity={0.35} />
          <rect x={70} y={12 + i * 20} width={[80,60,100,50,70][i]} height={12} rx={3}
            fill={[greenColor, blueColor, orangeColor, greenColor, yellowColor][i]} opacity={0.4} />
          <rect x={70} y={12 + i * 20} width={[60,40,30,50,20][i]} height={12} rx={3}
            fill={[greenColor, blueColor, orangeColor, greenColor, yellowColor][i]} opacity={0.7} />
        </g>
      ))}
      <text x={100} y={112} fontSize={6} fill={mutedColor} textAnchor="middle" opacity={0.4}>Plan d'action</text>
    </Svg>
  );
}

function RaciMatrixPreview() {
  const labels = ["R","A","C","I"];
  const clrs = [redColor, orangeColor, blueColor, greenColor];
  return (
    <Svg>
      <rect x={12} y={10} width={176} height={16} rx={3} fill={accent} opacity={0.15} />
      <rect x={16} y={15} width={40} height={5} rx={2} fill={textColor} opacity={0.6} />
      {[0,1,2,3].map((c) => (
        <text key={c} x={76 + c * 30} y={20} fontSize={8} fontWeight="bold"
          fill={clrs[c]} textAnchor="middle" opacity={0.7}>{labels[c]}</text>
      ))}
      {[0,1,2,3].map((r) => (
        <g key={r}>
          <rect x={16} y={34 + r * 18} width={38} height={5} rx={2} fill={mutedColor} opacity={0.35} />
          {[0,1,2,3].map((c) => {
            const show = (r + c) % 3 !== 2;
            return show ? <circle key={c} cx={76 + c * 30} cy={36 + r * 18} r={5}
              fill={clrs[c]} opacity={0.5} /> : null;
          })}
        </g>
      ))}
    </Svg>
  );
}

function RiskAppetitePreview() {
  return (
    <Svg>
      {[0,1,2,3].map((i) => {
        const pct = [65, 85, 40, 55][i];
        const appetite = [70, 60, 50, 80][i];
        const clr = pct <= appetite ? greenColor : pct <= appetite * 1.2 ? yellowColor : redColor;
        return (
          <g key={i}>
            <rect x={16} y={14 + i * 26} width={30} height={5} rx={2} fill={mutedColor} opacity={0.35} />
            <rect x={52} y={12 + i * 26} width={130} height={12} rx={4} fill={mutedColor} opacity={0.08} />
            <rect x={52} y={12 + i * 26} width={pct * 1.3} height={12} rx={4} fill={clr} opacity={0.5} />
            <line x1={52 + appetite * 1.3} y1={10 + i * 26} x2={52 + appetite * 1.3} y2={26 + i * 26}
              stroke={textColor} strokeWidth={1.5} strokeDasharray="2 1" opacity={0.5} />
          </g>
        );
      })}
    </Svg>
  );
}

function ControlMatrixPreview() {
  const statuses = [greenColor, greenColor, yellowColor, redColor, greenColor,
                    yellowColor, greenColor, greenColor, redColor, yellowColor,
                    greenColor, yellowColor, greenColor, greenColor, redColor];
  return (
    <Svg>
      <rect x={12} y={10} width={176} height={14} rx={3} fill={accent} opacity={0.15} />
      <rect x={16} y={14} width={40} height={4} rx={2} fill={textColor} opacity={0.6} />
      {[0,1,2,3,4].map((c) => (
        <rect key={c} x={66 + c * 24} y={14} width={18} height={4} rx={2} fill={textColor} opacity={0.5} />
      ))}
      {[0,1,2].map((r) => (
        <g key={r}>
          <rect x={16} y={30 + r * 28} width={38} height={5} rx={2} fill={mutedColor} opacity={0.3} />
          {[0,1,2,3,4].map((c) => (
            <rect key={c} x={66 + c * 24} y={28 + r * 28} width={18} height={18} rx={3}
              fill={statuses[r * 5 + c]} opacity={0.45} />
          ))}
        </g>
      ))}
    </Svg>
  );
}

function ComplianceGaugePreview() {
  return (
    <Svg>
      {/* Donut gauge */}
      <circle cx={60} cy={52} r={30} fill="none" stroke={mutedColor} strokeWidth={8} opacity={0.1} />
      <circle cx={60} cy={52} r={30} fill="none" stroke={greenColor} strokeWidth={8}
        strokeDasharray="150 39" strokeLinecap="round" opacity={0.6} transform="rotate(-90 60 52)" />
      <text x={60} y={56} fontSize={14} fontWeight="bold" fill={textColor} textAnchor="middle" opacity={0.7}>78%</text>
      {/* Domain bars */}
      {[0,1,2].map((i) => (
        <g key={i}>
          <rect x={110} y={22 + i * 24} width={28} height={4} rx={2} fill={mutedColor} opacity={0.3} />
          <rect x={142} y={20 + i * 24} width={46} height={10} rx={3} fill={mutedColor} opacity={0.08} />
          <rect x={142} y={20 + i * 24} width={[38,30,42][i]} height={10} rx={3}
            fill={[greenColor, yellowColor, greenColor][i]} opacity={0.5} />
        </g>
      ))}
      <text x={100} y={105} fontSize={6} fill={mutedColor} textAnchor="middle" opacity={0.4}>Conformité</text>
    </Svg>
  );
}

/* ─── Graph ─── */
function LineChartPreview() {
  return (
    <Svg>
      <line x1={30} y1={10} x2={30} y2={100} stroke={mutedColor} strokeWidth={1} opacity={0.2} />
      <line x1={30} y1={100} x2={185} y2={100} stroke={mutedColor} strokeWidth={1} opacity={0.2} />
      <polyline points="35,80 60,65 85,70 110,40 135,35 160,50 180,25"
        fill="none" stroke={blueColor} strokeWidth={2} opacity={0.7} />
      <polyline points="35,80 60,65 85,70 110,40 135,35 160,50 180,25 180,100 35,100"
        fill={blueColor} opacity={0.06} />
      {[[35,80],[60,65],[85,70],[110,40],[135,35],[160,50],[180,25]].map(([x,y], i) => (
        <circle key={i} cx={x} cy={y} r={3} fill={blueColor} opacity={0.8} />
      ))}
    </Svg>
  );
}

function BarChartPreview() {
  const bars = [60, 80, 45, 90, 55, 70];
  return (
    <Svg>
      <line x1={25} y1={100} x2={190} y2={100} stroke={mutedColor} strokeWidth={1} opacity={0.2} />
      {bars.map((h, i) => (
        <rect key={i} x={32 + i * 26} y={100 - h} width={18} height={h} rx={3}
          fill={blueColor} opacity={0.5 + i * 0.05} />
      ))}
    </Svg>
  );
}

function PieChartPreview() {
  return (
    <Svg>
      <circle cx={80} cy={60} r={40} fill={blueColor} opacity={0.6} />
      <path d="M80,60 L80,20 A40,40 0 0,1 114,40 Z" fill={orangeColor} opacity={0.7} />
      <path d="M80,60 L114,40 A40,40 0 0,1 115,80 Z" fill={greenColor} opacity={0.7} />
      <circle cx={80} cy={60} r={18} fill={bg} />
      {/* Legend */}
      <rect x={140} y={30} width={8} height={8} rx={2} fill={blueColor} opacity={0.6} />
      <rect x={152} y={32} width={30} height={4} rx={2} fill={mutedColor} opacity={0.3} />
      <rect x={140} y={48} width={8} height={8} rx={2} fill={orangeColor} opacity={0.7} />
      <rect x={152} y={50} width={24} height={4} rx={2} fill={mutedColor} opacity={0.3} />
      <rect x={140} y={66} width={8} height={8} rx={2} fill={greenColor} opacity={0.7} />
      <rect x={152} y={68} width={28} height={4} rx={2} fill={mutedColor} opacity={0.3} />
    </Svg>
  );
}

function RadarChartPreview() {
  return <MaturityRadarPreview />;
}

function HeatmapPreview() {
  const vals = [0.2,0.5,0.8,0.3,0.9,0.1,0.7,0.4,0.6,0.8,0.2,0.5,0.3,0.9,0.4,0.7,0.1,0.6,0.5,0.8];
  return (
    <Svg>
      {[0,1,2,3].map((r) => [0,1,2,3,4].map((c) => {
        const v = vals[r * 5 + c];
        return <rect key={`${r}-${c}`} x={22 + c * 34} y={12 + r * 24} width={30} height={20} rx={3}
          fill={redColor} opacity={v * 0.7 + 0.05} />;
      }))}
    </Svg>
  );
}

function ScatterPlotPreview() {
  const pts = [[40,70],[55,50],[70,80],[90,30],[110,45],[120,60],[140,25],[155,55],[170,40]];
  return (
    <Svg>
      <line x1={30} y1={10} x2={30} y2={100} stroke={mutedColor} strokeWidth={1} opacity={0.2} />
      <line x1={30} y1={100} x2={185} y2={100} stroke={mutedColor} strokeWidth={1} opacity={0.2} />
      {pts.map(([x,y], i) => (
        <circle key={i} cx={x} cy={y} r={4} fill={blueColor} opacity={0.5} />
      ))}
    </Svg>
  );
}

function AreaChartPreview() {
  return (
    <Svg>
      <line x1={25} y1={100} x2={185} y2={100} stroke={mutedColor} strokeWidth={1} opacity={0.2} />
      <path d="M30,80 Q60,50 90,60 T150,30 L180,45 L180,100 L30,100 Z" fill={blueColor} opacity={0.15} />
      <path d="M30,80 Q60,50 90,60 T150,30 L180,45" fill="none" stroke={blueColor} strokeWidth={2} opacity={0.6} />
      <path d="M30,90 Q60,70 90,75 T150,55 L180,65 L180,100 L30,100 Z" fill={greenColor} opacity={0.1} />
      <path d="M30,90 Q60,70 90,75 T150,55 L180,65" fill="none" stroke={greenColor} strokeWidth={2} opacity={0.5} />
    </Svg>
  );
}

function SankeyPreview() {
  return (
    <Svg>
      {/* Left blocks */}
      <rect x={10} y={15} width={16} height={35} rx={3} fill={blueColor} opacity={0.6} />
      <rect x={10} y={55} width={16} height={25} rx={3} fill={greenColor} opacity={0.6} />
      <rect x={10} y={85} width={16} height={20} rx={3} fill={orangeColor} opacity={0.6} />
      {/* Right blocks */}
      <rect x={174} y={20} width={16} height={30} rx={3} fill={redColor} opacity={0.6} />
      <rect x={174} y={55} width={16} height={40} rx={3} fill={yellowColor} opacity={0.6} />
      {/* Flows */}
      <path d="M26,30 C80,30 120,32 174,35" fill="none" stroke={blueColor} strokeWidth={12} opacity={0.12} />
      <path d="M26,65 C80,65 120,70 174,72" fill="none" stroke={greenColor} strokeWidth={8} opacity={0.12} />
      <path d="M26,95 C80,95 120,60 174,55" fill="none" stroke={orangeColor} strokeWidth={6} opacity={0.12} />
    </Svg>
  );
}

function GaugeChartPreview() {
  return (
    <Svg>
      <path d="M45,90 A50,50 0 0,1 155,90" fill="none" stroke={mutedColor} strokeWidth={10} opacity={0.12} />
      <path d="M45,90 A50,50 0 0,1 140,50" fill="none" stroke={greenColor} strokeWidth={10} strokeLinecap="round" opacity={0.6} />
      <text x={100} y={85} fontSize={20} fontWeight="bold" fill={textColor} textAnchor="middle" opacity={0.7}>72%</text>
      <rect x={70} y={98} width={60} height={5} rx={2} fill={mutedColor} opacity={0.3} />
    </Svg>
  );
}

function TreemapPreview() {
  return (
    <Svg>
      <rect x={12} y={10} width={100} height={60} rx={4} fill={blueColor} opacity={0.4} />
      <rect x={12} y={74} width={100} height={36} rx={4} fill={greenColor} opacity={0.4} />
      <rect x={116} y={10} width={72} height={40} rx={4} fill={orangeColor} opacity={0.4} />
      <rect x={116} y={54} width={72} height={26} rx={4} fill={yellowColor} opacity={0.4} />
      <rect x={116} y={84} width={36} height={26} rx={4} fill={redColor} opacity={0.4} />
      <rect x={156} y={84} width={32} height={26} rx={4} fill={mutedColor} opacity={0.25} />
    </Svg>
  );
}

function FunnelPreview() {
  const widths = [160, 120, 80, 40];
  return (
    <Svg>
      {widths.map((w, i) => (
        <rect key={i} x={(W - w) / 2} y={14 + i * 24} width={w} height={20} rx={4}
          fill={[blueColor, greenColor, orangeColor, redColor][i]} opacity={0.5 - i * 0.05} />
      ))}
    </Svg>
  );
}

function SparklinePreview() {
  return (
    <Svg>
      <TextLines x={20} y={20} widths={[120, 100]} gap={10} h={5} />
      <polyline points="20,55 35,52 50,58 65,48 80,50 95,42 110,46 125,38"
        fill="none" stroke={blueColor} strokeWidth={2} opacity={0.6} />
      <TextLines x={20} y={72} widths={[110, 130]} gap={10} h={5} />
      <polyline points="20,107 35,100 50,104 65,96 80,98 95,92 110,88"
        fill="none" stroke={greenColor} strokeWidth={2} opacity={0.6} />
    </Svg>
  );
}

function WaterfallPreview() {
  const data = [{y:80,h:20,c:greenColor},{y:60,h:20,c:greenColor},{y:50,h:10,c:greenColor},{y:55,h:10,c:redColor},{y:40,h:15,c:greenColor},{y:40,h:40,c:blueColor}];
  return (
    <Svg>
      <line x1={25} y1={100} x2={185} y2={100} stroke={mutedColor} strokeWidth={1} opacity={0.2} />
      {data.map((d, i) => (
        <rect key={i} x={30 + i * 26} y={d.y} width={18} height={d.h} rx={2} fill={d.c} opacity={0.5} />
      ))}
    </Svg>
  );
}

function StackedBarPreview() {
  const stacks = [[30,25,20],[40,20,15],[25,30,25],[35,25,10]];
  return (
    <Svg>
      <line x1={25} y1={100} x2={185} y2={100} stroke={mutedColor} strokeWidth={1} opacity={0.2} />
      {stacks.map((s, i) => {
        let acc = 0;
        return s.map((h, j) => {
          const y = 100 - acc - h;
          acc += h;
          return <rect key={`${i}-${j}`} x={34 + i * 40} y={y} width={24} height={h} rx={j === s.length - 1 ? 3 : 0}
            fill={[blueColor, greenColor, orangeColor][j]} opacity={0.5} />;
        });
      })}
    </Svg>
  );
}

/* ─── OSINT ─── */
function RelationshipGraphPreview() {
  return (
    <Svg>
      {/* Center node */}
      <circle cx={100} cy={55} r={14} fill={blueColor} opacity={0.3} stroke={blueColor} strokeWidth={1.5} />
      {/* Satellites */}
      {[[40,25],[160,25],[30,85],[170,85],[100,105],[55,55],[145,55]].map(([x,y], i) => (
        <g key={i}>
          <line x1={100} y1={55} x2={x} y2={y} stroke={mutedColor} strokeWidth={1} opacity={0.3} />
          <circle cx={x} cy={y} r={8} fill={[orangeColor,greenColor,redColor,yellowColor,blueColor,accent,greenColor][i]} opacity={0.4} />
        </g>
      ))}
    </Svg>
  );
}

function GeoMapPreview() {
  return (
    <Svg>
      {/* Stylized map bg */}
      <rect x={12} y={10} width={176} height={100} rx={6} fill={greenColor} opacity={0.06} />
      <path d="M30,50 Q50,30 80,45 T130,35 Q160,40 175,55 Q170,75 140,80 Q100,90 60,75 Q35,65 30,50Z"
        fill={greenColor} opacity={0.15} stroke={greenColor} strokeWidth={1} />
      {/* Pins */}
      {[[55,50],[90,40],[130,55],[70,68],[150,45]].map(([x,y], i) => (
        <g key={i}>
          <circle cx={x} cy={y} r={4} fill={redColor} opacity={0.7} />
          <circle cx={x} cy={y} r={7} fill={redColor} opacity={0.15} />
        </g>
      ))}
    </Svg>
  );
}

function TimelinePreview() {
  return (
    <Svg>
      <line x1={30} y1={20} x2={30} y2={105} stroke={accent} strokeWidth={2} opacity={0.3} />
      {[0,1,2,3].map((i) => (
        <g key={i}>
          <circle cx={30} cy={24 + i * 24} r={5} fill={accent} opacity={0.5} />
          <rect x={42} y={19 + i * 24} width={50} height={5} rx={2} fill={textColor} opacity={0.5} />
          <rect x={42} y={28 + i * 24} width={120} height={4} rx={2} fill={mutedColor} opacity={0.3} />
        </g>
      ))}
    </Svg>
  );
}

/* ─── Hardware ─── */
function CircuitDiagramPreview() {
  return (
    <Svg>
      {/* Chip */}
      <rect x={70} y={30} width={60} height={50} rx={4} fill="#1a1a18" opacity={0.7} />
      <rect x={80} y={40} width={40} height={5} rx={2} fill={greenColor} opacity={0.5} />
      <rect x={85} y={50} width={30} height={4} rx={2} fill={mutedColor} opacity={0.4} />
      {/* Pins left */}
      {[0,1,2,3].map((i) => (
        <g key={`l${i}`}>
          <line x1={50} y1={38 + i * 10} x2={70} y2={38 + i * 10} stroke={accent} strokeWidth={1.5} />
          <circle cx={50} cy={38 + i * 10} r={2} fill={accent} />
        </g>
      ))}
      {/* Pins right */}
      {[0,1,2,3].map((i) => (
        <g key={`r${i}`}>
          <line x1={130} y1={38 + i * 10} x2={150} y2={38 + i * 10} stroke={accent} strokeWidth={1.5} />
          <circle cx={150} cy={38 + i * 10} r={2} fill={accent} />
        </g>
      ))}
      {/* Traces */}
      <line x1={30} y1={38} x2={50} y2={38} stroke={greenColor} strokeWidth={1} opacity={0.5} />
      <line x1={150} y1={48} x2={175} y2={48} stroke={greenColor} strokeWidth={1} opacity={0.5} />
      <line x1={50} y1={58} x2={30} y2={58} stroke={blueColor} strokeWidth={1} opacity={0.5} />
      <polyline points="150,68 165,68 165,95 30,95 30,68 50,68" fill="none" stroke={redColor} strokeWidth={1} opacity={0.4} />
    </Svg>
  );
}

function SignalWaveformPreview() {
  return (
    <Svg>
      {/* Digital waveform */}
      <polyline points="15,30 40,30 40,15 65,15 65,30 80,30 80,15 105,15 105,30 130,30 130,15 155,15 155,30 180,30"
        fill="none" stroke={greenColor} strokeWidth={2} opacity={0.6} />
      {/* Analog waveform */}
      <path d="M15,75 Q30,55 50,75 T85,75 T120,75 T155,75 T185,75"
        fill="none" stroke={blueColor} strokeWidth={2} opacity={0.5} />
      {/* Axis labels */}
      <rect x={15} y={100} width={20} height={4} rx={2} fill={mutedColor} opacity={0.3} />
      <rect x={80} y={100} width={20} height={4} rx={2} fill={mutedColor} opacity={0.3} />
      <rect x={150} y={100} width={20} height={4} rx={2} fill={mutedColor} opacity={0.3} />
    </Svg>
  );
}

function HexViewerPreview() {
  return (
    <Svg>
      <rect x={8} y={6} width={184} height={108} rx={4} fill="#1E1E1E" />
      {[0,1,2,3,4,5].map((i) => (
        <g key={i}>
          <rect x={14} y={14 + i * 16} width={30} height={5} rx={1} fill={blueColor} opacity={0.4} />
          <rect x={50} y={14 + i * 16} width={90} height={5} rx={1} fill="#D4D4D4" opacity={0.25} />
          <rect x={148} y={14 + i * 16} width={36} height={5} rx={1} fill={greenColor} opacity={0.3} />
        </g>
      ))}
      {/* Highlight */}
      <rect x={68} y={28} width={18} height={9} rx={2} fill={yellowColor} opacity={0.2} />
    </Svg>
  );
}

function MemoryMapPreview() {
  return (
    <Svg>
      <rect x={50} y={8} width={100} height={18} rx={3} fill={redColor} opacity={0.3} />
      <rect x={56} y={13} width={30} height={5} rx={2} fill={redColor} opacity={0.5} />
      <rect x={50} y={28} width={100} height={22} rx={0} fill={orangeColor} opacity={0.2} />
      <rect x={56} y={36} width={25} height={5} rx={2} fill={orangeColor} opacity={0.5} />
      <rect x={50} y={52} width={100} height={28} rx={0} fill={blueColor} opacity={0.15} />
      <rect x={56} y={62} width={28} height={5} rx={2} fill={blueColor} opacity={0.5} />
      <rect x={50} y={82} width={100} height={26} rx={3} fill={greenColor} opacity={0.2} />
      <rect x={56} y={92} width={22} height={5} rx={2} fill={greenColor} opacity={0.5} />
      {/* Addresses */}
      <rect x={14} y={13} width={28} height={4} rx={1} fill={mutedColor} opacity={0.3} />
      <rect x={14} y={36} width={28} height={4} rx={1} fill={mutedColor} opacity={0.3} />
      <rect x={14} y={62} width={28} height={4} rx={1} fill={mutedColor} opacity={0.3} />
      <rect x={14} y={92} width={28} height={4} rx={1} fill={mutedColor} opacity={0.3} />
    </Svg>
  );
}

/* ─── Forensics ─── */
function ProcessTreePreview() {
  return (
    <Svg>
      <rect x={20} y={12} width={60} height={16} rx={4} fill={blueColor} opacity={0.2} stroke={blueColor} strokeWidth={1} />
      <rect x={26} y={17} width={40} height={5} rx={2} fill={blueColor} opacity={0.5} />
      <line x1={50} y1={28} x2={50} y2={38} stroke={mutedColor} strokeWidth={1} />
      <line x1={50} y1={38} x2={30} y2={38} stroke={mutedColor} strokeWidth={1} />
      <line x1={50} y1={38} x2={90} y2={38} stroke={mutedColor} strokeWidth={1} />
      <rect x={10} y={38} width={50} height={16} rx={4} fill={greenColor} opacity={0.2} stroke={greenColor} strokeWidth={1} />
      <rect x={16} y={43} width={30} height={5} rx={2} fill={greenColor} opacity={0.5} />
      <rect x={70} y={38} width={50} height={16} rx={4} fill={orangeColor} opacity={0.2} stroke={orangeColor} strokeWidth={1} />
      <rect x={76} y={43} width={30} height={5} rx={2} fill={orangeColor} opacity={0.5} />
      <line x1={95} y1={54} x2={95} y2={64} stroke={mutedColor} strokeWidth={1} />
      <rect x={75} y={64} width={50} height={16} rx={4} fill={redColor} opacity={0.2} stroke={redColor} strokeWidth={1} />
      <rect x={81} y={69} width={30} height={5} rx={2} fill={redColor} opacity={0.5} />
    </Svg>
  );
}

function DiskImageMapPreview() {
  return (
    <Svg>
      <rect x={16} y={40} width={168} height={40} rx={6} fill={mutedColor} opacity={0.1} stroke={border} strokeWidth={1} />
      <rect x={18} y={42} width={50} height={36} rx={4} fill={blueColor} opacity={0.4} />
      <rect x={70} y={42} width={70} height={36} rx={4} fill={greenColor} opacity={0.3} />
      <rect x={142} y={42} width={40} height={36} rx={4} fill={mutedColor} opacity={0.15} />
      {/* Labels */}
      <rect x={24} y={56} width={36} height={5} rx={2} fill="#fff" opacity={0.6} />
      <rect x={88} y={56} width={30} height={5} rx={2} fill="#fff" opacity={0.5} />
      <rect x={150} y={56} width={24} height={5} rx={2} fill={mutedColor} opacity={0.4} />
      {/* Caption */}
      <rect x={50} y={90} width={100} height={5} rx={2} fill={mutedColor} opacity={0.3} />
    </Svg>
  );
}

function IocTablePreview() {
  return (
    <Svg>
      <rect x={12} y={12} width={176} height={16} rx={3} fill={redColor} opacity={0.1} />
      {[0,1,2,3].map((i) => (
        <g key={i}>
          <rect x={16} y={34 + i * 18} width={24} height={9} rx={4}
            fill={[redColor, blueColor, orangeColor, greenColor][i]} opacity={0.25} />
          <rect x={16} y={36 + i * 18} width={22} height={5} rx={2}
            fill={[redColor, blueColor, orangeColor, greenColor][i]} opacity={0.5} />
          <rect x={46} y={36 + i * 18} width={80} height={5} rx={2} fill={mutedColor} opacity={0.3} />
          <rect x={132} y={36 + i * 18} width={40} height={5} rx={2} fill={mutedColor} opacity={0.2} />
        </g>
      ))}
    </Svg>
  );
}

function LogViewerPreview() {
  return (
    <Svg>
      <rect x={8} y={6} width={184} height={108} rx={4} fill="#1E1E1E" />
      {[0,1,2,3,4,5].map((i) => (
        <g key={i}>
          <rect x={14} y={14 + i * 16} width={40} height={5} rx={1} fill={mutedColor} opacity={0.3} />
          <rect x={58} y={14 + i * 16} width={14} height={5} rx={2}
            fill={[greenColor, greenColor, yellowColor, redColor, greenColor, orangeColor][i]} opacity={0.6} />
          <rect x={76} y={14 + i * 16} width={[90,70,100,80,95,60][i]} height={5} rx={1} fill="#D4D4D4" opacity={0.2} />
        </g>
      ))}
    </Svg>
  );
}

/* ─── Social Engineering ─── */
function PhishingStatsPreview() {
  const widths = [160, 120, 70, 30];
  const labels = ["Envoyés", "Ouverts", "Cliqués", "Soumis"];
  return (
    <Svg>
      {widths.map((w, i) => (
        <g key={i}>
          <rect x={20} y={14 + i * 24} width={w} height={18} rx={4}
            fill={[blueColor, greenColor, orangeColor, redColor][i]} opacity={0.4} />
          <text x={24} y={26 + i * 24} fontSize={8} fill="#fff" opacity={0.8}>{labels[i]}</text>
        </g>
      ))}
    </Svg>
  );
}

function EmailTemplatePreview() {
  return (
    <Svg>
      <rect x={20} y={10} width={160} height={100} rx={6} fill="#fff" stroke={border} strokeWidth={1} />
      <rect x={20} y={10} width={160} height={20} rx={6} fill={blueColor} opacity={0.1} />
      <rect x={28} y={17} width={80} height={6} rx={2} fill={textColor} opacity={0.5} />
      <TextLines x={28} y={40} widths={[140, 130, 144]} gap={9} />
      <rect x={28} y={74} width={80} height={20} rx={6} fill={redColor} opacity={0.2} stroke={redColor} strokeWidth={1} strokeDasharray="3 2" />
      <rect x={36} y={81} width={64} height={5} rx={2} fill={redColor} opacity={0.4} />
      {/* Red flag markers */}
      <circle cx={118} y={82} r={5} fill={redColor} opacity={0.15} />
      <text x={118} y={85} fontSize={7} fill={redColor} textAnchor="middle" fontWeight="bold">!</text>
    </Svg>
  );
}

/* ─── LOOKUP MAP ─── */
export const blockPreviews = {
  // Content
  "section-title": SectionTitlePreview,
  "text": TextPreview,
  "code": CodePreview,
  "table": TablePreview,
  "callout": CalloutPreview,
  // Layout
  "separator": SeparatorPreview,
  "spacer": SpacerPreview,
  "horizontal-div": ColumnsPreview,
  "drawer": DrawerPreview,
  // Media
  "image": ImagePreview,
  // Pentest
  "score-gauge": ScoreGaugePreview,
  "risk-matrix": RiskMatrixPreview,
  "risk-assessment": RiskAssessmentPreview,
  "vulnerability-card": VulnerabilityCardPreview,
  "cve-table": CveTablePreview,
  "cvss-calculator": CvssCalculatorPreview,
  "attack-timeline": AttackTimelinePreview,
  "scope-block": ScopeBlockPreview,
  "findings-summary": FindingsSummaryPreview,
  "recommendation": RecommendationPreview,
  "attack-path": AttackPathPreview,
  "credentials-table": CredentialsTablePreview,
  "privilege-escalation": PrivilegeEscalationPreview,
  // Network
  "network-topology": NetworkTopologyPreview,
  "port-scan-table": PortScanTablePreview,
  "firewall-rules": FirewallRulesPreview,
  "vlan-diagram": GenericDiagramPreview,
  "network-flow": SankeyPreview,
  "architecture-diagram": GenericDiagramPreview,
  "server-inventory": GenericTablePreview,
  "dns-records": GenericTablePreview,
  "certificate-info": GenericCardPreview,
  "subnet-map": HeatmapPreview,
  "cloud-architecture": GenericDiagramPreview,
  "wireless-survey": GenericTablePreview,
  // GRC
  "ebios-feared-events": EbiosFearedEventsPreview,
  "ebios-scenarios": EbiosScenariosPreview,
  "ebios-target": EbiosTargetPreview,
  "compliance-checklist": ComplianceChecklistPreview,
  "gap-analysis": GapAnalysisPreview,
  "risk-register": RiskRegisterPreview,
  "maturity-radar": MaturityRadarPreview,
  "action-plan": ActionPlanPreview,
  "raci-matrix": RaciMatrixPreview,
  "risk-appetite": RiskAppetitePreview,
  "control-matrix": ControlMatrixPreview,
  "compliance-gauge": ComplianceGaugePreview,
  // Hardware
  "circuit-diagram": CircuitDiagramPreview,
  "pin-diagram": CircuitDiagramPreview,
  "signal-waveform": SignalWaveformPreview,
  "hardware-block-diagram": GenericDiagramPreview,
  "photo-annotation": ImagePreview,
  "component-card": GenericCardPreview,
  "memory-map": MemoryMapPreview,
  "bus-protocol": SignalWaveformPreview,
  "firmware-diff": HexViewerPreview,
  "physical-access-plan": GeoMapPreview,
  // OSINT
  "port-scan-visual": HeatmapPreview,
  "relationship-graph": RelationshipGraphPreview,
  "geo-map": GeoMapPreview,
  "domain-info": GenericCardPreview,
  "whois-card": GenericCardPreview,
  "ip-geolocation": GenericCardPreview,
  "email-header-analysis": GenericTablePreview,
  "social-profile": GenericCardPreview,
  "metadata-viewer": GenericTablePreview,
  "timeline": TimelinePreview,
  "subdomain-tree": ProcessTreePreview,
  "data-breach-card": GenericCardPreview,
  "screenshot-annotated": ImagePreview,
  // Graph
  "line-chart": LineChartPreview,
  "bar-chart": BarChartPreview,
  "pie-chart": PieChartPreview,
  "radar-chart": RadarChartPreview,
  "scatter-plot": ScatterPlotPreview,
  "heatmap": HeatmapPreview,
  "stacked-bar": StackedBarPreview,
  "area-chart": AreaChartPreview,
  "treemap": TreemapPreview,
  "gauge-chart": GaugeChartPreview,
  "sankey-diagram": SankeyPreview,
  "sparkline": SparklinePreview,
  "waterfall-chart": WaterfallPreview,
  "funnel-chart": FunnelPreview,
  // Forensics
  "disk-image-map": DiskImageMapPreview,
  "file-timeline": TimelinePreview,
  "registry-viewer": ProcessTreePreview,
  "process-tree": ProcessTreePreview,
  "log-viewer": LogViewerPreview,
  "ioc-table": IocTablePreview,
  "chain-of-custody": TimelinePreview,
  "hex-viewer": HexViewerPreview,
  "malware-summary": GenericCardPreview,
  "event-correlation": HeatmapPreview,
  // Social Engineering
  "phishing-stats": PhishingStatsPreview,
  "email-template": EmailTemplatePreview,
  "awareness-score": BarChartPreview,
  "pretext-scenario": TimelinePreview,
  "badge-cloning": GenericCardPreview,
  "vishing-log": GenericTablePreview,
};
