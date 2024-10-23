import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class BlinkDetectionService {
  private fixedEyeHeight!: number;
  private blinkRegistered = false;

  constructor() { }

  // Método para registrar a altura fixa do olho
  public registerEyeHeight(currentEyeHeight: number): void {
    if (!this.fixedEyeHeight) {
      this.fixedEyeHeight = currentEyeHeight / 4;
      console.log('Altura registrada do olho:', this.fixedEyeHeight);
    }
  }

  // Método para verificar piscada
  public detectBlink(currentEyeHeight: number): boolean {
    if (currentEyeHeight < this.fixedEyeHeight && !this.blinkRegistered) {
      this.blinkRegistered = true; // Registrar piscada
      console.log('pisquei');
      return true; // Retorna verdadeiro indicando que piscou
    }

    // Se a altura do olho for maior ou igual ao valor fixo, resetar o estado de piscada
    if (currentEyeHeight >= this.fixedEyeHeight && this.blinkRegistered) {
      this.blinkRegistered = false; // Resetar para permitir outra piscada
    }

    return false; // Retorna falso se não houver piscada
  }
}