import { NgModule } from '@angular/core';
import { BrowserModule, HAMMER_GESTURE_CONFIG } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { ApiService } from '@services/api-service/api.service';
import { DataService } from '@services/data-service/data.service';
import { WeatherService } from '@services/weather-service/weather.service';
import { CustomGestureConfig } from '@services/hammer-config'

import { MainPageModule } from '@pages/main-page/main.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  entryComponents: [],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    HttpClientModule,
    MainPageModule
  ],
  providers: [
    StatusBar,
    SplashScreen,
    ApiService,
    DataService,
    WeatherService,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    { provide: HAMMER_GESTURE_CONFIG, useClass: CustomGestureConfig }
  ],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule {}
