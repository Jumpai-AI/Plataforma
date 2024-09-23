import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-calibragem-olho',
  templateUrl: './calibragem-luva.component.html',
  styleUrls: ['./calibragem-luva.component.scss']
})
export class CalibragemLuvaComponent implements OnInit {
  loadingProgress = 0;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.startLoading();
  }

  startLoading() {
    const interval = setInterval(() => {
      if (this.loadingProgress < 100) {
        this.loadingProgress += 10;
      } else {
        clearInterval(interval);
        this.router.navigate(['/fases', 'luva']);
      }
    }, 1000); 
  }
}
