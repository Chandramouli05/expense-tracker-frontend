import { Injectable } from '@angular/core';
import { EMIService } from '../services/emi-service';
import { forkJoin, map } from 'rxjs';
import { Resolve } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class EmiResolver implements Resolve<boolean> {
  constructor(private emiService: EMIService) {}

  resolve() {
    return forkJoin([this.emiService.getEMI()]).pipe(map(() => true));
  }
}
