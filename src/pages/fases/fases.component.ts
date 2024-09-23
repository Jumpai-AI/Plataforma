import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-fases',
  standalone: true,
  imports: [],
  templateUrl: './fases.component.html',
  styleUrl: './fases.component.scss'
})
export class FasesComponent {

  constructor(private router: Router, private route: ActivatedRoute) {}
  
  dificuldade(): void {
    this.router.navigate(['/dificuldade', this.route.snapshot.paramMap.get('tipo')]);
  }

}
