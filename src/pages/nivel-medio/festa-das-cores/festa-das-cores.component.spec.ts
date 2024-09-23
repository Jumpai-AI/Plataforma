import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FestaDasCoresComponent } from './festa-das-cores.component';

describe('FestaDasCoresComponent', () => {
  let component: FestaDasCoresComponent;
  let fixture: ComponentFixture<FestaDasCoresComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FestaDasCoresComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FestaDasCoresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
