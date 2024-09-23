import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-calibragem-olho',
  templateUrl: './calibragem-olho.component.html',
  styleUrls: ['./calibragem-olho.component.scss']
})
export class CalibragemOlhoComponent implements OnInit {
  countdownValue = 10;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.startCountdown();
  }

  startCountdown(): void {
    const countdownInterval = setInterval(() => {
      this.countdownValue--;

      if (this.countdownValue === 0) {
        clearInterval(countdownInterval);
        this.router.navigate(['/fases', 'olho']); 
      }
    }, 1000);
  }
}
