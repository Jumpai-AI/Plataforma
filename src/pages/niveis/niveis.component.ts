import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../service/blink-events';

@Component({
  selector: 'app-niveis',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './niveis.component.html',
  styleUrls: ['./niveis.component.scss']
})
export class NiveisComponent {
  blinkData: any[] = [];
  progresso: number = 0;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private apiService: ApiService 
  ) {}

  nivelMedio(): void {
    this.router.navigate(['/nivelMedio', this.route.snapshot.paramMap.get('tipo')]);
  }

  nivelFacil(): void {
    this.router.navigate(['/nivelFacil', this.route.snapshot.paramMap.get('tipo')]);
  }

}
