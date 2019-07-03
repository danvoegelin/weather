import { NgModule, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Weather } from '@interfaces/weather.interface';
import { Place } from '@interfaces/places.interface';
import { Observable } from 'rxjs/Observable';
import { v4 } from 'uuid';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(
    private http: HttpClient,
  ) { }

  private placesSession: string = '';
  private darkskyApiKey: string = '';
  private forecastUrl: string = 'https://api.darksky.net/forecast/';
  private googlePlacesApiKey: string = '';
  private googlePlacesUrl: string = 'https://maps.googleapis.com/maps/api/place/autocomplete/json?';
  private googlePlacesDetailsUrl: string = 'https://maps.googleapis.com/maps/api/place/details/json?';
  public corsProxy: string = 'https://cors-anywhere.herokuapp.com/';

  public getWeather(lat: string, long: string): Observable<Weather> {
    console.log('getting weather..')
    return this.http.get<Weather>(this.getForecastUrl(lat, long));
  }

  private getForecastUrl(lat: string, long: string) {
    return `${this.corsProxy}${this.forecastUrl}${this.darkskyApiKey}/${lat},${long}`;
  }

  private createUUIDToken(): string {
    let uuid = v4();
    return uuid;
  }

  private startPlacesSession() {
    this.placesSession = this.createUUIDToken();
  }

  public endPlacesSession() {
    this.placesSession = '';
  }

  public getPlaces(query: string): Observable<any> {
    if (this.placesSession === '' || query.length < 1) {
      this.startPlacesSession();
    }
    return this.http.get<any>(this.getPlacesUrl(query));
  }

  private getPlacesUrl(input: string) {
    return `${this.corsProxy}${this.googlePlacesUrl}key=${this.googlePlacesApiKey}&sessiontoken=${this.placesSession}&input=${input}`;
  }

  private getPlacesDetailsUrl(placeId: string) {
    return `${this.corsProxy}${this.googlePlacesDetailsUrl}key=${this.googlePlacesApiKey}&sessiontoken=${this.placesSession}&placeid=${placeId}`;
  }

  public getPlaceDetail(place: Place): Observable<any> {
    return this.http.get<any>(this.getPlacesDetailsUrl(place.place_id));
  }
}
