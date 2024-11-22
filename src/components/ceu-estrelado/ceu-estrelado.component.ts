import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-ceu-estrelado',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ceu-estrelado.component.html',
  styleUrls: ['./ceu-estrelado.component.scss']
})
export class CeuEstreladoComponent {
  estrelas: { top: number; left: number; delay: number; size: number }[] = [];

  ngOnInit(): void {
    this.gerarEstrelas(30); // Número de estrelas
  }

  gerarEstrelas(quantidade: number): void {
    for (let i = 0; i < quantidade; i++) {
      const tamanhos = [4, 8, 12]; // Tamanhos 
      const tamanhoAleatorio = tamanhos[Math.floor(Math.random() * tamanhos.length)];

      // Pontos aleatórios no canto
      const { top, left } = this.gerarCoordenadasConcentradas();

      this.estrelas.push({
        top,
        left,
        delay: Math.random() * 10, //"atrasa" a animação
        size: tamanhoAleatorio
      });
    }
  }

  gerarCoordenadasConcentradas(): { top: number; left: number } {
    // Define o centro da tela
    const centroX = 50;
    const centroY = 50;
    let top: number, left: number, distanciaDoCentro: number;

    do {
      top = Math.random() * 100;
      left = Math.random() * 100;

      // Calcula a distância do ponto para o centro
      distanciaDoCentro = Math.sqrt(
        Math.pow(top - centroY, 2) + Math.pow(left - centroX, 2)
      );

      // Mantém apenas estrelas com distância maior do que 20% (afastadas do centro)
    } while (distanciaDoCentro < 20);

    return { top, left };
  }
}
