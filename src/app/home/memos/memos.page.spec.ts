import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MemosPage } from './memos.page';

describe('MemosPage', () => {
  let component: MemosPage;
  let fixture: ComponentFixture<MemosPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(MemosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
