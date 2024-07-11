import { NgFor } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-nivel-medio',
  standalone: true,
  imports: [],
  templateUrl: './nivel-medio.component.html',
  styleUrl: './nivel-medio.component.scss'
})
export class NivelMedioComponent {
  
  constructor(private router: Router, private route: ActivatedRoute) {}

  sistemaSolar(): void {
    this.router.navigate(['/sistema-solar', this.route.snapshot.paramMap.get('tipo')]);
  }
}
