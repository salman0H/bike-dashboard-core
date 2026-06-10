// src/components/BatteryHealthChart.tsx
import { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

export function BatteryHealthChart() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartRef = useRef<Chart | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    if (chartRef.current) {
      chartRef.current.destroy();
    }

    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;

    chartRef.current = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['<20%', '20-40%', '40-60%', '60-80%', '80-100%'],
        datasets: [{
          data: [23, 45, 89, 234, 856],
          backgroundColor: [
            'rgba(239,68,68,0.8)',
            'rgba(245,158,11,0.8)',
            'rgba(234,179,8,0.8)',
            'rgba(34,197,94,0.8)',
            'rgba(16,185,129,0.8)'
          ],
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
              label: (context) => `${context.raw} دوچرخه`
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
            grid: { color: 'rgba(255,255,255,0.05)', drawBorder: false },
            ticks: {
              color: '#a0a0ab',
              font: { size: 10, family: 'Vazirmatn' },
              stepSize: 200,
              callback: (value) => `${value}`
            },
            title: {
              display: true,
              text: 'تعداد دوچرخه',
              color: '#a0a0ab',
              font: { size: 10, family: 'Vazirmatn' }
            }
          }
        },
        layout: {
          padding: {
            top: 10,
            bottom: 5,
            left: 5,
            right: 5
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