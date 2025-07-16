import { Component, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-event-modal',
  templateUrl: './event-modal.component.html',
  styleUrls: ['./event-modal.component.scss'],
  standalone:false,
})
export class EventModalComponent {
  @Input() date!: string;

  titulo = '';
  ubicacion = '';
  notas = '';
  repetir = '';
  horaInicio = '2025-06-27T08:00:00.000Z';
  horaFin = '2025-06-27T09:00:00.000Z';

  constructor(private modalCtrl: ModalController) {}

  cancelar() {
    this.modalCtrl.dismiss();
  }

  guardar() {
    if (!this.titulo.trim()) return;

    this.modalCtrl.dismiss({
      titulo: this.titulo.trim(),
      ubicacion: this.ubicacion,
      notas: this.notas,
      repetir: this.repetir,
      horaInicio: new Date(this.horaInicio).toTimeString().slice(0, 5),
      horaFin: new Date(this.horaFin).toTimeString().slice(0, 5),
      date: this.date
    });
  }
}
