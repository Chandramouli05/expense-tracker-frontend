import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SavingsAverage } from './savings-average';

describe('SavingsAverage', () => {
  let component: SavingsAverage;
  let fixture: ComponentFixture<SavingsAverage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SavingsAverage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SavingsAverage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
