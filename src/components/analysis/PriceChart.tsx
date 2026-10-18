import React, { useEffect, useRef } from 'react';
import { createChart, ColorType } from 'lightweight-charts';
import type { IChartApi, ISeriesApi } from 'lightweight-charts';
import type { AnalysisResponse } from '../../types/analysis';

interface PriceChartProps {
  data: AnalysisResponse;
}

export const PriceChart: React.FC<PriceChartProps> = ({ data }) => {
  if (!data) return null;

  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const seriesRef = useRef<ISeriesApi<"Area"> | null>(null);

  useEffect(() => {
    let chart: IChartApi | null = null;
    let series: ISeriesApi<"Area"> | null = null;
    let resizeObserver: ResizeObserver | null = null;

    const initChart = () => {
      if (!chartContainerRef.current) return;

      const width = chartContainerRef.current.offsetWidth;
      const height = chartContainerRef.current.offsetHeight;
      
      if (width === 0 || height === 0) return;

      if (chart) {
        chart.applyOptions({ width });
        return;
      }

      try {
        chart = createChart(chartContainerRef.current, {
          layout: {
            background: { type: ColorType.Solid, color: 'transparent' },
            textColor: '#94a3b8',
          },
          grid: {
            vertLines: { color: 'rgba(30, 41, 59, 0.5)' },
            horzLines: { color: 'rgba(30, 41, 59, 0.5)' },
          },
          width: width,
          height: height || 400,
          timeScale: {
            borderColor: 'rgba(30, 41, 59, 1)',
            timeVisible: true,
          },
        });

        if (typeof chart.addAreaSeries === 'function') {
          series = chart.addAreaSeries({
            lineColor: '#3b82f6',
            topColor: 'rgba(59, 130, 246, 0.4)',
            bottomColor: 'rgba(59, 130, 246, 0.0)',
            lineWidth: 2,
          });
        } else if (typeof chart.addSeries === 'function') {
          // @ts-ignore
          series = chart.addSeries('Area', {
            lineColor: '#3b82f6',
            topColor: 'rgba(59, 130, 246, 0.4)',
            bottomColor: 'rgba(59, 130, 246, 0.0)',
            lineWidth: 2,
          });
        } else {
          throw new Error('Chart API does not support addAreaSeries or addSeries');
        }

        const chartData = data.pivots
          .map(p => ({
            time: new Date(p.timestamp).getTime() / 1000 as any,
            value: p.value,
          }))
          .sort((a, b) => a.time - b.time);

        series.setData(chartData);

        const markers = data.pivots.map(p => ({
          time: new Date(p.timestamp).getTime() / 1000 as any,
          position: p.type === 'high' ? 'aboveBar' : 'belowBar',
          color: p.type === 'high' ? '#ef4444' : '#22c55e',
          shape: 'circle',
          text: p.type === 'high' ? 'H' : 'L',
        }));
        
        series.setMarkers(markers);
        chart.timeScale().fitContent();

        chartRef.current = chart;
        seriesRef.current = series;
      } catch (e) {
        console.error('Failed to initialize PriceChart:', e);
      }
    };

    resizeObserver = new ResizeObserver(() => {
      initChart();
    });

    if (chartContainerRef.current) {
      resizeObserver.observe(chartContainerRef.current);
    }

    return () => {
      if (resizeObserver) resizeObserver.disconnect();
      if (chart) chart.remove();
    };
  }, [data]);

  return (
    <div className="relative w-full h-full flex flex-col">
      <div ref={chartContainerRef} data-testid="price-chart-container" className="flex-1 w-full" />
    </div>
  );
};
