import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { DataService } from '@services/data-service/data.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {

  public init: boolean = false;
  public loading: boolean = false;

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private dataService: DataService,
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.dataService.getLocationFromStorage().then(() => {
        this.getAndSetWeather();
        this.statusBar.show();
        setTimeout(this.hideSplash().bind(this), 1500);
      });
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
    });
  }
}
