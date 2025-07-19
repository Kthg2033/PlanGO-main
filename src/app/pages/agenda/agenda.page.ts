import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-agenda',
  standalone:false,
  templateUrl: './agenda.page.html',
  styleUrls: ['./agenda.page.scss']
})
export class AgendaPage implements OnInit {
  eventos: any[] = [];

  constructor(
    private storage: Storage,
    private alertCtrl: AlertController
  ) {}

  async ngOnInit() {
    await this.storage.create();
    const guardados = await this.storage.get('eventos');
    if (guardados) {
      this.eventos = guardados;
      this.eventos.sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime());
    }
  }

  // ✅ Agrega esta función
  async confirmarEliminacion(index: number) {
    const alerta = await this.alertCtrl.create({
      header: '¿Eliminar evento?',
      message: 'Esta acción no se puede deshacer.',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Eliminar',
          role: 'destructive',
          handler: async () => {
            this.eventos.splice(index, 1);
            await this.storage.set('eventos', this.eventos);
          }
        }
      ]
    });

    await alerta.present();
  }
}
