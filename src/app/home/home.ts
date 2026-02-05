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
          <label>Solo viviendas disponibles</label>
          <input type="checkbox" id="houseAvailable" #available (click)="filterAvailableHouses(available.checked)">
          <label>Ordenar por precio</label>
          <select id="ordenar"  #sort (change)="sortResults(sort.value)">
              <option value="">Seleccione una opción</option>
              <option value="asc">Ascendente</option>
              <option value="desc">Descendente</option>
          </select>
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
        if (filtered.length === 0) {
            alert("No hay casas que coincidan con este filtro");
            return;
        }
        this.filteredLocationList.set(filtered);
    }

    filterAvailableHouses(isChecked: boolean) {
        if (isChecked) {
            const filtered = this.housingLocationList().filter(location => location.available);
            this.filteredLocationList.set(filtered);
        } else {
            this.filteredLocationList.set(this.housingLocationList());
        }

    }

    sortResults(order: string) {
        let sorted = [...this.housingLocationList()];
        if (order === 'asc') {
            sorted.sort((a, b) => a.price - b.price);
        } else if (order === 'desc') {
            sorted.sort((a, b) => b.price - a.price);
        }
        this.filteredLocationList.set(sorted);
    }


}