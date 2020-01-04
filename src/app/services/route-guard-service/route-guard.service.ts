import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { DataService } from '@services/data-service/data.service';

@Injectable({
  providedIn: 'root'
})
export class RouteGuardService {

  constructor(
    private router: Router,
    private dataService: DataService,
  ) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (this.isDataLoaded() || this.noLocationSaved()) {
      return true;
    } else {
      return false;
    }
  }

  isDataLoaded() {
    return !!this.dataService.data;
  }

  noLocationSaved() {
    return !this.dataService.currentLocation;
  }
}
