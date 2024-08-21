import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PhotoTestComponent } from './photo-test.component';

describe('PhotoTestComponent', () => {
  let component: PhotoTestComponent;
  let fixture: ComponentFixture<PhotoTestComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PhotoTestComponent]
    });
    fixture = TestBed.createComponent(PhotoTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
