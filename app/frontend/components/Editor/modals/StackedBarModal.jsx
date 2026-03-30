import { SeriesChartModalEditor } from "./SeriesChartModal";

export function StackedBarEditor({ block }) {
  return <SeriesChartModalEditor block={block} chartType="stacked-bar" extraControls={[
    { key: "orientation", label: "Orientation", type: "select", defaultValue: "vertical", options: [{ value: "vertical", label: "Vertical" }, { value: "horizontal", label: "Horizontal" }] },
  ]} />;
}
