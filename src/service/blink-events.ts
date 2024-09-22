import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private eventSource: EventSource | null = null;
  private dataSubject: Subject<any> = new Subject<any>();

  constructor() { }

  getBlinkData(api: string): Observable<any> {
    if (!this.eventSource || this.eventSource.url !== api) {
      this.createEventSource(api);
    }

    return this.dataSubject.asObservable();
  }

  private createEventSource(api: string): void {
    if (this.eventSource) {
      this.eventSource.close();
    }

    this.eventSource = new EventSource(api);

    this.eventSource.onmessage = (event) => {
      this.dataSubject.next(event.data);
    };

    this.eventSource.onerror = (error) => {
      this.dataSubject.error(error);
      this.eventSource?.close();
    };
  }

  // Novo método para fechar a conexão
  closeConnection(): void {
    if (this.eventSource) {
      this.eventSource.close();
      this.eventSource = null;
    }
  }
}
