import { isPlatformBrowser } from '@angular/common';
import { Component, ElementRef, Inject, PLATFORM_ID } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as bootstrap from 'bootstrap';
import { ApiService } from '../../service/blink-events';

@Component({
  selector: 'app-nivel-facil',
  standalone: true,
  imports: [],
  templateUrl: './nivel-facil.component.html',
  styleUrl: './nivel-facil.component.scss'
})
export class NivelFacilComponent {
  private carouselInstance?: bootstrap.Carousel;
  private intervalId?: any;
  private buttons: HTMLElement[] = [];
  blinkData: string[] = [];

  constructor(
    private elementRef: ElementRef,
    @Inject(PLATFORM_ID) private platformId: Object,
    private apiService: ApiService,
    private router: Router,
    private route: ActivatedRoute,
  ) {}

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.initializeCarousel();
      this.startAutoSlide();
    }
  }

  ngOnDestroy(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  private initializeCarousel(): void {
    const carouselElement = this.elementRef.nativeElement.querySelector('.carousel') as HTMLElement;
    if (carouselElement) {
      this.carouselInstance = new bootstrap.Carousel(carouselElement, {
        interval: 3000,
        ride: 'carousel'
      });
    }
  }

  private startAutoSlide(): void {
    this.intervalId = setInterval(() => {
      this.carouselInstance?.next();
    }, 3000); 
  }

  numeros(): void {
    const tipo = this.route.snapshot.paramMap.get('tipo');
    if (tipo) {
      this.router.navigate(['/numeros', tipo]);
    } else {
      console.error('Tipo não encontrado na rota');
    }
  }

}
