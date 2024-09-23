import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-dificuldade',
  standalone: true,
  imports: [],
  templateUrl: './dificuldade.component.html',
  styleUrl: './dificuldade.component.scss'
})
export class DificuldadeComponent {

  constructor(private router: Router, private route: ActivatedRoute) {}
  
  sistemasolar(): void {
    this.router.navigate(['/sistema-solar', this.route.snapshot.paramMap.get('tipo')]);
  }
}
