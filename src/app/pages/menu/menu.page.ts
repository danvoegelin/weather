import { Component, OnInit } from '@angular/core';
import { ApiService } from '@services/api-service/api.service';
import { DataService } from '@services/data-service/data.service';
import { Place } from '@interfaces/places.interface';

@Component({
  selector: 'menu',
  templateUrl: './menu.page.html',
  styleUrls: ['./menu.page.scss'],
})
export class MenuPage implements OnInit {

  public places: Place[];
  public location;

  constructor(
    private apiService: ApiService,
    private dataService: DataService
  ) { }

  ngOnInit() {
  }

  getPlaces(event) {
    this.apiService.getPlaces(event.target.value).subscribe((data) => {
      this.places = data.predictions;
    });
  }

  selectPlace(place: Place) {
    this.clearResults();
    this.dataService.setLocation(place).then(() => {
        this.dataService.getWeather(); // emit refresh event instead
    });
  }

  clearResults() {
    this.places = [];
    this.location = '';
    this.apiService.endPlacesSession();
  }

}
