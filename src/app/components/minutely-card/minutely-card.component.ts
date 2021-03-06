import { Component, OnInit, Output, EventEmitter } from '@angular/core';

import { WeatherHourly, WeatherMinutely, WeatherCurrent, DataDaily } from '@interfaces/weather.interface';

import { WeatherService } from '@services/weather-service/weather.service';
import { DataService } from '@services/data-service/data.service';

@Component({
  selector: 'minutely-card',
  templateUrl: './minutely-card.component.html',
  styleUrls: ['./minutely-card.component.scss'],
})
export class MinutelyCardComponent implements OnInit {

  @Output() minutelyCard: EventEmitter<boolean> = new EventEmitter<boolean>();
  private minutelyCardVisible = false;
  public weatherCurrent: WeatherCurrent;
  public weatherMinutely: WeatherMinutely;
  public weatherHourly: WeatherHourly;
  public weatherToday: DataDaily;
  public totalPrecip = 0;
  public rainStarting = 0;
  public minutelyData = false;

  constructor(
    private weatherService: WeatherService,
    private dataService: DataService
  ) { }

  ngOnInit() {
    this.getComponentWeatherData();
    this.dataService.reload.subscribe(() => {
      this.getComponentWeatherData();
    });
  }

  getComponentWeatherData() {
    this.weatherToday = this.dataService.getDailyWeather().data[0];
    this.weatherHourly = this.dataService.getHourlyWeather();
    this.weatherCurrent = this.dataService.getCurrentWeather();
    this.weatherMinutely = this.dataService.getMinutelyWeather();
    this.minutelyData = !!this.weatherMinutely;
    this.getTotalPrecip();
  }

  getTotalPrecip(): void {
    this.totalPrecip = 0;
    const percentageSecondHour = (((this.weatherCurrent.time - this.weatherHourly.data[0].time) / 60) / 60);
    const percentageFirstHour = (1 - percentageSecondHour);
    const rawPrecipTotal = (this.weatherHourly.data[0].precipIntensity * percentageFirstHour)
      + (this.weatherHourly.data[1].precipIntensity * percentageSecondHour);
    this.totalPrecip = parseFloat(rawPrecipTotal.toFixed(2));
  }

  toggleMinutelyCard(): void {
    this.minutelyCard.emit();
  }
}
