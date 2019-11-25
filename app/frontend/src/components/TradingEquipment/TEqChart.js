import React from "react";

import { scaleTime } from "d3-scale";
import { utcDay } from "d3-time";

import { ChartCanvas, Chart } from "react-stockcharts";
import { CandlestickSeries } from "react-stockcharts/lib/series";
import { XAxis, YAxis } from "react-stockcharts/lib/axes";
import { fitWidth } from "react-stockcharts/lib/helper";
import { last, timeIntervalBarWidth } from "react-stockcharts/lib/utils";
import { LabelAnnotation, Label, Annotate } from "react-stockcharts/lib/annotation";


class CandleStickChart extends React.Component {

    render() {
        const { width, data, ratio, convertedCurrency } = this.props;
        const margin = { left: 80, right: 80, top: 30, bottom: 50 };
        const height = 400;
        const xAccessor = d => d.date;
        const xExtents = [
            xAccessor(last(data)),
            xAccessor(data[data.length - 100])
        ];
        const [yAxisLabelX, yAxisLabelY] = [width - margin.left - 40, margin.top + (height - margin.top - margin.bottom) / 2]
        return (
            <ChartCanvas height={400}
                         ratio={ratio}
                         width={width}
                         margin={{ left: 50, right: 50, top: 10, bottom: 30 }}
                         type="svg"
                         seriesName="MSFT"
                         data={data}
                         xAccessor={xAccessor}
                         xScale={scaleTime()}
                         xExtents={xExtents}>
                <Chart id={1} yExtents={d => [d.high, d.low]}>
                    <XAxis axisAt="bottom" orient="bottom" ticks={6}/>
                    <YAxis axisAt="left" orient="left" ticks={5} />
                    <Label x={yAxisLabelX} y={yAxisLabelY}
                           rotate={-90}
                           fontSize="12" text={convertedCurrency} />
                    <CandlestickSeries width={timeIntervalBarWidth(utcDay)}/>
                </Chart>
            </ChartCanvas>
        );
    }
}
CandleStickChart = fitWidth(CandleStickChart);

export default CandleStickChart;

