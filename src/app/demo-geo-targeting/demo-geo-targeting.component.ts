import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { targetingSpecInitial } from '../../lib/targeting/targeting-spec.interface';

@Component({
  selector:        'app-demo-geo-targeting',
  templateUrl:     './demo-geo-targeting.component.html',
  styleUrls:       ['demo-geo-targeting.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DemoGeoTargetingComponent implements OnInit {

  hideGeoTargeting = false;
  isSpecVisible    = false;
  lang             = 'en_US';

  spec = targetingSpecInitial;

  showSpec (isVisible, event?) {
    if (event) {
      event.stopPropagation();
    }

    this.isSpecVisible = isVisible;

    this.changeDetectorRef.markForCheck();
    this.changeDetectorRef.detectChanges();
  }

  onChange = (spec) => {
    this.spec = spec;
  };

  constructor (private changeDetectorRef: ChangeDetectorRef) { }

  ngOnInit () {
  }

}
