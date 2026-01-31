import { CommonModule } from '@angular/common';
import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { SideNavigation } from '../side-navigation/side-navigation';
import { Header } from '../header/header';
import { EMIService } from '../services/emi-service';
import { EMI } from '../models/emi.model';
import { NotificationService } from '../services/notification-service';

@Component({
  selector: 'app-reports',
  imports: [CommonModule, SideNavigation, Header, ReactiveFormsModule],
  templateUrl: './reports.html',
  styleUrl: './reports.scss',
})
export class EMIManagement implements OnInit {
  emiForm!: FormGroup;
  selectedEMIid!: string;
  isSidebarOpen = signal(false);
  isEMIModalOpen = false;
  isEditModalOpen = false;

  constructor(private fb: FormBuilder) {
    this.emiForm = this.fb.group({
      name: ['', [Validators.required]],
      date: ['', [Validators.required]],
      amount: ['', [Validators.required]],
    });
  }

  private emiService = inject(EMIService);
  private notificationService = inject(NotificationService);

  emiList = this.emiService.emi;

  currentPage = signal(1);
  pageSize = 5;

  selectedMonth = signal<string>('all');

  filteredEMI = computed(() => {
    const month = this.selectedMonth();
    if (month === 'all') {
      return this.emiList();
    }

    return this.emiList().filter((emi) => {
      const emiMonth = new Date(emi.date).getMonth() + 1;
      return emiMonth === Number(month);
    });
  });

  paginatedEMI = computed(() => {
    const start = (this.currentPage() - 1) * this.pageSize;
    const end = start + this.pageSize;
    return this.filteredEMI().slice(start, end);
  });

  totalPages = computed(() => Math.ceil(this.filteredEMI().length / this.pageSize));

  ngOnInit() {}

  onMonthChange(value: string) {
    this.selectedMonth.set(value);
    this.currentPage.set(1);
  }

  nextPage() {
    if (this.currentPage() < this.totalPages()) {
      this.currentPage.update((p) => p + 1);
    }
  }

  prevPage() {
    if (this.currentPage() > 1) {
      this.currentPage.update((p) => p - 1);
    }
  }

  goToPage(page: number) {
    this.currentPage.set(page);
  }

  openEMIModal() {
    this.isEMIModalOpen = true;
    document.body.style.overflow = 'hidden';
  }

  closeEMIModal() {
    this.isEMIModalOpen = false;
    this.isEditModalOpen = false;
    this.selectedEMIid = '';
    this.emiForm.reset();
    document.body.style.overflow = 'auto';
  }

  openEditModal(emi: EMI) {
    this.selectedEMIid = emi._id;

    this.isEMIModalOpen = false;
    this.isEditModalOpen = true;

    this.emiForm.patchValue({
      name: emi.name,
      date: emi.date,
      amount: emi.amount,
    });

    document.body.style.overflow = 'hidden';
  }

  updateEMI() {
    if (!this.selectedEMIid || this.emiForm.invalid) return;

    this.emiService.updateEMI(this.selectedEMIid, this.emiForm.value).subscribe({
      next: () => {
        this.notificationService.add('EMI updated successfully 💳');
        this.closeEMIModal();
        this.emiForm.reset();
      },
      error: (err) => {
        this.notificationService.add('Failed to update EMI ❌ ');
        console.error(err);
      },
    });
  }

  addEMI() {
    if (this.emiForm.invalid) return;

    this.emiService.createEMI(this.emiForm.value).subscribe({
      next: () => {
        this.notificationService.add('EMI added successfully 💳');
        this.emiForm.reset();
        this.closeEMIModal();
      },

      error: (err) => {
        this.notificationService.add('Failed to add EMI ❌');
        console.log(err);
      },
    });
  }

  deleteEMI(id: string) {
    if (!confirm('Are you sure?')) return;
    this.emiService.deleteEMI(id).subscribe({
      next: () => {
        this.notificationService.add('EMI Deleted 🗑️ ');
        this.emiForm.reset();
        this.closeEMIModal();
      },

      error: (err) => {
        this.notificationService.add('Failed to delete EMI ❌');
        console.log(err);
      },
    });
  }

  getEMIstatus(date: string | Date) {
    const today = new Date();
    const emiDate = new Date(date);

    today.setHours(0, 0, 0, 0);
    emiDate.setHours(0, 0, 0, 0);

    const diffDays = Math.ceil((emiDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return { text: 'OverDue', class: 'bg-red-100 text-red-700' };
    }
    if (diffDays <= 5) {
      return { text: 'Due Soon', class: 'bg-yellow-100 text-yellow-700' };
    }

    if (diffDays <= 25) {
      return { text: 'Upcoming', class: 'bg-green-100 text-green-700' };
    }

    return null;
  }
}
