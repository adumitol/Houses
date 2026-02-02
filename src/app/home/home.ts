import { Component, inject, signal } from '@angular/core';
import { HousingLocation } from '../housing-location/housing-location';
import { HousingLocationInfo } from '../housinglocation';
import { HousingService } from '../housing';

@Component({
    selector: 'app-home',
    standalone: true,
    imports: [HousingLocation],
    template: `
    <section>
      <form>
        <input type="text" placeholder="Filter by city" #filter />
        <button class="primary" type="button" (click)="filterResults(filter.value)">Search</button>
      </form>
    </section>
    <section class="results">
      @for (housingLocation of filteredLocationList(); track housingLocation.id) {
        <app-housing-location [housingLocation]="housingLocation" />
      }
    </section>
  `,
    styleUrls: ['./home.css'],
})
export class Home {
    housingService: HousingService = inject(HousingService);
    housingLocationList = signal<HousingLocationInfo[]>([]);
    filteredLocationList = signal<HousingLocationInfo[]>([]);

    constructor() {
        this.housingService.getAllHousingLocations().then((list) => {
            this.housingLocationList.set(list);
            this.filteredLocationList.set(list);
        });
    }

    filterResults(text: string) {
        if (!text) {
            this.filteredLocationList.set(this.housingLocationList());
            return;
        }
        const filtered = this.housingLocationList().filter((location) =>
            location?.city.toLowerCase().includes(text.toLowerCase()),
        );
        this.filteredLocationList.set(filtered);
    }
}