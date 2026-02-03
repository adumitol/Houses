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
    private readonly localUrl = '/assets/db.json';

    async getAllHousingLocations(): Promise<HousingLocationInfo[]> {
        try {
            const response = await fetch(this.apiUrl);
            if (!response.ok) throw new Error();
            return await response.json();
        } catch (error) {
            const fallback = await fetch(this.localUrl);
            const data = await fallback.json();
            return data.locations || data;
        }
    }

    async getHousingLocationById(id: number): Promise<HousingLocationInfo | undefined> {
        try {
            const response = await fetch(`${this.apiUrl}?id=${id}`);
            const locationJson = await response.json();
            return locationJson[0] ?? undefined;
        } catch (error) {
            const fallback = await fetch(this.localUrl);
            const data = await fallback.json();
            return data.locations.find((l: any) => l.id === id);
        }
    }

    submitApplication(firstName: string, lastName: string, email: string) {
        console.log(firstName, lastName, email);
    }
}