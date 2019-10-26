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

  private init: boolean = false;
  public loading: boolean = true;
  public disableRefresh: boolean = false;
  public minutelyCardDefault: boolean = true;
  public minutelyCardVisible: boolean = false;
  public noMinutelyData: boolean = false;
  public refresherClass: string = '';
  public loadAnimation: string = '';
  public slideOpts = {
    watchOverflow: false,
    initialSlide: 1,
    resistanceRatio: 0
  };

  ngOnInit() {
    this.init = true;
    this.loading = true;
    this.dataService.reload.subscribe(() => {
      this.minutelyCardDefault = true;
      this.minutelyCardVisible = false;
      this.renderer.removeClass(this.el.nativeElement, 'ion-page-invisible');
      this.noMinutelyData = !this.dataService.getMinutelyWeather();
      this.loading = false;
    });
    this.dataService.refreshing.subscribe((refreshing: boolean) => {
      this.setRefresherClass(refreshing);
      this.setLoadAnimation(refreshing);
    })
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
