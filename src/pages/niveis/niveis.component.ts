import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-niveis',
  standalone: true,
  imports: [],
  templateUrl: './niveis.component.html',
  styleUrl: './niveis.component.scss'
})

export class NiveisComponent {


  constructor(private router: Router, private route: ActivatedRoute) {}

  nivelMedio(): void {
    this.router.navigate(['/nivelMedio', this.route.snapshot.paramMap.get('tipo')]);
  }
}
