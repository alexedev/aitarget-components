/* tslint:disable: max-line-length */
import { Routes } from '@angular/router';
import { DashboardComponent } from './features/dashboard.component';
import { NotFound404Component } from './not-found404.component';

export const routes: Routes = [
  {path: '', component: DashboardComponent, pathMatch: 'full'},
  {path: 'geo-targeting', loadChildren: './demo-geo-targeting/index#DemoGeoTargetingModule'},
  {path: 'detailed-targeting', loadChildren: './demo-detailed-targeting/index#DemoDetailedTargetingModule'},
  {path: '**', component: NotFound404Component}
];