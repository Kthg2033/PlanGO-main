import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicModule } from '@ionic/angular';
import { AppRoutingModule } from './app-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';  // <-- Importa ReactiveFormsModule aquí
import { HttpClientModule } from '@angular/common/http';
import { IonicStorageModule } from '@ionic/storage-angular';

import { AppComponent } from './app.component';
import { EventModalModule } from './components/evento-modal/event-modal.module';

import { SQLite } from '@awesome-cordova-plugins/sqlite/ngx';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,   // <-- Agrega esto
    HttpClientModule,
    IonicStorageModule.forRoot(),
    EventModalModule
  ],
  providers: [
    SQLite
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
