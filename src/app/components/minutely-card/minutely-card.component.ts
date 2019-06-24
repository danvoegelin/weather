import { Component, OnInit, OnChanges, Input, Output, EventEmitter } from '@angular/core';

import { WeatherHourly, WeatherMinutely, WeatherCurrent } from '@interfaces/weather.interface';

import { WeatherService } from '@services/weather-service/weather.service';
import { DataService } from '@services/data-service/data.service';

@Component({
  selector: 'minutely-card',
  templateUrl: './minutely-card.component.html',
  styleUrls: ['./minutely-card.component.scss'],
})
export class MinutelyCardComponent implements OnInit, OnChanges {

  @Output() minutelyCard: EventEmitter<boolean> = new EventEmitter<boolean>();
  private minutelyCardVisible = false;
  public weatherCurrent: WeatherCurrent;
  public weatherMinutely: WeatherMinutely;
  public weatherHourly: WeatherHourly;
  public totalPrecip: number = 0;
  public rainStarting: number = 0;

  constructor(
    private weatherService: WeatherService,
    private dataService: DataService
  ) { }

  ngOnInit() {
    this.ngOnChanges();
  }

  ngOnChanges() {
    this.weatherHourly = this.dataService.getHourlyWeather();
    this.weatherMinutely = this.dataService.getMinutelyWeather();
    this.weatherCurrent = this.dataService.getCurrentWeather();
    this.getTotalPrecip();
  }

  getFormattedDate(date: number) {
    let timestamp = new Date(date * 1000)
    return timestamp.toLocaleTimeString([], {hour: 'numeric'});
  }

  getHeight(weatherData: any) {
    return `${weatherData.precipIntensity > 0 ? (weatherData.precipIntensity * 400) + 2 : 0}px`;
  }

  round(num: number) {
    return Math.round(num);
  }

  getWeatherIcon(weatherData: any) {
    return this.weatherService.getWeatherIcon(weatherData);
  }

  getTotalPrecip() {
    this.totalPrecip = 0;
    let percentageSecondHour = (((this.weatherCurrent.time - this.weatherHourly.data[0].time) / 60) / 60);
    let percentageFirstHour = (1 - percentageSecondHour);
    let rawPrecipTotal = (this.weatherHourly.data[0].precipIntensity * percentageFirstHour) + (this.weatherHourly.data[1].precipIntensity * percentageSecondHour);
    this.totalPrecip = parseFloat(rawPrecipTotal.toFixed(2));
  }

  getWindBearing(windBearing: number) {
    return this.weatherService.getWindBearing(windBearing);
  }

  toggleMinutelyCard() {
    this.minutelyCard.emit();
  }

  swipeEvent(event) {
    // let card = document.querySelector('minutely-card');
    console.log('panning', event.additionalEvent, event.deltaY, event.direction)
    // card.style.top = `${event.deltaY - 30}px`;
  }
}
