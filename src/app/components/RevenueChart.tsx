// src/components/RevenueChart.tsx
import { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

export function RevenueChart() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartRef = useRef<Chart | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    if (chartRef.current) {
      chartRef.current.destroy();
    }

    chartRef.current = new Chart(canvasRef.current, {
      type: 'bar',
      data: {
        labels: ['شنبه', 'یکشنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنجشنبه', 'جمعه'],
        datasets: [{
          data: [3200000, 4800000, 3900000, 5200000, 4600000, 6100000, 5400000],
          backgroundColor: 'rgba(182,102,210,0.7)',
          borderRadius: 8,
          borderSkipped: false,
          barPercentage: 0.7,
          categoryPercentage: 0.8,
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: '#16161d',
            titleColor: '#e5e5e7',
            bodyColor: '#a0a0ab',
            borderColor: 'rgba(182,102,210,0.3)',
            borderWidth: 1,
            callbacks: {
              label: (context) => `${(context.raw as number).toLocaleString()} تومان`
            }
          }
        },
        scales: {
          x: {
            grid: { display: false },
            ticks: {
              color: '#a0a0ab',
              font: { size: 11, family: 'Vazirmatn', weight: '500' }
            }
          },
          y: {
            grid: { color: 'rgba(255,255,255,0.05)' },
            ticks: {
              color: '#a0a0ab',
              font: { size: 10 },
              callback: (value) => `${(Number(value) / 1000000).toFixed(1)}M`
            }
          }
        }
      }
    });

    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
      }
    };
  }, []);

  return <canvas ref={canvasRef} style={{ width: '100%', height: '100%' }} />;
}