import { Component, OnInit, Output, EventEmitter, ElementRef, Renderer2 } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { DataService } from '@services/data-service/data.service';
import { Weather, WeatherCurrent, WeatherMinutely, WeatherHourly, WeatherDaily } from '@interfaces/weather.interface';

@Component({
  selector: 'app-main',
  templateUrl: 'main.page.html',
  styleUrls: ['main.page.scss']
})
export class MainPage implements OnInit {

  constructor(
    private el: ElementRef,
    public dataService: DataService,
    public renderer: Renderer2,
  ) {}

  public init = false;
  public loading = true;
  public hideSplash = false;
  public locationSet = false;
  public disableRefresh = false;
  public minutelyCardDefault = true;
  public minutelyCardVisible = false;
  public noMinutelyData = false;
  public refresherClass = '';
  public loadAnimation = '';
  public slideOpts = {
    watchOverflow: false,
    initialSlide: 0,
    resistanceRatio: 0
  };

  ngOnInit() {
    if (!this.init) {
      this.init = true;
      if (this.dataService.currentLocation) {
        this.dataService.callReload();
        this.hideSplash = true;
        this.locationSet = true;
      }
    }
    this.hideSplash = this.dataService.hideMainSplash;
    this.dataService.hideSplash.subscribe((hide) => {
      this.hideSplash = hide;
    });
    this.dataService.reload.subscribe(() => {
      this.locationSet = true;
      this.loading = true;
      this.minutelyCardDefault = true;
      this.minutelyCardVisible = false;
      this.renderer.removeClass(this.el.nativeElement, 'ion-page-invisible');
      this.noMinutelyData = !this.dataService.getMinutelyWeather();
      this.loading = false;
    });
    this.dataService.refreshing.subscribe((refreshing: boolean) => {
      this.setRefresherClass(refreshing);
      this.setLoadAnimation(refreshing);
    });
  }

  public refreshData() {
    this.loading = true;
    this.dataService.refreshWeather().then(() => {
      this.loading = false;
    });
  }

  setRefresherClass(refreshing: boolean) {
    this.refresherClass = refreshing && this.init ? 'refreshing' : '';
  }

  setLoadAnimation(loading: boolean) {
    this.loadAnimation = loading ? '' : 'fade-in';
  }

  toggleMinuteCard(setToValue: boolean = !this.minutelyCardVisible) {
    this.minutelyCardDefault = false;
    this.minutelyCardVisible = setToValue;
  }
}
