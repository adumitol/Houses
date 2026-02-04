import { Routes } from '@angular/router';
import { Home } from './home/home';
import { Details } from './details/details';
//Importa el nuevo componente del formulario
import { HousingLocationFormComponent } from './housing-location-form/housing-location-form.component';

const routeConfig: Routes = [
    {
        path: '',
        component: Home,
        title: 'Home page',
    },
    {
        path: 'details/:id',
        component: Details,
        title: 'Home details',
    },
    //Añade la ruta para el registro de nuevas casas
    {
        path: 'add-house',
        component: HousingLocationFormComponent,
        title: 'Añadir nueva vivienda',
    },
];

export default routeConfig;