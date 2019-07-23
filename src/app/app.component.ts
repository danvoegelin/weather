import { Component, Input, ApplicationRef } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { Weather } from '@interfaces/weather.interface';
import { Place, Location } from '@interfaces/places.interface';
import { ApiService } from '@services/api-service/api.service';
import { DataService } from '@services/data-service/data.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {

  public data: Weather;
  public savedTheme: string;
  public savedThemeLabel: string;
  public theme: string = 'light';
  public init: boolean = false;
  public loading: boolean = false;
  public places: Place[];
  public savedLocations: Location[];
  public currentLocation;
  public location;
  public input: string;
  public themeMenuOpen: boolean = false;
  public themeModes: any[] = [
    {
      label: 'Dark',
      mode: 'dark',
      icon: 'moon',
      active: this.theme === 'dark',
    },
    {
      label: 'Light',
      mode: 'light',
      icon: 'sunny',
      active: this.theme === 'light',
    },
    {
      label: 'Dynamic',
      mode: 'dynamic',
      icon: 'clock',
      active: this.theme === 'dynamic',
    },
  ];

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
          this.getAndSetWeather().then(() => {
            this.dataService.getSavedTheme().then((savedTheme) => {
              this.setTheme(savedTheme);
            });
          });
        }
      });
      this.dataService.getSavedLocationsFromStorage().then((savedLocations) => {
        this.savedLocations = savedLocations;
      });
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

  private getAndSetWeather(): Promise<any> {
    return new Promise((resolve) => {
      this.dataService.getWeather().then((data) => {
        this.data = data;
        this.init = true;
        this.ref.tick();
        resolve();
      });
    });
  }

  public toggleThemeMenu() {
    this.themeMenuOpen = !this.themeMenuOpen;
  }

  public setTheme(theme: string): void {
    this.savedTheme = theme;
    this.savedThemeLabel = this.getThemeLabel(theme);
    this.dataService.saveTheme(theme);
    this.theme = this.getDynamicTheme(theme);
  }

  getDynamicTheme(theme: string): string {
    let sunriseTime = this.dataService.getDailyWeather().data[0].sunriseTime;
    let sunsetTime = this.dataService.getDailyWeather().data[0].sunsetTime;
    let currentTime = this.dataService.getCurrentWeather().time;

    if (theme === 'dynamic') {
      theme = sunriseTime < currentTime && currentTime < sunsetTime ? 'light' : 'dark';
    }
    return theme;
  }

  getThemeLabel(theme: string) {
    let themeLabel: string = theme;
    this.themeModes.forEach((themeMode) => {
      if (themeMode.mode === theme) {
        themeLabel = themeMode.label;
      }
    });
    return themeLabel;
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
