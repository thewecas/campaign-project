import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SnakbarComponent } from './snak-bar.component';

describe('SnakbarComponent', () => {
  let component: SnakbarComponent;
  let fixture: ComponentFixture<SnakbarComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SnakbarComponent]
    });
    fixture = TestBed.createComponent(SnakbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
