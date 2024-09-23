import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [],
  templateUrl: './inicio.component.html',
  styleUrl: './inicio.component.scss'
})
export class InicioComponent {

  constructor(private router: Router) {}

  controle(): void {
    this.router.navigate(['/calibragem-luva']);
  }
  
  ocular(): void {
    this.router.navigate(['/calibragem-olho']);
  }
  
}
