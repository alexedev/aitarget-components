import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

let nextId = 0;

@Injectable()
export class GeoIdService {

  _prefix = 'geo';
  id$     = new BehaviorSubject(`${this._prefix}-${nextId++}`);

}
