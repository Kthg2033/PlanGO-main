import { Component, OnInit } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
import { CalendarOptions } from '@fullcalendar/core';
import interactionPlugin from '@fullcalendar/interaction';
import dayGridPlugin from '@fullcalendar/daygrid';
import { EventModalComponent } from '../../components/evento-modal/event-modal.component';
import { Storage } from '@ionic/storage-angular';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-home',
  standalone:false,
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  calendarOptions: CalendarOptions = {
    plugins: [dayGridPlugin, interactionPlugin],
    initialView: 'dayGridMonth',
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth'
    },
    dateClick: this.onDateClick.bind(this),
    eventClick: this.onEventClick.bind(this),
    events: []
  };

  posts: any[] = [];
  climaCiudad: string = 'Santiago';
  climaTemp: string = '';
  climaDesc: string = '';
  valorUF: string = '';
  valorDolar: string = '';
  fraseMotivacional: string = '';

  constructor(
    private alertCtrl: AlertController,
    private modalCtrl: ModalController,
    private storage: Storage,
    private api: ApiService
  ) {}

  async ngOnInit() {
    await this.storage.create();
    this.climaCiudad = await this.storage.get('ciudad');
    if (!this.climaCiudad || this.climaCiudad.trim() === '') {
      this.climaCiudad = 'Santiago';
    }
    this.cargarEventos();
    this.cargarAPI();
    this.obtenerFrase();
    await this.obtenerClimaDesdeUbicacion();
    this.obtenerEconomia();
  }

  async cargarEventos() {
    const guardados = await this.storage.get('eventos');
    if (guardados) {
      this.calendarOptions.events = guardados;
    }
  }

  async onDateClick(arg: any) {
    const modal = await this.modalCtrl.create({
      component: EventModalComponent,
      componentProps: { date: arg.dateStr }
    });

    modal.onDidDismiss().then(async result => {
      if (result.data) {
        const data = result.data;
        const nuevoEvento = {
          title: data.titulo,
          start: `${data.date}T${data.horaInicio}`,
          end: `${data.date}T${data.horaFin}`,
          color: '#3788d8',
          extendedProps: {
            ubicacion: data.ubicacion,
            notas: data.notas,
            repetir: data.repetir
          }
        };

        const actuales = this.calendarOptions.events as any[] || [];
        const actualizados = [...actuales, nuevoEvento];
        this.calendarOptions = { ...this.calendarOptions, events: [...actualizados] };
        await this.storage.set('eventos', actualizados);
      }
    });

    await modal.present();
  }

  async onEventClick(info: any) {
    const evento = info.event;
    const props = evento.extendedProps;

    const fecha = new Date(evento.start).toLocaleDateString('es-ES', {
      weekday: 'long', day: '2-digit', month: '2-digit', year: 'numeric'
    });

    const mensaje = `
      📅 Fecha: ${fecha}
      📍 Ubicación:${props.ubicacion || '—'}
      📝 Notas: ${props.notas || '—'}
      🔁 Repetir:${props.repetir || '—'}
      ⏰ Desde: ${new Date(evento.start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}
      ⏳ Hasta:${new Date(evento.end).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}
    `;

    const alert = await this.alertCtrl.create({
      header: `📌 ${evento.title}`,
      message: mensaje,
      buttons: [
        { text: '🗑 Eliminar', role: 'destructive', handler: () => this.eliminarEvento(evento) },
        { text: 'Cerrar', role: 'cancel' }
      ]
    });

    await alert.present();
  }

  async eliminarEvento(evento: any) {
    const actuales = this.calendarOptions.events as any[] || [];
    const actualizados = actuales.filter(ev =>
      !(ev.title === evento.title && new Date(ev.start).toISOString() === evento.start.toISOString())
    );
    this.calendarOptions = { ...this.calendarOptions, events: [...actualizados] };
    await this.storage.set('eventos', actualizados);
  }

  cargarAPI() {
    this.api.getTareas().subscribe(
      (data: any) => {
        this.posts = data;
        this.storage.set('posts', this.posts);
      },
      async (error: any) => {
        console.log('API error:', error.status);
        if (error.status === 404 || !navigator.onLine) {
          this.posts = await this.storage.get('posts') || [];
        }
      }
    );
  }

  async obtenerClimaDesdeUbicacion() {
    try {
      let lat = await this.storage.get('lat');
      let lon = await this.storage.get('lon');

      console.log('DEBUG | Lat desde storage:', lat, 'Lon:', lon);

      if (!lat || !lon) {
        lat = -33.45;
        lon = -70.66;
        console.warn('No hay lat/lon en Storage, usando coordenadas por defecto (Santiago).');
      }

      const resp = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`);
      const data = await resp.json();

      console.log('DEBUG | Respuesta API Clima:', data);

      this.climaTemp = data.current_weather?.temperature;
      this.climaDesc = 'Despejado';

    } catch (err) {
      console.error('Error obteniendo clima', err);
      this.climaTemp = '';
      this.climaDesc = 'No disponible';
    }
  }

  obtenerEconomia() {
    this.valorUF = '35.000 CLP';
    this.valorDolar = '890 CLP';
  }

  obtenerFrase() {
    const frases = [
      '¡Hoy es un gran día para avanzar!',
      'Nunca dejes de soñar y trabajar por ello.',
      'Cada paso cuenta, sigue adelante.',
      'El éxito es la suma de pequeños esfuerzos diarios.'
    ];
    this.fraseMotivacional = frases[Math.floor(Math.random() * frases.length)];
  }
}
