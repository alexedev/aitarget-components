/* tslint:disable:no-unused-variable */

import { TestBed } from '@angular/core/testing';
import { GeoTargetingRadiusComponent } from './geo-targeting-radius.component';
import { GeoTargetingSelectedService } from '../geo-targeting-selected/geo-targeting-selected.service';
import { TranslateService, TranslatePipe } from 'ng2-translate/ng2-translate';
import { GeoTargetingService } from '../geo-targeting.service';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { AppendToDirective } from '../../shared/directives/append-to.directive';
import { FormsModule } from '@angular/forms';
import { GeoTargetingIdService } from '../geo-targeting.id';

describe('Component: GeoTargetingRadius', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports:      [FormsModule],
      declarations: [GeoTargetingRadiusComponent, TranslatePipe, AppendToDirective],
      providers:    [
        {provide: GeoTargetingSelectedService, useValue: {}},
        {provide: GeoTargetingIdService, useValue: {id$: {getValue () {}}}},
        {provide: GeoTargetingService, useValue: {}},
        {provide: TranslateService, useValue: {}},
      ],
      schemas:      [CUSTOM_ELEMENTS_SCHEMA]
    });
  });

  it('should create an instance', () => {
    let fixture = TestBed.createComponent(GeoTargetingRadiusComponent);
    let app     = fixture.debugElement.componentInstance;
    expect(app)
      .toBeTruthy();
  });
});