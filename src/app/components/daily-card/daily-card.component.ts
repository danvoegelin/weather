import { Component, OnInit, OnChanges, Input } from '@angular/core';

import { WeatherDaily } from '@interfaces/weather.interface';

import { WeatherService } from '@services/weather-service/weather.service';
import { DataService } from '@services/data-service/data.service';

@Component({
  selector: 'daily-card',
  templateUrl: './daily-card.component.html',
  styleUrls: ['./daily-card.component.scss'],
})
export class DailyCardComponent implements OnInit, OnChanges {

  public weatherDaily: WeatherDaily;
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
    this.weatherDaily = this.dataService.getDailyWeather();
    this.loading = false;
  }

  getFormattedDate(date: number) {
    let datestamp = new Date(date * 1000)
    return datestamp.toLocaleDateString([], {weekday: 'long'});
  }

  getFormattedTime(time: number) {
    let timestamp = new Date(time * 1000)
    return timestamp.toLocaleTimeString([], {hour: 'numeric', minute: '2-digit'});
  }

  getWeatherIcon(weatherData: any) {
    return this.weatherService.getWeatherIcon(weatherData);
  }

  round(num: number) {
    return Math.round(num);
  }

  expandItem(day: any): void {
    if (day.expanded) {
      day.expanded = false;
    } else {
      this.weatherDaily.data.map(dayItem => {
        if (day == dayItem) {
          dayItem.expanded = !dayItem.expanded;
        } else {
          dayItem.expanded = false;
        }
        return dayItem;
      });
    }
  }
}
