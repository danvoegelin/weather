import { Component, Input, ApplicationRef } from '@angular/core';
import { Router } from '@angular/router';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { AppMinimize } from '@ionic-native/app-minimize/ngx';
// import { AdMobFree, AdMobFreeBannerConfig } from '@ionic-native/admob-free/ngx';

import { Weather } from '@interfaces/weather.interface';
import { Place, Location } from '@interfaces/places.interface';
import { ApiService } from '@services/api-service/api.service';
import { DataService } from '@services/data-service/data.service';
import { WeatherService } from '@services/weather-service/weather.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {
  private backButtonSubscription;
  public data: Weather;
  public savedTheme: string;
  public savedThemeLabel: string;
  public theme = 'retro';
  public init = false;
  public loading = false;
  public places: Place[];
  public savedLocations: Location[];
  public currentLocation;
  public location;
  public input: string;
  public themeMenuOpen = false;
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
    {
      label: 'Retro',
      mode: 'retro',
      icon: 'radio',
      active: this.theme === 'retro',
    },
  ];
  // private bannerConfig: AdMobFreeBannerConfig = {
  //   isTesting: true,
  //   autoShow: true
  // };

  constructor(
    private router: Router,
    private platform: Platform,
    private statusBar: StatusBar,
    private appMinimize: AppMinimize,
    private splashScreen: SplashScreen,
    private weatherService: WeatherService,
    private dataService: DataService,
    private apiService: ApiService,
    private ref: ApplicationRef,
    // private admobFree: AdMobFree,
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.router.navigate(['splash']).then(() => {
        this.splashScreen.hide();
      });
      this.dataService.getLocationFromStorage().then((locationRetrieved) => {
        this.currentLocation = locationRetrieved;
        if (locationRetrieved) {
          this.getAndSetWeather();
        }
      });
      this.dataService.getSavedLocationsFromStorage().then((savedLocations) => {
        this.savedLocations = savedLocations;
      });
      this.dataService.reload.subscribe(() => {
        this.dataService.getSavedTheme().then((savedTheme) => {
          this.setTheme(savedTheme, false);
        });
      });
      this.statusBar.show();
      this.backButtonSubscription = this.platform.backButton.subscribe(() => {
        this.appMinimize.minimize();
      });

      // this.admobFree.banner.config(this.bannerConfig);
      // this.admobFree.banner.prepare()
      //   .then(() => {
      //     console.log('banner ad is ready')
      //     // banner Ad is ready
      //     // if we set autoShow to false, then we will need to call the show method here
      //   })
      // .catch(e => console.log(e));
    });
  }

  refreshWeather(): Promise<any> {
    this.loading = true;
    return this.dataService.refreshWeather().then(() => {
      this.loading = false;
      return;
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

  public setTheme(theme: string, reload: boolean = true): void {
    theme = theme || this.theme;
    this.savedTheme = theme;
    this.savedThemeLabel = this.getThemeLabel(theme);
    this.dataService.saveTheme(theme);
    this.theme = this.getDynamicTheme(theme);
    this.weatherService.setTheme(this.theme);
    if (reload) {
      this.getAndSetWeather();
    }
  }

  getDynamicTheme(theme: string): string {
    const sunriseTime = this.dataService.getDailyWeather().data[0].sunriseTime;
    const sunsetTime = this.dataService.getDailyWeather().data[0].sunsetTime;
    const currentTime = this.dataService.getCurrentWeather().time;

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
      this.currentLocation = details;
      this.refreshWeather().then(() => {
        this.saveCurrentLocation();
      });
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
      this.currentLocation = details;
      this.refreshWeather();
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
