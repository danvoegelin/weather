import { Component, OnInit } from '@angular/core';
import { ApiService } from '@services/api-service/api.service';
import { DataService } from '@services/data-service/data.service';
import { Place, Location } from '@interfaces/places.interface';

@Component({
  selector: 'menu',
  templateUrl: './menu.page.html',
  styleUrls: ['./menu.page.scss'],
})
export class MenuPage implements OnInit {

  public places: Place[];
  public savedLocations: any;
  public currentLocation: any;
  public location;
  public input: string;

  constructor(
    private apiService: ApiService,
    private dataService: DataService
  ) { }

  ngOnInit() {
    this.dataService.getLocationFromStorage().then((current) => {
      this.currentLocation = current;
      this.dataService.getSavedLocationsFromStorage().then((savedLocations) => {
        this.savedLocations = savedLocations;
      });
    });
  }

  getPlaces(event) {
    this.input = event.target;
    this.apiService.getPlaces(event.target.value).subscribe((data) => {
      this.places = data.predictions;
    });
  }

  selectPlace(place: Place) {
    this.clearResults();
    this.dataService.setLocation(place).then((details) => {
        this.dataService.getWeather(); // emit refresh event instead
        this.currentLocation = details;
    });
  }

  clearResults() {
    this.input = null;
    this.places = [];
    this.location = '';
    this.apiService.endPlacesSession();
  }

  saveCurrentLocation() {
    if (this.currentLocation) {
      this.dataService.saveLocationToStorage().then(() => {
        this.dataService.getSavedLocationsFromStorage().then((savedLocations) => {
          this.savedLocations = savedLocations;
        });
      });
    }
  }

  selectSavedLocation(location: Location) {
    this.dataService.setSavedLocation(location).then((details) => {
      this.dataService.getWeather(); // emit refresh event instead
      this.currentLocation = details;
    });
  }

  removeSavedLocation(location: Location) {
    this.dataService.removeSavedLocationFromStorage(location).then(() => {
      this.dataService.getSavedLocationsFromStorage().then((savedLocations) => {
        this.savedLocations = savedLocations;
      });
    });
  }

}
