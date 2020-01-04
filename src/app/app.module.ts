import { NgModule } from '@angular/core';
import { BrowserModule, HAMMER_GESTURE_CONFIG } from '@angular/platform-browser';
import { RouteReuseStrategy, RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { IonicStorageModule } from '@ionic/storage';
import { IonicModule, IonicRouteStrategy, MenuController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { AppMinimize } from '@ionic-native/app-minimize/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
// import { AdMobFree, AdMobFreeBannerConfig } from '@ionic-native/admob-free/ngx';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { ApiService } from '@services/api-service/api.service';
import { DataService } from '@services/data-service/data.service';
import { WeatherService } from '@services/weather-service/weather.service';
import { RouteGuardService } from '@services/route-guard-service/route-guard.service';
import { CustomGestureConfig } from '@services/hammer-config';
import { MainPageModule } from '@pages/main/main.module';
import { SplashPageModule } from '@pages/splash/splash.module';

@NgModule({
  declarations: [
    AppComponent,
  ],
  entryComponents: [
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot([]),
    IonicModule.forRoot(),
    IonicStorageModule.forRoot(),
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    MainPageModule,
    SplashPageModule,
  ],
  providers: [
    MenuController,
    StatusBar,
    AppMinimize,
    SplashScreen,
    ApiService,
    DataService,
    WeatherService,
    RouteGuardService,
    // AdMobFree,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    { provide: HAMMER_GESTURE_CONFIG, useClass: CustomGestureConfig }
  ],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule {}
