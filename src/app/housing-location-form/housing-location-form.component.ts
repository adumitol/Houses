import { Component, inject } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-housing-location-form',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: './housing-location-form.component.html',
    styleUrl: './housing-location-form.component.css'
})
export class HousingLocationFormComponent {
    private fb = inject(NonNullableFormBuilder);
    private http = inject(HttpClient);
    private router = inject(Router);

    successMsg = '';
    errorMsg = '';
    submitting = false;

    // Definición del formulario con validaciones
    form = this.fb.group({
        name: ['', [Validators.required, Validators.minLength(3)]],
        city: ['', Validators.required],
        state: ['', Validators.required],
        availableUnits: [1, [Validators.required, Validators.min(1)]],
        price: [10000, [Validators.required, Validators.min(10000)]],
        wifi: [false],
        laundry: [false],
        available: [true]
    });

    onSubmit() {
        if (this.form.invalid) {
            this.form.markAllAsTouched();
            return;
        }

        this.submitting = true;
        this.successMsg = '';
        this.errorMsg = '';

        // Preparación del objeto
        const newHouse = {
            ...this.form.getRawValue(),
            photo: "", // No se solicita
            coordinate: { latitude: 0, longitude: 0 } // Valor por defecto
        };

        // Envío de petición POST al servidor
        this.http.post('http://localhost:3000/locations', newHouse).subscribe({
            next: (created: any) => {
                this.successMsg = `Vivienda "${created.name}" creada con éxito (ID: ${created.id})`;
                this.form.reset({ availableUnits: 1, available: true, price: 10000 });
                this.submitting = false;

            },
            error: () => {
                this.errorMsg = 'Error al guardar. ¿Está json-server corriendo?';
                this.submitting = false;
            }
        });
    }

    cancel() {
        this.router.navigate(['/']);
    }
}