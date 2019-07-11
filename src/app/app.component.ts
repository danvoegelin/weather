import { Component, Input, ApplicationRef } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { Place, Location } from '@interfaces/places.interface';
import { ApiService } from '@services/api-service/api.service';
import { DataService } from '@services/data-service/data.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {

  public theme: string = 'light';
  @Input() darkChecked: boolean = this.theme === 'dark';
  public init: boolean = false;
  public loading: boolean = false;
  public places: Place[];
  public savedLocations: any;
  public currentLocation: any;
  public location;
  public input: string;

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private apiService: ApiService,
    private dataService: DataService,
    private ref: ApplicationRef,
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.dataService.getLocationFromStorage().then((locationRetrieved) => {
        this.currentLocation = locationRetrieved;
        if (locationRetrieved) {
          this.getAndSetWeather();
        }
      });
      this.dataService.getSavedLocationsFromStorage().then((savedLocations) => {
        this.savedLocations = savedLocations;
      });
      this.dataService.getSavedTheme().then((savedTheme) => {
        this.theme = savedTheme;
        this.themeChecked();
      })
      this.statusBar.show();
      setTimeout(this.hideSplash().bind(this), 500);
    });
  }

  hideSplash() {
    return function() {
      this.splashScreen.hide();
    }
  }

  refreshWeather() {
    this.loading = true;
    this.dataService.getWeather().then(() => {
      this.loading = false;
    });
  }

  private getAndSetWeather() {
    this.dataService.getWeather().then(() => {
      this.init = true;
      this.ref.tick();
    });
  }

  public themeChecked() {
    this.darkChecked = this.theme === 'dark';
  }

  public setTheme(darkWasChecked: boolean) {
    let newTheme = this.theme === 'dark' ? 'light' : 'dark';
    if (this.changeTheme(darkWasChecked)) {
      this.dataService.saveTheme(newTheme);
      this.theme = newTheme;
    }
  }

  private changeTheme(darkWasChecked: boolean) {
    return (!darkWasChecked && this.theme === 'dark') || (darkWasChecked && (this.theme === 'light'))
  }

  getPlaces(event) {
    this.input = event.target;
    this.apiService.getPlaces(event.target.value).subscribe((data) => {
      this.places = data.predictions;
    });
  }

  selectPlace(place: Place) {
    this.clearResults();
    this.dataService.setLocation(place).then((details) => {
        this.dataService.getWeather(); // emit refresh event instead
        this.currentLocation = details;
    });
  }

  clearResults() {
    this.input = null;
    this.places = [];
    this.location = '';
    this.apiService.endPlacesSession();
  }

  saveCurrentLocation() {
    if (this.currentLocation) {
      this.dataService.saveLocationToStorage().then(() => {
        this.dataService.getSavedLocationsFromStorage().then((savedLocations) => {
          this.savedLocations = savedLocations;
        });
      });
    }
  }

  selectSavedLocation(location: Location) {
    this.dataService.setSavedLocation(location).then((details) => {
      this.dataService.getWeather(); // emit refresh event instead
      this.currentLocation = details;
    });
  }

  removeSavedLocation(location: Location) {
    this.dataService.removeSavedLocationFromStorage(location).then(() => {
      this.dataService.getSavedLocationsFromStorage().then((savedLocations) => {
        this.savedLocations = savedLocations;
      });
    });
  }
}
