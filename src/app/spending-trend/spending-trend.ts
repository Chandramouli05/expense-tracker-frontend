import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  inject,
  OnDestroy,
  ViewChild,
  effect,
} from '@angular/core';
import {
  BarController,
  BarElement,
  CategoryScale,
  Chart,
  Legend,
  LinearScale,
  Tooltip,
} from 'chart.js';
import { ExpenseService } from '../services/expenses-service';
import { ExpenseModal } from '../models/expense.model';

Chart.register(
  BarController,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
);

@Component({
  selector: 'app-spending-trend',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './spending-trend.html',
  styleUrls: ['./spending-trend.scss'],
})
export class SpendingTrend implements AfterViewInit, OnDestroy {
  private expenseService = inject(ExpenseService);

  @ViewChild('barChart') barChart!: ElementRef<HTMLCanvasElement>;
  private chart!: Chart;

  labels: string[] = [];
  data: number[] = [];

  colors = [
    '#4ade80',
    '#93c5fd',
    '#3b82f6',
    '#fb923c',
    '#c084fc',
    '#fde047',
    '#ec4899',
  ];

  // ✅ EFFECT CREATED IN INJECTION CONTEXT (FIELD)
  private expensesEffect = effect(() => {
    const expenses = this.expenseService.expenses();

    if (!this.chart || expenses.length === 0) return;

    this.calculateWeeklyData(expenses);

    this.chart.data.labels = this.labels;
    this.chart.data.datasets[0].data = this.data;
    this.chart.update();
  });

  ngAfterViewInit(): void {
    this.chart = new Chart(this.barChart.nativeElement, {
      type: 'bar',
      data: {
        labels: [],
        datasets: [
          {
            data: [],
            backgroundColor: this.colors,
            borderRadius: 4,
            barPercentage: 0.7,
            categoryPercentage: 0.8,
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
          y: { grid: { display: false }, ticks: { display: false } },
        },
      },
    });

    // 🔹 trigger API once
    this.expenseService.loadExpense().subscribe();
  }

  private calculateWeeklyData(expenses: ExpenseModal[]) {
    const today = new Date();
    const labels: string[] = [];
    const totals: number[] = [];

    for (let i = 6; i >= 0; i--) {
      const day = new Date();
      day.setDate(today.getDate() - i);

      labels.push(day.toLocaleDateString('en-US', { weekday: 'short' }));

      const total = expenses
        .filter((exp) => {
          const d = new Date(exp.date);
          return (
            d.getFullYear() === day.getFullYear() &&
            d.getMonth() === day.getMonth() &&
            d.getDate() === day.getDate()
          );
        })
        .reduce((sum, exp) => sum + Number(exp.amount), 0);

      totals.push(total);
    }

    this.labels = labels;
    this.data = totals;
  }

  ngOnDestroy(): void {
    this.expensesEffect.destroy();
    this.chart?.destroy();
  }
}
