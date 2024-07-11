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

  nivelFacil(): void {
    this.router.navigate(['/nivelFacil', this.route.snapshot.paramMap.get('tipo')]);
  }
}
