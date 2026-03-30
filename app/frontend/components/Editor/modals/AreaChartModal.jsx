import { SeriesChartModalEditor } from "./SeriesChartModal";

export function AreaChartEditor({ block }) {
  return <SeriesChartModalEditor block={block} chartType="area-chart" extraControls={[
    { key: "showDots", label: "Points", type: "toggle", defaultValue: true },
  ]} />;
}
