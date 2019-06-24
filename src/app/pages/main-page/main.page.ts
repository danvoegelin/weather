import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { ApiService } from '@services/api-service/api.service';
import { DataService } from '@services/data-service/data.service';
import { Weather, WeatherCurrent, WeatherMinutely, WeatherHourly, WeatherDaily } from '@interfaces/weather.interface';

@Component({
  selector: 'app-main',
  templateUrl: 'main.page.html',
  styleUrls: ['main.page.scss']
})
export class MainPage implements OnInit {

  constructor(
    private apiService: ApiService,
    private dataService: DataService,
  ) {}

  public slideOpts = {
    initialSlide: 0,
    speed: 250
  };
  private init: boolean = false;
  public disableRefresh: boolean = false;
  public loading: boolean = true;
  public minutelyCardVisible: boolean = false;
  public lat: string = '42.358223';
  public long: string = '-71.071096';

  ngOnInit() {
    this.getAndSetWeather();
  }

  private getAndSetWeather() {
    this.loading = true;
    this.minutelyCardVisible = false;
    this.apiService.getWeather(this.lat, this.long).subscribe((data) => {
      this.dataService.setData(data);
      console.log(data.currently.summary, data.currently.temperature, this.minutelyCardVisible);
      this.loading = false;
      this.init = true;
    });
  }

  refreshData() {
    this.getAndSetWeather();
  }

  refresherClass() {
    return this.loading && this.init ? 'refreshing' : '';
  }

  loadAnimation() {
    return this.loading ? '' : 'fade-in';
  }

  round(num: number) {
    return Math.round(num);
  }

  toggleMinuteCard(setToValue: boolean = !this.minutelyCardVisible) {
    console.log('toggleMinuteCard', setToValue)
    this.minutelyCardVisible = setToValue;
  }
}
