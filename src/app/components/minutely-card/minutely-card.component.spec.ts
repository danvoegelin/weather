import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MinutelyCardComponent } from './minutely-card.component';

describe('MinutelyCardComponent', () => {
  let component: MinutelyCardComponent;
  let fixture: ComponentFixture<MinutelyCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MinutelyCardComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MinutelyCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
