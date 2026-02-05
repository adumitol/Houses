import {Component, inject, OnInit} from "@angular/core";
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import {HousingService} from "../housing";


@Component({
    template: `
        <section class="listing-apply">
            <h2 class="section-heading">Apply now to live here</h2>
            <form [formGroup]="applyForm" (submit)="submitApplication()">
                <label for="first-name">First Name</label>
                <input id="first-name" type="text" formControlName="firstName"/>

                <label for="phone">Phone</label>
                <input id="phone" type="number" formControlName="phone"/>

                <label for="email">Email</label>
                <input id="email" type="email" formControlName="email"/>
                
                <label for="date">Date</label>
                <input id="date" type="date" formControlName="date"/>
                
                <label for="message">Message</label>
                <input id="message" type="text" formControlName="message"/>
                
                <label for="privacidad">Acepto politica de privacidad</label>
                <input id="privacidad" type="checkbox" formControlName="privacidad" >

                <button type="submit" class="primary" [disabled]="applyForm.invalid">Apply now</button>
            </form>
        </section>`,
    selector: 'app-details-form',
    standalone: true,
    styleUrls: ['./details-form.css'],

    imports: [
        ReactiveFormsModule
    ]
})
export class AppDetailsFormComponent implements OnInit {
    private readonly housingService = inject(HousingService);

    // Validaciones: Campos obligatorios y formato email
    applyForm = new FormGroup({
        firstName: new FormControl('', Validators.required),
        phone: new FormControl('', Validators.required),
        email: new FormControl('', [Validators.required, Validators.email]),
        date: new FormControl('', Validators.required),
        message: new FormControl(''),
        privacidad: new FormControl('', Validators.requiredTrue),
    });

    ngOnInit() {
        // Autocompletado desde LocalStorage al cargar
        const savedData = localStorage.getItem( 'housingAppData');
        if (savedData) {
            this.applyForm.patchValue(JSON.parse(savedData));
        }
    }

    submitApplication() {
        if (this.applyForm.valid) {
            // Guardamos en LocalStorage al hacer clic
            localStorage.setItem('housingAppData', JSON.stringify(this.applyForm.value));

            this.housingService.submitApplication(
                this.applyForm.value.firstName ?? '',
                this.applyForm.value.phone ?? '',
                this.applyForm.value.email ?? '',
                this.applyForm.value.date ?? '',
                this.applyForm.value.message ?? '',
                this.applyForm.value.privacidad ?? '',
            );
            alert('Application saved and sent!');
        }
    }
}

