import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpendingTrend } from './spending-trend';

describe('SpendingTrend', () => {
  let component: SpendingTrend;
  let fixture: ComponentFixture<SpendingTrend>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SpendingTrend]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SpendingTrend);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
