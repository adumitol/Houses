import { ChangeDetectorRef, Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HousingService } from '../housing';
import { HousingLocationInfo } from '../housinglocation';
import { ReactiveFormsModule } from '@angular/forms';
import {AppDetailsFormComponent} from "../details-form/details-form";

@Component({
    selector: 'app-details',
    standalone: true,
    imports: [ReactiveFormsModule, AppDetailsFormComponent],
    template: `
    <article>
      <img class="listing-photo" [src]="housingLocation?.photo" alt="Exterior photo" crossorigin />
      
      <section class="listing-description">
        <h2 class="listing-heading">{{ housingLocation?.name }}</h2>
        <p class="listing-location">{{ housingLocation?.city }}, {{ housingLocation?.state }}</p>
      </section>
      
      <section class="listing-features">
        <h2 class="section-heading">About this housing location</h2>
        <ul>
          <li>Units available: {{ housingLocation?.availableUnits }}</li>
          <li>Does this location have wifi: {{ housingLocation?.wifi }}</li>
          <li>Does this location have laundry: {{ housingLocation?.laundry }}</li>
          <li><strong>Price:</strong> {{ housingLocation?.price }}€</li>
          <li><strong>Status:</strong> {{ housingLocation?.available ? 'Available' : 'Not Available' }}</li>
          <li><strong>Coordinates:</strong> Lat: {{ housingLocation?.coordinate?.latitude }}, Long: {{ housingLocation?.coordinate?.longitude }}</li>
        </ul>
      </section>

      @if (weatherData()) {
        <section class="listing-weather">
          <h2 class="section-heading">Current Weather</h2>
          <div style="display: flex; align-items: center; gap: 10px;">
            <img [src]="weatherData().current.condition.icon" alt="Weather icon" />
            <p>
              <strong>{{ weatherData().current.temp_c }}°C</strong> - {{ weatherData().current.condition.text }}
            </p>
          </div>
        </section>
      }
        <!--Añado el formulario del otro componente-->
        <app-details-form></app-details-form>
    </article>
    
  `,
    styleUrls: ['./details.css'],
})
export class Details  {
    private readonly changeDetectorRef = inject(ChangeDetectorRef);
    private readonly route = inject(ActivatedRoute);
    private readonly housingService = inject(HousingService);

    housingLocation: HousingLocationInfo | undefined;
    weatherData = signal<any>(null); // Signal para el patrón Observer

    constructor() {
        const housingLocationId = parseInt(this.route.snapshot.params['id'], 10);

        // Obtenemos los datos de la vivienda
        this.housingService.getHousingLocationById(housingLocationId).then((location) => {
            this.housingLocation = location;

            // Si tenemos coordenadas, consultamos el clima
            if (location?.coordinate) {
                this.fetchWeather(location.coordinate.latitude, location.coordinate.longitude);
            }
            this.changeDetectorRef.markForCheck();
        });
    }


    async fetchWeather(lat: number, lon: number) {
        // Llamada a la infraestructura externa de clima
        const data = await this.housingService.getWeather(lat, lon);
        if (data) {
            this.weatherData.set(data);
            this.changeDetectorRef.markForCheck();
        }
    }

}