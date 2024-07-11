import { NgFor } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-nivel-facil',
  standalone: true,
  imports: [],
  templateUrl: './nivel-facil.component.html',
  styleUrl: './nivel-facil.component.scss'
})
export class NivelFacilComponent {
  
  constructor(private router: Router, private route: ActivatedRoute) {}

  sistemaSolar(): void {
    this.router.navigate(['/sistema-solar', this.route.snapshot.paramMap.get('tipo')]);
  }
}
