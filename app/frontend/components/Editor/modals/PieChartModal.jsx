import { ItemsChartModalEditor } from "./ItemsChartModal";

export function PieChartEditor({ block }) {
  return <ItemsChartModalEditor block={block} chartType="pie-chart" extraControls={[{ key: "donut", label: "Mode donut", type: "toggle", defaultValue: false }]} />;
}
