import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InfoAutorPage } from './info-autor.page';

describe('InfoAutorPage', () => {
  let component: InfoAutorPage;
  let fixture: ComponentFixture<InfoAutorPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(InfoAutorPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
