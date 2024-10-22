import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [],
  templateUrl: './inicio.component.html',
  styleUrl: './inicio.component.scss'
})
export class InicioComponent {

  constructor(private router: Router) {}

  controle(): void {
    this.router.navigate(['/niveis', 'luva']);
  }
  
  ocular(): void {
    this.router.navigate(['/niveis', 'olho']);
  }
  
}
