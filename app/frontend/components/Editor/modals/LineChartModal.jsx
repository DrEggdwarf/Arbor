import { SeriesChartModalEditor } from "./SeriesChartModal";

export function LineChartEditor({ block }) {
  return <SeriesChartModalEditor block={block} chartType="line-chart" extraControls={[
    { key: "showDots", label: "Points", type: "toggle", defaultValue: true },
    { key: "showArea", label: "Remplissage", type: "toggle", defaultValue: false },
  ]} />;
}
