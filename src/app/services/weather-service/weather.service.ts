import { Injectable, OnInit } from '@angular/core';
import { Weather, WeatherCurrent, WeatherMinutely, WeatherHourly,
  WeatherDaily, DataMinutely, DataHourly, DataDaily } from '@interfaces/weather.interface';

@Injectable({
  providedIn: 'root'
})
export class WeatherService implements OnInit {

  public innerWidth: any;
  public innerHeight: any;
  public theme: string;

  constructor() { }

  ngOnInit() {
      // this.innerWidth = window.innerWidth;
      // this.innerHeight = window.innerHeight;
      // console.log('innerWidth', window.innerWidth)
  }

  setTheme(theme: string) {
    this.theme = theme;
  }

  getWeatherIcon(weatherData: any): string {
    const ext = this.theme === 'retro' ? 'gif' : 'svg';
    switch (weatherData.icon) {
      case 'rain':
        if (weatherData.totalPrecip === 0) {
          if (weatherData.windSpeed > 10 && weatherData.windGust > 50) {
            return `assets/icon/weather/svg/wind.${ext}`;
          } else {
            return `assets/icon/weather/svg/cloudy.${ext}`;
          }
        } else if ((weatherData.precipProbability < .5 || weatherData.precipIntensity < .1)
          && (!weatherData.totalPrecip || weatherData.totalPrecip < 1)) {
          return `assets/icon/weather/svg/rain-1.${ext}`;
        } else {
          return `assets/icon/weather/svg/rain-2.${ext}`;
        }
        break;
      case 'snow':
        if (weatherData.totalPrecip === 0) {
          return `assets/icon/weather/svg/cloudy.${ext}`;
        } else if ((weatherData.precipProbability < .1 || weatherData.precipAccumulation < 1)) {
          return `assets/icon/weather/svg/snow-1.${ext}`;
        } else if ((weatherData.precipProbability < .2 || weatherData.precipAccumulation < 2)) {
          return `assets/icon/weather/svg/snow-2.${ext}`;
        } else if ((weatherData.windSpeed > 10 && weatherData.precipAccumulation >= 6)) {
          return `assets/icon/weather/svg/snow-4.${ext}`;
        } else {
          return `assets/icon/weather/svg/snow-3.${ext}`;
        }
      case 'partly-cloudy-day':
        if (weatherData.windSpeed > 10 && weatherData.windGust > 50) {
          return `assets/icon/weather/svg/wind.${ext}`;
        } else if (weatherData.cloudCover < .5) {
          return `assets/icon/weather/svg/partly-cloudy-day.${ext}`;
        } else {
          return `assets/icon/weather/svg/mostly-cloudy-day.${ext}`;
        }
        break;
      case 'partly-cloudy-night':
        if (weatherData.cloudCover < .5) {
          return `assets/icon/weather/svg/partly-cloudy-night.${ext}`;
        } else {
          return `assets/icon/weather/svg/mostly-cloudy-night.${ext}`;
        }
        break;
      default:
        return `assets/icon/weather/svg/${weatherData.icon}.${ext}`;
    }
  }

  getWindBearing(windBearing: number): string {
    const directions: string[] = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW', 'N'];
    return directions[Math.floor(((windBearing - 22.5) % 360) / 45) + 1];
  }

  getTotalPrecip(day): number {
    const totalPrecip: number = day.precipIntensity * 24 + (day.precipAccumulation || 0);
    return totalPrecip >= .1 ? parseFloat(totalPrecip.toFixed(1)) : 0;
  }

  getMinutelyChartHeight(weatherData: DataMinutely): string {
    return `${weatherData.precipIntensity > 0 ? (weatherData.precipIntensity * 400) + 2 : 0}px`;
  }


  getUVIndexValue(weatherCurrent: WeatherCurrent): string {
    switch (true) {
      case weatherCurrent.uvIndex > 10:
        return 'Extremely High';
      case weatherCurrent.uvIndex > 7:
        return 'Very High';
      case weatherCurrent.uvIndex > 5:
        return 'High';
      case weatherCurrent.uvIndex > 2:
        return 'Moderate';
      case weatherCurrent.uvIndex > 0:
        return 'Low';
      default:
        return 'None';
    }
  }

  getUVIndexClass(uvIndexValue: string): string {
    return `uv-${uvIndexValue.replace(' ', '-').toLowerCase()}`;
  }
}
