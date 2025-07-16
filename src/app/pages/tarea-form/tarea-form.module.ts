import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';

import { TareaFormPage } from './tarea-form.page';

@NgModule({
  declarations: [TareaFormPage],  // ⬅️ aquí se declara el componente
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    RouterModule.forChild([
      {
        path: '',
        component: TareaFormPage
      }
    ])
  ]
})
export class TareaFormPageModule {}
