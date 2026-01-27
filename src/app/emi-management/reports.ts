import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { SideNavigation } from '../side-navigation/side-navigation';
import { Header } from '../header/header';
import { EMIService } from '../services/emi-service';
import { EMI } from '../models/emi.model';

@Component({
  selector: 'app-reports',
  imports: [CommonModule,  SideNavigation, Header, ReactiveFormsModule],
  templateUrl: './reports.html',
  styleUrl: './reports.scss',
})
export class Reports implements OnInit {
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

  emiList = this.emiService.emi;

  ngOnInit() {}

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
        this.closeEMIModal();
        this.emiForm.reset();
      },
      error: (err) => console.error(err),
    });
  }

  addEMI() {
    if (this.emiForm.invalid) return;

    this.emiService.createEMI(this.emiForm.value).subscribe({
      next: () => {
        this.emiForm.reset();
        this.closeEMIModal();
      },

      error: (err) => console.log(err),
    });
  }

  deleteEMI(id: string) {
    if (!confirm('Are you sure?')) return;
    this.emiService.deleteEMI(id).subscribe();
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
