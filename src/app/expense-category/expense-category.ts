import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, inject, OnDestroy } from '@angular/core';
import { Chart, DoughnutController, ArcElement, Tooltip, Legend } from 'chart.js';
import { CategoryService } from '../services/category-service';
import { ExpenseService } from '../services/expenses-service';
import { Subscription } from 'rxjs';
import { ExpenseModal } from '../models/expense.model';

Chart.register(DoughnutController, ArcElement, Tooltip, Legend);
@Component({
  selector: 'app-expense-category',
  imports: [CommonModule],
  templateUrl: './expense-category.html',
  styleUrl: './expense-category.scss',
})
export class ExpenseCategory implements AfterViewInit, OnDestroy {
  private expenseService = inject(ExpenseService);

  private chart!: Chart;
  private sub = new Subscription();

  labels: string[] = [];
  data: number[] = [];

  colors: string[] = [
    '#2563eb', // blue-600
    '#fb923c', // orange-400
    '#93c5fd', // blue-300
    '#f472b6', // pink-400
    '#4ADE80', // green-400
    '#a855f7', // purple-500
    '#eab308', // yellow-500
    '#14b8a6', // teal-500
    '#ef4444', // red-500
    '#0ea5e9', // sky-500
    '#f97316', // orange-500
    '#6366f1', // indigo-500
    '#84cc16', // lime-500
    '#64748b', // slate-500
  ];

  chartId = `expense-chart-${Math.random().toString(36).substring(2, 9)}`;

  ngAfterViewInit(): void {
    this.loadChartData();
  }

  loadChartData() {
    this.sub.add(
      this.expenseService.getExpenses().subscribe((expenses: ExpenseModal[]) => {
        const categoryCountMap: Record<string, number> = {};

        expenses.forEach((exp) => {
          const category = exp.category?.trim();
          if (!category) return;

          categoryCountMap[category] = (categoryCountMap[category] || 0) + 1;
        });

        this.labels = Object.keys(categoryCountMap);
        this.data = Object.values(categoryCountMap);

        if (!this.data.some((v) => v > 0)) {
          console.warn('No Expense data for chart');
          return;
        }

        this.renderChart();
      }),
    );
  }

  renderChart() {
    const canvas = document.getElementById(this.chartId) as HTMLCanvasElement;

    if (this.chart) {
      this.chart.destroy();
    }

    this.chart = new Chart(canvas, {
      type: 'doughnut',
      data: {
        labels: this.labels,
        datasets: [
          {
            data: this.data,
            backgroundColor: this.colors.slice(0, this.labels.length),
            borderWidth: 0,
            hoverOffset: 4,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '70%',
        plugins: {
          legend: {
            display: false,
          },
        },
      },
    });
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
    this.chart?.destroy();
  }
}
