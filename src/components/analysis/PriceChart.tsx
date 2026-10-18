import React, { useEffect, useRef } from 'react';
import {
  CandlestickSeries,
  ColorType,
  createChart,
  createSeriesMarkers,
  HistogramSeries,
  LineStyle,
} from 'lightweight-charts';
import type { IChartApi, UTCTimestamp } from 'lightweight-charts';
import type { AnalysisResponse } from '../../types/analysis';

interface PriceChartProps {
  data: AnalysisResponse;
}

export const PriceChart: React.FC<PriceChartProps> = ({ data }) => {
  const chartContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = chartContainerRef.current;
    if (!container || !data.bars?.length) return;

    const chart: IChartApi = createChart(container, {
      layout: {
        background: { type: ColorType.Solid, color: '#0B0E14' },
        textColor: '#9CA3AF',
        attributionLogo: false,
      },
      grid: {
        vertLines: { color: 'rgba(31, 41, 55, 0.55)' },
        horzLines: { color: 'rgba(31, 41, 55, 0.55)' },
      },
      width: container.clientWidth,
      height: container.clientHeight,
      rightPriceScale: { borderColor: '#1F2937', scaleMargins: { top: 0.08, bottom: 0.22 } },
      timeScale: { borderColor: '#1F2937', timeVisible: true, secondsVisible: false },
    });

    const candles = chart.addSeries(CandlestickSeries, {
      upColor: '#00FF66',
      downColor: '#EF4444',
      borderVisible: false,
      wickUpColor: '#00FF66',
      wickDownColor: '#EF4444',
    });
    const volume = chart.addSeries(HistogramSeries, {
      priceFormat: { type: 'volume' },
      priceScaleId: '',
      lastValueVisible: false,
      priceLineVisible: false,
    });
    chart.priceScale('').applyOptions({ scaleMargins: { top: 0.82, bottom: 0 } });

    const chartTime = (timestamp: string): UTCTimestamp =>
      Math.floor(new Date(timestamp).getTime() / 1000) as UTCTimestamp;
    const candleData = data.bars.map((bar) => ({
      time: chartTime(bar.timestamp),
      open: bar.open,
      high: bar.high,
      low: bar.low,
      close: bar.close,
    }));
    candles.setData(candleData);
    volume.setData(data.bars.map((bar) => ({
      time: chartTime(bar.timestamp),
      value: bar.volume,
      color: bar.close >= bar.open ? 'rgba(0, 255, 102, 0.32)' : 'rgba(239, 68, 68, 0.32)',
    })));

    const markers = (data.pivots ?? []).map((pivot) => ({
      time: chartTime(pivot.timestamp),
      position: pivot.type === 'high' ? 'aboveBar' as const : 'belowBar' as const,
      color: pivot.type === 'high' ? '#EF4444' : '#00FF66',
      shape: 'circle' as const,
      text: pivot.type === 'high' ? 'H' : 'L',
    }));
    createSeriesMarkers(candles, markers);

    const lastHigh = [...(data.pivots ?? [])].reverse().find((pivot) => pivot.type === 'high');
    const lastLow = [...(data.pivots ?? [])].reverse().find((pivot) => pivot.type === 'low');
    if (lastHigh) {
      candles.createPriceLine({
        price: lastHigh.value,
        color: 'rgba(239, 68, 68, 0.75)',
        lineWidth: 1,
        lineStyle: LineStyle.Dashed,
        axisLabelVisible: true,
        title: 'R',
      });
    }
    if (lastLow) {
      candles.createPriceLine({
        price: lastLow.value,
        color: 'rgba(0, 255, 102, 0.75)',
        lineWidth: 1,
        lineStyle: LineStyle.Dashed,
        axisLabelVisible: true,
        title: 'S',
      });
    }

    chart.timeScale().fitContent();
    const resizeObserver = new ResizeObserver(([entry]) => {
      chart.applyOptions({
        width: entry.contentRect.width,
        height: entry.contentRect.height,
      });
    });
    resizeObserver.observe(container);

    return () => {
      resizeObserver.disconnect();
      chart.remove();
    };
  }, [data]);

  return (
    <div className="relative w-full h-full flex flex-col">
      <div ref={chartContainerRef} data-testid="price-chart-container" className="h-full min-h-0 w-full" />
    </div>
  );
};
