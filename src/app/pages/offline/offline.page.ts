import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-offline',
  templateUrl: './offline.page.html',
  styleUrls: ['./offline.page.scss'],
  standalone:false,
})
export class OfflinePage implements OnInit {
  tareasOffline: any[] = [];

  constructor(private storage: Storage, private router: Router) {}

  async ngOnInit() {
    this.tareasOffline = await this.storage.get('misTareas') || [];
  }

  volverOnline() {
    if (navigator.onLine) {
      this.router.navigate(['/home']);
    } else {
      alert('Sin conexión todavía.');
    }
  }
}
