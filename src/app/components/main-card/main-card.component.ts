import { Component, OnInit, OnChanges, Input, Output, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { WeatherCurrent } from '@interfaces/weather.interface';

import { WeatherService } from '@services/weather-service/weather.service';
import { DataService } from '@services/data-service/data.service';

@Component({
  selector: 'main-card',
  templateUrl: './main-card.component.html',
  styleUrls: ['./main-card.component.scss']
})
export class MainCardComponent implements OnInit, OnChanges {

  @Output() minutelyCard: EventEmitter<boolean> = new EventEmitter<boolean>();
  public weatherCurrent: WeatherCurrent;
  public lastRefreshTime: string;
  public uvIndexValue: string;
  public uvIndexClass: string;

  constructor(
    private weatherService: WeatherService,
    private dataService: DataService,
  ) { }

  ngOnInit() {
    this.ngOnChanges();
  }

  ngOnChanges() {
    this.weatherCurrent = this.dataService.getCurrentWeather();
    this.updateData();
  }

  updateData() {
    this.updateLastRefreshTime();
    this.getUVIndex();
  }

  updateLastRefreshTime() {
    let timestamp = new Date(this.weatherCurrent.time * 1000);
    this.lastRefreshTime = timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
  }

  round(num: number) {
    return Math.round(num);
  }

  getUVIndex() {
    switch(true) {
        case this.weatherCurrent.uvIndex > 10:
            this.uvIndexValue = 'Extremely High';
            this.uvIndexClass = 'uv-extremely-high';
            break;
        case this.weatherCurrent.uvIndex > 7:
            this.uvIndexValue = 'Very High';
            this.uvIndexClass = 'uv-very-high';
            break;
        case this.weatherCurrent.uvIndex > 5:
            this.uvIndexValue = 'High';
            this.uvIndexClass = 'uv-high';
            break;
        case this.weatherCurrent.uvIndex > 2:
            this.uvIndexValue = 'Moderate';
            this.uvIndexClass = 'uv-moderate';
            break;
        case this.weatherCurrent.uvIndex > 0:
            this.uvIndexValue = 'Low';
            this.uvIndexClass = 'uv-low';
            break;
        default:
            this.uvIndexValue = 'None';
            this.uvIndexClass = 'uv-none';
            break;
    }
  }

  getWeatherIcon(weatherData: any) {
    return this.weatherService.getWeatherIcon(weatherData);
  }

  toggleMinuteCard2() {
    this.minutelyCard.emit();
  }
}
