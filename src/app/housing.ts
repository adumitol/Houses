import { Injectable } from '@angular/core';
import { HousingLocationInfo } from './housinglocation';

export interface HousingProvider {
    getAllHousingLocations(): Promise<HousingLocationInfo[]>;
}

@Injectable({
    providedIn: 'root',
})
export class HousingService implements HousingProvider {
    private readonly apiUrl = 'http://localhost:3000/locations';
    private readonly localUrl = 'assets/db.json';

    async getAllHousingLocations(): Promise<HousingLocationInfo[]> {
        try {
            const response = await fetch(this.apiUrl);
            if (!response.ok) throw new Error('API inaccesible');
            return await response.json();
        } catch (error) {
            console.warn('Fallo en API, activando datos locales de emergencia');
            const fallback = await fetch(this.localUrl);
            const data = await fallback.json();
            return data.locations || data;
        }
    }

    async getHousingLocationById(id: number): Promise<HousingLocationInfo | undefined> {
        try {
            const response = await fetch(`${this.apiUrl}?id=${id}`);
            if (!response.ok) throw new Error('API inaccesible');
            const locationJson = await response.json();
            return locationJson[0] ?? undefined;
        } catch (error) {
            console.warn(`Fallo en API para ID ${id}, buscando en datos locales`);
            const fallback = await fetch(this.localUrl);
            const data = await fallback.json();
            const locations: HousingLocationInfo[] = data.locations || data;
            return locations.find((l) => l.id === id);
        }
    }

    submitApplication(firstName: string, lastName: string, email: string, date: string, message: string, privacidad: string) {
        console.log('Application received:', firstName, lastName, email);
    }


    async getWeather(lat: number, lon: number): Promise<any> {
        const apiKey = '15d237cebf0e48e4a5c120714260801';
        const url = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${lat},${lon}&aqi=no`;

        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error('Error al obtener el clima');
            return await response.json();
        } catch (error) {
            console.error('No se pudo cargar el clima:', error);
            return null;
        }
    }
}