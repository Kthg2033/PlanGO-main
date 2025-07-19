import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-event-modal',
  templateUrl: './event-modal.component.html',
  styleUrls: ['./event-modal.component.scss'],
  standalone: false,
})
export class EventModalComponent implements OnInit {
  @Input() date!: string;

  titulo = '';
  ubicacion = '';
  notas = '';
  repetir = '';
  horaInicio = '2025-06-27T08:00:00.000Z';
  horaFin = '2025-06-27T09:00:00.000Z';

  dia = '';
  mes = '';
  anio = '';

  constructor(private modalCtrl: ModalController) {}

  ngOnInit() {
    if (this.date) {
      const [a, m, d] = this.date.split('-');
      this.anio = a;
      this.mes = m;
      this.dia = d;
    }
  }

  cancelar() {
    this.modalCtrl.dismiss();
  }

  guardar() {
    if (!this.titulo.trim()) return;

    const fechaFormateada = `${this.anio}-${this.mes.padStart(2, '0')}-${this.dia.padStart(2, '0')}`;

    this.modalCtrl.dismiss({
      titulo: this.titulo.trim(),
      ubicacion: this.ubicacion,
      notas: this.notas,
      repetir: this.repetir,
      horaInicio: new Date(this.horaInicio).toTimeString().slice(0, 5),
      horaFin: new Date(this.horaFin).toTimeString().slice(0, 5),
      date: fechaFormateada
    });
  }
}
