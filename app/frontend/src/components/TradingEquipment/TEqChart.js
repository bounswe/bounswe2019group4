import React from "react";

import { scaleTime } from "d3-scale";
import { utcDay } from "d3-time";

import { ChartCanvas, Chart } from "react-stockcharts";
import { CandlestickSeries,LineSeries } from "react-stockcharts/lib/series";
import { XAxis, YAxis } from "react-stockcharts/lib/axes";
import { fitWidth } from "react-stockcharts/lib/helper";
import { last, timeIntervalBarWidth } from "react-stockcharts/lib/utils";
import { LabelAnnotation, Label, Annotate } from "react-stockcharts/lib/annotation";

import { EdgeIndicator } from "react-stockcharts/lib/coordinates";

import { discontinuousTimeScaleProvider } from "react-stockcharts/lib/scale";
import { HoverTooltip } from "react-stockcharts/lib/tooltip";
import { ema } from "react-stockcharts/lib/indicator";

import { format } from "d3-format";
import { timeFormat } from "d3-time-format";

function tooltipContent(ys) {
    return ({ currentItem, xAccessor }) => {
        return {
            x: dateFormat(xAccessor(currentItem)),
            y: [
                {
                    label: "open",
                    value: currentItem.open && numberFormat(currentItem.open)
                },
                {
                    label: "high",
                    value: currentItem.high && numberFormat(currentItem.high)
                },
                {
                    label: "low",
                    value: currentItem.low && numberFormat(currentItem.low)
                },
                {
                    label: "close",
                    value: currentItem.close && numberFormat(currentItem.close)
                }
            ]
                .concat(
                    ys.map(each => ({
                        label: each.label,
                        value: each.value(currentItem),
                        stroke: each.stroke
                    }))
                )
                .filter(line => line.value)
        };
    };
}
const dateFormat = timeFormat("%d.%m.%Y");
const numberFormat = format(".5f");
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

        const ema20 = ema()
            .id(0)
            .options({ windowSize: 20 })
            .merge((d, c) => {
                d.ema20 = c;
            })
            .accessor(d => d.ema20);

        const ema50 = ema()
            .id(2)
            .options({ windowSize: 50 })
            .merge((d, c) => {
                d.ema50 = c;
            })
            .accessor(d => d.ema50);
        return (
            <ChartCanvas height={400}
                         ratio={ratio}
                         width={width}
                         margin={{ left: 60, right: 50, top: 10, bottom: 30 }}
                         type="svg"
                         seriesName="MSFT"
                         data={data}
                         xAccessor={xAccessor}
                         xScale={scaleTime()}
                         xExtents={xExtents}>
                <Chart id={1} yExtents={d => [d.high, d.low]}>
                    <XAxis axisAt="bottom" orient="bottom" ticks={6} stroke="#FFFFFF" tickStroke="#FFFFFF" opacity={0.5}/>
                    <YAxis axisAt="left" orient="left" ticks={5} inverted={true} tickStroke="#FFFFFF" />
                    <Label x={yAxisLabelX} y={yAxisLabelY}
                           rotate={-90}
                           fontSize="12"
                           color="#FFFFFF"
                           text={convertedCurrency} />
                    <LineSeries
                        yAccessor={ema20.accessor()}
                        stroke={ema20.stroke()}
                    />
                    <LineSeries
                        yAccessor={ema50.accessor()}
                        stroke={ema50.stroke()}
                    />
                    <CandlestickSeries width={timeIntervalBarWidth(utcDay)} stroke={d => d.close > d.open ? "#6BA583" : "#DB0000"}
                                       wickStroke={d => d.close > d.open ? "#6BA583" : "#DB0000"}
                                       fill={d => d.close > d.open ? "#6BA583" : "#DB0000"}/>
                    <HoverTooltip
                        yAccessor={ema50.accessor()}
                        tooltipContent={tooltipContent([
                            {
                                label: `${ema20.type()}(${ema20.options()
                                    .windowSize})`,
                                value: d => numberFormat(ema20.accessor()(d)),
                                stroke: ema20.stroke()
                            },
                            {
                                label: `${ema50.type()}(${ema50.options()
                                    .windowSize})`,
                                value: d => numberFormat(ema50.accessor()(d)),
                                stroke: ema50.stroke()
                            }
                        ])}
                        fontSize={15}
                    />
                </Chart>
            </ChartCanvas>
        );
    }
}
CandleStickChart = fitWidth(CandleStickChart);

export default CandleStickChart;

