import React from "react";
import { useTheme } from "next-themes";
import { scaleTime } from "d3-scale";
import { format } from "d3-format";
import { timeFormat } from "d3-time-format";
import { XAxis, YAxis } from "@react-financial-charts/axes";
import {
  ChartCanvas,
  Chart,
  CrossHairCursor,
  MouseCoordinateX,
  MouseCoordinateY,
  AreaSeries,
  HoverTooltip,
} from "react-financial-charts";

import { PriceData } from "@/src/types/Stock";
import TooltipContent from "@/src/components/Stocks/Tooltip";
import Loader from "@/src/components/units/Loader";

interface LineChartProps {
  ticker: string;
  priceData: PriceData[];
}

const LineChart: React.FC<LineChartProps> = ({ ticker, priceData }) => {
  const { theme } = useTheme();

  const getChartColors = () => {
    let axisColor = "black";
    let priceLineColor = "blue";
    let priceFillColor = "rgb(173, 216, 230, 0.3)";

    if (theme === "light") {
      priceLineColor = "rgba(30, 255, 100)";
      priceFillColor = "rgb(144, 238, 144, 0.3)";
    } else {
      priceLineColor = "rgba(100, 255, 100)";
      priceFillColor = "rgb(144, 238, 144, 0.2)";
      axisColor = "white";
    }
    return { axisColor, priceLineColor, priceFillColor };
  };

  const { axisColor, priceLineColor, priceFillColor } = getChartColors();
  const xAccessor = (d: PriceData) => d?.date;

  return priceData.length === 0 ? (
    <div className="flex justify-center items-center h-full">
      <Loader />
    </div>
  ) : (
    <div className="flex flex-col items-center justify-center px-4 py-2 w-full max-w-4xl mx-auto">
      <ChartCanvas
        height={400}
        ratio={1}
        width={600}
        margin={{ left: 50, right: 50, top: 10, bottom: 30 }}
        seriesName={ticker}
        data={priceData}
        xScale={scaleTime()}
        xAccessor={xAccessor}
        xExtents={[
          xAccessor(priceData[0]),
          xAccessor(priceData[priceData.length - 1]),
        ]}
        disableZoom={true}
        disablePan={true}
      >
        <Chart id={1} yExtents={(d: PriceData) => [d.close]}>
          <XAxis
            axisAt="bottom"
            orient="bottom"
            tickLabelFill={axisColor}
            tickStrokeStyle={axisColor}
            strokeStyle={axisColor}
            ticks={6}
            gridLinesStrokeDasharray="Solid"
            gridLinesStrokeStyle="#e0e0e0"
          />
          <YAxis
            axisAt="left"
            orient="left"
            tickLabelFill={axisColor}
            tickStrokeStyle={axisColor}
            strokeStyle={axisColor}
            gridLinesStrokeDasharray="Solid"
            gridLinesStrokeStyle="#e0e0e0"
          />
          <AreaSeries
            yAccessor={(d: PriceData) => d.close}
            baseAt={(scale) => scale(0)}
            strokeStyle={priceLineColor}
            fillStyle={priceFillColor}
          />
          <MouseCoordinateX
            at="bottom"
            orient="bottom"
            displayFormat={timeFormat("%Y-%m-%d")}
          />
          <MouseCoordinateY
            at="right"
            orient="right"
            displayFormat={format(".2f")}
          />
          <HoverTooltip
            yAccessor={(d) => d.close}
            tooltip={TooltipContent}
            chartId={1}
            fontSize={15}
          />
        </Chart>
        <CrossHairCursor strokeStyle={axisColor} />
      </ChartCanvas>
    </div>
  );
};

export default LineChart;
