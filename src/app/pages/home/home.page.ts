import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { AlertController, ModalController, AnimationController } from '@ionic/angular';
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
  @ViewChild('cardClima', { read: ElementRef }) cardClima!: ElementRef;
  @ViewChild('cardFinanzas', { read: ElementRef }) cardFinanzas!: ElementRef;
  @ViewChild('cardFrase', { read: ElementRef }) cardFrase!: ElementRef;

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
    eventContent: (arg) => {
      const starEl = document.createElement('span');
      starEl.textContent = '★ ';
      starEl.style.color = '#ffc107';
      starEl.style.marginRight = '4px';
      starEl.style.fontWeight = 'bold';
      starEl.style.fontSize = '1.1em';

      const textEl = document.createElement('span');
      textEl.textContent = arg.event.title;
      textEl.style.fontWeight = '600';
      textEl.style.fontSize = '0.9em';
      textEl.style.color = '#1c728e';
      textEl.style.whiteSpace = 'nowrap';
      textEl.style.overflow = 'hidden';
      textEl.style.textOverflow = 'ellipsis';

      return { domNodes: [starEl, textEl] };
    },
    events: []
  };

  posts: any[] = [];
  climaCiudad = 'Santiago';
  climaTemp = '';
  climaDesc = '';
  valorUF = '';
  valorDolar = '';
  fraseMotivacional = '';

  constructor(
    private alertCtrl: AlertController,
    private modalCtrl: ModalController,
    private storage: Storage,
    private api: ApiService,
    private animationCtrl: AnimationController
  ) {}

  async ngOnInit() {
    await this.storage.create();
    this.climaCiudad = (await this.storage.get('ciudad')) || 'Santiago';
    this.cargarEventos();
    this.cargarAPI();
    this.obtenerFrase();
    await this.obtenerClimaDesdeUbicacion();
    await this.obtenerEconomia();

    // Refrescar economía cada 30 minutos
    setInterval(() => this.obtenerEconomia(), 1000 * 60 * 30);
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.animarCard(this.cardClima);
      this.animarCard(this.cardFinanzas);
      this.animarCard(this.cardFrase);
    }, 300);
  }

  animarCard(el: ElementRef) {
    this.animationCtrl.create()
      .addElement(el.nativeElement)
      .duration(500)
      .easing('ease-in-out')
      .fromTo('opacity', '0', '1')
      .fromTo('transform', 'translateY(20px)', 'translateY(0)')
      .play();
  }

  enterAnimation = (baseEl: HTMLElement) => {
    const backdrop = baseEl.shadowRoot?.querySelector('ion-backdrop');
    const wrapper = baseEl.shadowRoot?.querySelector('.modal-wrapper');
    const backdropAnim = this.animationCtrl.create()
      .addElement(backdrop || baseEl)
      .fromTo('opacity', '0.01', 'var(--backdrop-opacity)');
    const wrapperAnim = this.animationCtrl.create()
      .addElement(wrapper || baseEl)
      .keyframes([
        { offset: 0, opacity: '0', transform: 'scale(0.8)' },
        { offset: 1, opacity: '1', transform: 'scale(1)' }
      ]);
    return this.animationCtrl.create()
      .addElement(baseEl)
      .duration(400)
      .easing('ease-out')
      .addAnimation([backdropAnim, wrapperAnim]);
  };

  leaveAnimation = (baseEl: HTMLElement) => this.enterAnimation(baseEl).direction('reverse');

  async onDateClick(arg: any) {
    const modal = await this.modalCtrl.create({
      component: EventModalComponent,
      componentProps: { date: arg.dateStr },
      enterAnimation: this.enterAnimation,
      leaveAnimation: this.leaveAnimation
    });

    modal.onDidDismiss().then(async (res) => {
      if (res.data) {
        const data = res.data;
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
        this.calendarOptions = { ...this.calendarOptions, events: actualizados };
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
📍 Ubicación: ${props.ubicacion || '—'}
📝 Notas: ${props.notas || '—'}
🔁 Repetir: ${props.repetir || '—'}
⏰ Desde: ${new Date(evento.start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}
⏳ Hasta: ${new Date(evento.end).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}
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
    this.calendarOptions = { ...this.calendarOptions, events: actualizados };
    await this.storage.set('eventos', actualizados);
  }

  async cargarEventos() {
    const guardados = await this.storage.get('eventos');
    if (guardados) {
      this.calendarOptions = {
        ...this.calendarOptions,
        events: guardados,
      };
    }
  }

  cargarAPI() {
    this.api.getTareas().subscribe(
      (data: any) => {
        this.posts = data;
        this.storage.set('posts', this.posts);
      },
      async (error: any) => {
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
      if (!lat || !lon) { lat = -33.45; lon = -70.66; }
      const resp = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`);
      const data = await resp.json();
      this.climaTemp = data.current_weather?.temperature;
      this.climaDesc = 'Despejado';
    } catch {
      this.climaTemp = '';
      this.climaDesc = 'No disponible';
    }
  }

  async obtenerEconomia() {
    try {
      const data = await this.api.getIndicadoresEconomicos().toPromise();
      this.valorUF = `${data.uf.valor.toLocaleString('es-CL')} CLP`;
      this.valorDolar = `${data.dolar.valor.toLocaleString('es-CL')} CLP`;
      await this.storage.set('valorUF', this.valorUF);
      await this.storage.set('valorDolar', this.valorDolar);
    } catch (error) {
      console.error('Error al obtener economía', error);
      this.valorUF = await this.storage.get('valorUF') || 'No disponible';
      this.valorDolar = await this.storage.get('valorDolar') || 'No disponible';
    }
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
