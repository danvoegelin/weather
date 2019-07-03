import { Component, OnInit, Output, OnChanges, EventEmitter } from '@angular/core';
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
    private dataService: DataService,
  ) {}

  public slideOpts = {
    initialSlide: 0,
    speed: 50,
    watchOverflow: true,
    resistanceRatio: 0
  };
  private init: boolean = false;
  public loading: boolean = true;
  public disableRefresh: boolean = false;
  public minutelyCardVisible: boolean = false;

  ngOnInit() {
    this.init = true;
    this.loading = true;
    this.dataService.reload.subscribe(() => {
      this.ngOnChanges();
    })
  }

  ngOnChanges() {
    this.minutelyCardVisible = false;
    this.loading = false;
  }

  refreshData() {
    this.minutelyCardVisible = false;
    this.loading = true;
    this.dataService.getWeather().then(() => {
      this.loading = false;
    });
  }

  refresherClass() {
    return this.dataService.loading && this.init ? 'refreshing' : '';
  }

  loadAnimation() {
    return this.dataService.loading ? '' : 'fade-in';
  }

  round(num: number) {
    return Math.round(num);
  }

  toggleMinuteCard(setToValue: boolean = !this.minutelyCardVisible) {
    this.minutelyCardVisible = setToValue;
  }
}
