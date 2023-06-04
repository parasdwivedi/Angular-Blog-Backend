import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AabbComponent } from './aabb.component';

describe('AabbComponent', () => {
  let component: AabbComponent;
  let fixture: ComponentFixture<AabbComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AabbComponent]
    });
    fixture = TestBed.createComponent(AabbComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
