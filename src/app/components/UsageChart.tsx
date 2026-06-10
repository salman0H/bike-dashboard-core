// src/components/UsageChart.tsx
import { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

export function UsageChart() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartRef = useRef<Chart | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    if (chartRef.current) {
      chartRef.current.destroy();
    }

    chartRef.current = new Chart(canvasRef.current, {
      type: 'line',
      data: {
        labels: ['شنبه', 'یکشنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنجشنبه', 'جمعه'],
        datasets: [{
          data: [142, 189, 163, 214, 198, 247, 221],
          borderColor: '#10b981',
          backgroundColor: 'rgba(16,185,129,0.1)',
          fill: true,
          tension: 0.4,
          pointRadius: 4,
          pointHoverRadius: 6,
          pointBackgroundColor: '#10b981',
          pointBorderColor: '#ffffff',
          pointBorderWidth: 2,
          borderWidth: 2.5,
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
            borderColor: 'rgba(16,185,129,0.3)',
            borderWidth: 1,
            callbacks: {
              label: (context) => `${context.raw} سفر`
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
              stepSize: 50
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