import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  ViewChild,
  inject,
  effect,
  signal,
} from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { SavingsService } from '../services/savings-service';
import { Savings } from '../models/savings.model';

Chart.register(...registerables);

@Component({
  selector: 'app-savings-average',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './savings-average.html',
  styleUrl: './savings-average.scss',
})
export class SavingsAverage implements AfterViewInit {
  private savingsService = inject(SavingsService);
  private chart?: Chart;

  @ViewChild('chartCanvas') canvas!: ElementRef<HTMLCanvasElement>;

  private viewReady = signal(false);

  constructor() {
    effect(() => {
      if (!this.viewReady()) return;

      const savings = this.savingsService.savings();
      if (!savings.length) return;

      const { labels, data } = this.groupByMonth(savings);

      if (!this.chart) {
        this.createChart(labels, data);
      } else {
        this.chart.data.labels = labels;
        this.chart.data.datasets[0].data = data;
        this.chart.update();
      }
    });
  }

  ngAfterViewInit(): void {
    this.viewReady.set(true);
    this.savingsService.loadSavings().subscribe();
  }

  private groupByMonth(savings: Savings[]) {
    const map = new Map<string, number>();

    savings.forEach((s) => {
      const d = new Date(s.date);
      const key = `${d.getFullYear()}-${d.getMonth()}`;
      map.set(key, (map.get(key) || 0) + Number(s.amount));
    });

    const sorted = [...map.entries()].sort();

    return {
      labels: sorted.map(([k]) => {
        const [y, m] = k.split('-');
        return new Date(+y, +m).toLocaleString('default', {
          month: 'short',
          year: 'numeric',
        });
      }),
      data: sorted.map(([, v]) => v),
    };
  }

  private createChart(labels: string[], data: number[]) {
    this.chart = new Chart(this.canvas.nativeElement, {
      type: 'line',
      data: {
        labels,
        datasets: [
          {
            label: 'Savings Average',
            data,
            tension: 0.4,
            borderWidth: 2,

            borderColor: '#ec4899', // line color (indigo)
            backgroundColor: 'rgba(236,72,153,0.15)', // area fill
            pointBackgroundColor: '#ec4899',
            pointBorderColor: '#ffffff',
            pointRadius: 4,
            pointHoverRadius: 6,
            fill: true,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: { enabled: true },
        },
        scales: {
          x: { grid: { display: false } },
          y: { grid: { display: false }, beginAtZero: false },
        },
      },
    });
  }
}
