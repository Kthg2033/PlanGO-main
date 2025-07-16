import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common'; // ✅ esta es la línea correcta
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';   // ✅ importa todos los ion-components
import { RouterModule } from '@angular/router';

import { HomePage } from './home.page';
import { FullCalendarModule } from '@fullcalendar/angular'; // ✅ para el calendario

@NgModule({
  declarations: [HomePage],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FullCalendarModule,
    RouterModule.forChild([{ path: '', component: HomePage }])
  ]
})
export class HomePageModule {}
