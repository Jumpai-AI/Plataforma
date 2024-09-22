import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../service/blink-events';

@Component({
  selector: 'app-calibragem',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './calibragem.component.html',
  styleUrls: ['./calibragem.component.scss']
})
export class CalibragemComponent {
  blinkData: any[] = [];
  progresso: number = 0;
  apiUrl: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private apiService: ApiService 
  ) {
    this.initialize();
  }

  initialize(): void {
    const tipo = this.route.snapshot.paramMap.get('tipo');
    console.log('Tipo obtido:', tipo); 
    if (tipo === 'luva' || tipo === 'olho') {
      this.chamarService(tipo);
    } else {
      console.error('Tipo inválido:', tipo); 
    }
  }

  chamarService(tipo: string): void {
    let apiUrl: string;

    switch (tipo) {
      case 'luva':
        apiUrl = 'http://localhost:3000/conectado/luva';
        break;
      case 'olho':
        apiUrl = 'http://localhost:3000/conectado/olho';
        break;
      default:
        console.error('Tipo inválido:', tipo);
        return;
    }

    console.log('URL da API:', apiUrl); 
    this.apiService.getBlinkData(apiUrl).subscribe({
      next: (data: string) => {
        this.blinkData.push(data);
        console.log('Dados recebidos:', data); 
      },
      error: (error: any) => {
        console.error('Erro ao consumir a API:', error); 
      }
    });
  }
}