import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular'; // <-- clave
import { EventModalComponent } from './event-modal.component';

@NgModule({
  declarations: [EventModalComponent],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule // <-- clave para los ion-*
  ],
  exports: [EventModalComponent]
})
export class EventModalModule {}
