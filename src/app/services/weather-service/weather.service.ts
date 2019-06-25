import { Injectable, OnInit } from '@angular/core';
import { Weather, WeatherCurrent, WeatherMinutely, WeatherHourly, WeatherDaily, DataMinutely, DataHourly, DataDaily } from '@interfaces/weather.interface'

@Injectable({
  providedIn: 'root'
})
export class WeatherService implements OnInit {

  public innerWidth: any;
  public innerHeight: any;

  constructor() { }

  ngOnInit() {
      // this.innerWidth = window.innerWidth;
      // this.innerHeight = window.innerHeight;
      // console.log('innerWidth', window.innerWidth)
  }

  getWeatherIcon(weatherData: any): string {
    switch (weatherData.icon) {
      case 'rain':
        if (weatherData.precipProbability < .5 || weatherData.precipIntensity < .1) {
          return `assets/icon/weather/svg/rain-1.svg`;
        } else {
          return `assets/icon/weather/svg/rain-2.svg`;
        }
        break;
      case 'partly-cloudy-day':
        if (weatherData.cloudCover < .5) {
          return `assets/icon/weather/svg/partly-cloudy-day.svg`;
        } else {
          return `assets/icon/weather/svg/mostly-cloudy-day.svg`;
        }
        break;
      case 'partly-cloudy-night':
        if (weatherData.cloudCover < .5) {
          return `assets/icon/weather/svg/partly-cloudy-night.svg`;
        } else {
          return `assets/icon/weather/svg/mostly-cloudy-night.svg`;
        }
        break;
      default:
        return `assets/icon/weather/svg/${weatherData.icon}.svg`;
    }
  }

  getWindBearing(windBearing: number): string {
    let directions: string[] = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW', 'N'];
    return directions[Math.floor(((windBearing - 22.5) % 360) / 45) + 1];
  }
}
