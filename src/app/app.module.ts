import { NgModule, LOCALE_ID } from '@angular/core'; // <-- Añadir LOCALE_ID
import { BrowserModule } from '@angular/platform-browser';
import { IonicModule } from '@ionic/angular';
import { AppRoutingModule } from './app-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { IonicStorageModule } from '@ionic/storage-angular';

import { AppComponent } from './app.component';
import { EventModalModule } from './components/evento-modal/event-modal.module';

import { SQLite } from '@awesome-cordova-plugins/sqlite/ngx';

// 👇 Importar y registrar locale español
import localeEs from '@angular/common/locales/es';
import { registerLocaleData } from '@angular/common';
registerLocaleData(localeEs);

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    IonicStorageModule.forRoot(),
    EventModalModule
  ],
  providers: [
    SQLite,
    { provide: LOCALE_ID, useValue: 'es' } // 👈 Establecer español como idioma global
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
