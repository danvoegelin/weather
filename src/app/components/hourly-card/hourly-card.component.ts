import { Component, OnInit, OnChanges, Input } from '@angular/core';

import { WeatherHourly } from '@interfaces/weather.interface';

import { WeatherService } from '@services/weather-service/weather.service';
import { DataService } from '@services/data-service/data.service';

@Component({
  selector: 'hourly-card',
  templateUrl: './hourly-card.component.html',
  styleUrls: ['./hourly-card.component.scss'],
})
export class HourlyCardComponent implements OnInit, OnChanges {

  @Input() minutelyCard: boolean;
  public weatherHourly: WeatherHourly;
  public staggerFunction = this.staggerDropIn();
  public loading: boolean = true;

  constructor(
    private weatherService: WeatherService,
    private dataService: DataService
  ) { }

  ngOnInit() {
    this.dataService.reload.subscribe(() => {
      this.loading = true;
      this.ngOnChanges();
    })
  }

  ngOnChanges() {
    this.weatherHourly = this.dataService.getHourlyWeather();
    this.loading = false;
    // setTimeout(this.staggerDropIn(), 1000); // animation too choppy on older phones
  }

  getFormattedTime(date: number) {
    let timestamp = new Date(date * 1000)
    return timestamp.toLocaleTimeString([], {hour: 'numeric'});
  }

  round(num: number) {
    return Math.round(num);
  }

  getWeatherIcon(weatherData: any) {
    return this.weatherService.getWeatherIcon(weatherData);
  }

  staggerDropIn() {
    return function() {
      const items = document.querySelectorAll('ion-item.hourly');
      for (let i = 0; i < items.length; i++) {
        setTimeout(function(){ items[i].classList.toggle('slide-in') }, i * 50);
        setTimeout(function(){ items[i].classList.toggle('hide') }, i * 50);
      }
      this.loading = false;
    }
  }

  expandItem(hour: any): void {
    if (hour.expanded) {
      hour.expanded = false;
    } else {
      this.weatherHourly.data.map(hourItem => {
        if (hour == hourItem) {
          hourItem.expanded = !hourItem.expanded;
        } else {
          hourItem.expanded = false;
        }
        return hourItem;
      });
    }
  }
}
