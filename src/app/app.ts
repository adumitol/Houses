import {Component} from '@angular/core';
import {Home} from './home/home';
import {RouterLink, RouterOutlet} from '@angular/router';

@Component({
    selector: 'app-root',
    imports: [RouterOutlet, RouterLink],
    template: `
      <main>
          <header class="brand-name">
              <a [routerLink]="['/']">
                  <img class="brand-logo" src="/public/logo.svg" alt="logo" aria-hidden="true" />
              </a>
              
              <button class="primary" type="button" [routerLink]="['/add-house']" style="margin-left: 20px;">
                  + Nueva Vivienda
              </button>
          </header>

          <section class="content">
              <router-outlet />
          </section>
      </main>
  `,
    styleUrls: ['./app.css'],
})
export class App {
    title = 'homes';
}