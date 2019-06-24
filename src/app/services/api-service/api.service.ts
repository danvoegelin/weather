import { NgModule, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Weather } from '@interfaces/weather.interface';
import { Observable } from 'rxjs/Observable';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient) { }

  private apiKey: string = '';
  private forecastUrl: string = 'https://api.darksky.net/forecast/';
  public corsProxy: string = 'https://cors-anywhere.herokuapp.com/';

  public getWeather(lat: string, long: string): Observable<Weather> {
    console.log('getting weather..')
    return this.http.get<Weather>(this.getUrl(lat, long));
  }

  private getUrl(lat: string, long: string) {
    return `${this.corsProxy}${this.forecastUrl}${this.apiKey}/${lat},${long}`;
  }

}
