import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { AlertController } from '@ionic/angular';

interface Habito {
  icono: string;
  nombre: string;
  color: string;
  dias: boolean[];
  racha: number;
}

@Component({
  selector: 'app-habitos',
  templateUrl: './habitos.page.html',
  styleUrls: ['./habitos.page.scss'],
  standalone: false,
})
export class HabitosPage implements OnInit {
  habitTemplates: Omit<Habito, 'dias' | 'racha'>[] = [
    { icono: '🚶', nombre: 'Caminar 30 min', color: '#4caf50' },
    { icono: '🚰', nombre: 'Beber 2L de agua', color: '#2196f3' },
    { icono: '🧘', nombre: 'Meditar 10 min', color: '#9c27b0' },
    { icono: '📖', nombre: 'Leer 15 min', color: '#ff9800' },
    { icono: '💤', nombre: 'Dormir 7h', color: '#3f51b5' },
    { icono: '🏃', nombre: 'Correr 20 min', color: '#f44336' },
    { icono: '🙏', nombre: 'Gratitud diaria', color: '#795548' },
  ];

  habitosFiltrados: Habito[] = [];
  selectedIndex: number | null = null;

  constructor(
    private storage: Storage,
    private alertCtrl: AlertController
  ) {}

  async ngOnInit() {
    await this.storage.create();
    const guardados = await this.storage.get('habitos');
    if (guardados) {
      this.habitosFiltrados = guardados;
    }
  }

  async agregarHabito(template: Omit<Habito, 'dias' | 'racha'>) {
    const nuevoHabito: Habito = {
      icono: template.icono,
      nombre: template.nombre,
      color: template.color,
      dias: [false, false, false, false, false, false, false],
      racha: 0,
    };
    this.habitosFiltrados.push(nuevoHabito);
    await this.guardarHabitos();
  }

  async toggleDia(habito: Habito, index: number) {
    habito.dias[index] = !habito.dias[index];
    habito.racha = this.calcularRacha(habito);
    await this.guardarHabitos();
  }

  seleccionarHabito(index: number) {
    this.selectedIndex = this.selectedIndex === index ? null : index;
  }

  async confirmarEliminarHabito(index: number) {
    const alert = await this.alertCtrl.create({
      header: '¿Eliminar hábito?',
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
            this.habitosFiltrados.splice(index, 1);
            this.selectedIndex = null;
            await this.guardarHabitos();
          }
        }
      ]
    });

    await alert.present();
  }

  calcularRacha(habito: Habito): number {
    let racha = 0;
    for (let i = habito.dias.length - 1; i >= 0; i--) {
      if (habito.dias[i]) {
        racha++;
      } else {
        break;
      }
    }
    return racha;
  }

  progreso(h: Habito): number {
    return h.dias.filter(d => d).length;
  }

  get totalDiasCumplidos(): number {
    return this.habitosFiltrados.reduce((acc, h) => acc + this.progreso(h), 0);
  }

  get promedioSemanal(): number {
    if (this.habitosFiltrados.length === 0) return 0;
    return this.totalDiasCumplidos / this.habitosFiltrados.length;
  }

  get mejorRacha(): number {
    return Math.max(...this.habitosFiltrados.map(h => h.racha), 0);
  }

  async guardarHabitos() {
    await this.storage.set('habitos', this.habitosFiltrados);
  }
}
