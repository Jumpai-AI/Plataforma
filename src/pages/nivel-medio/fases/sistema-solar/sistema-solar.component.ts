import { Component, ElementRef, Inject, PLATFORM_ID, AfterViewInit, Renderer2, HostListener, ViewChild } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../../../service/blink-events';
import { Camera } from '@mediapipe/camera_utils';
import { FaceMesh } from '@mediapipe/face_mesh';
import { BlinkDetectionService } from '../../../../service/BlinkDetectionService';

@Component({
  selector: 'app-sistema-solar',
  standalone: true,
  imports: [],
  templateUrl: './sistema-solar.component.html',
  styleUrl: './sistema-solar.component.scss'
})
export class SistemaSolarComponent implements AfterViewInit {
  @ViewChild('videoElement') videoElement!: ElementRef;
  @ViewChild('canvasElement') canvasElement!: ElementRef;

  private faceMesh!: FaceMesh;
  private camera!: Camera;

  // Other properties...
  personagem: HTMLElement | null = null;
  gameContainer: HTMLElement | null = null;
  coracoes: HTMLElement[] = [];
  vidas: number = 5;
  planetasColetados: HTMLElement | null = null;
  popupVitoria: HTMLElement | null = null;
  popupDerrota: HTMLElement | null = null;
  textoPopupVitoria: HTMLElement | null = null;
  textoPopupDerrota: HTMLElement | null = null;
  botaoPopupVitoria: HTMLElement | null = null;
  botaoTentarNovamente: HTMLElement | null = null;
  botaoSair: HTMLElement | null = null;

  ordemPlanetas: string[] = ["Mercúrio", "Vênus", "Terra", "Marte", "Júpiter", "Saturno", "Urano", "Netuno"];
  imagensPlanetas: { [key: string]: string } = {
    "Mercúrio": "../../../../assets/img/fases/medio/sistema-solar/mercurio.png",
    "Vênus": "../../../../assets/img/fases/medio/sistema-solar/venus.png",
    "Terra": "../../../../assets/img/fases/medio/sistema-solar/terra.png",
    "Marte": "../../../../assets/img/fases/medio/sistema-solar/marte.png",
    "Júpiter": "../../../../assets/img/fases/medio/sistema-solar/jupiter.png",
    "Saturno": "../../../../assets/img/fases/medio/sistema-solar/saturno.png",
    "Urano": "../../../../assets/img/fases/medio/sistema-solar/urano.png",
    "Netuno": "../../../../assets/img/fases/medio/sistema-solar/netuno.png"
  };
  imagemMeteoro: string = "../../../../assets/img/fases/medio/sistema-solar/meteoro.png";
  indicePlanetaAtual: number = 0;

  trilhaSonora: HTMLAudioElement | null = null;
  somVitoria: HTMLAudioElement | null = null;
  somDerrota: HTMLAudioElement | null = null;

  blinkData: string[] = [];
  acao: boolean = false;

  primeiraPiscadaDetectada: boolean = false;

  constructor(
    private blinkDetectionService: BlinkDetectionService,
    private renderer: Renderer2,
    private elementRef: ElementRef,
    @Inject(PLATFORM_ID) private platformId: Object,
    private route: ActivatedRoute,
    private apiService: ApiService,
    private router: Router
  ) {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.initializeFaceMesh();
  }

  private initializeFaceMesh(): void {
    this.faceMesh = new FaceMesh({
      locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`
    });
  
    this.faceMesh.setOptions({
      maxNumFaces: 1,
      refineLandmarks: true,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5
    });
  
    this.faceMesh.onResults(this.onResults.bind(this));
  
    this.camera = new Camera(this.videoElement.nativeElement, {
      onFrame: async () => {
        await this.faceMesh.send({ image: this.videoElement.nativeElement });
      },
      width: 640,
      height: 480
    });
  
    this.camera.start();
    
    // Check element references
    if (isPlatformBrowser(this.platformId)) {
      this.personagem = this.elementRef.nativeElement.querySelector('#personagem');
      this.gameContainer = this.elementRef.nativeElement.querySelector('#game-container');
      this.coracoes = Array.from(this.elementRef.nativeElement.querySelectorAll('.coracao'));
      this.vidas = this.coracoes.length;
      this.planetasColetados = this.elementRef.nativeElement.querySelector('#planetas-coletados');
      this.popupVitoria = this.elementRef.nativeElement.querySelector('#popup-vitoria');
      this.popupDerrota = this.elementRef.nativeElement.querySelector('#popup-derrota');
      this.textoPopupVitoria = this.elementRef.nativeElement.querySelector('#texto-popup-vitoria');
      this.textoPopupDerrota = this.elementRef.nativeElement.querySelector('#texto-popup-derrota');
      this.botaoPopupVitoria = this.elementRef.nativeElement.querySelector('#botao-popup-vitoria');
      this.botaoTentarNovamente = this.elementRef.nativeElement.querySelector('#botao-tentar-novamente');
      this.botaoSair = this.elementRef.nativeElement.querySelector('#botao-sair');
  
      if (this.route.snapshot.paramMap.get('tipo') == 'teclado') {
        this.iniciarGeracaoPlanetas();
      }
  
      this.botaoPopupVitoria?.addEventListener('click', () => this.hidePopup());
      this.botaoTentarNovamente?.addEventListener('click', () => this.hidePopup());
      this.botaoSair?.addEventListener('click', () => this.goToHome());
    }
  }
  
  private onResults(results: any): void {
    if (!this.canvasElement || !this.canvasElement.nativeElement) {
      console.error("Canvas element is not initialized.");
      return;
    }
  
    const canvasCtx = this.canvasElement.nativeElement.getContext('2d');
    canvasCtx.save();
    canvasCtx.clearRect(0, 0, this.canvasElement.nativeElement.width, this.canvasElement.nativeElement.height);
  
    // Draw the video image on the canvas
    canvasCtx.drawImage(
      results.image,
      0,
      0,
      this.canvasElement.nativeElement.width,
      this.canvasElement.nativeElement.height
    );
  
    if (results.multiFaceLandmarks) {
      for (const landmarks of results.multiFaceLandmarks) {
        const leftEyeTop = landmarks[159];
        const leftEyeBottom = landmarks[145];
  
        const leftEyeTopY = leftEyeTop.y * this.canvasElement.nativeElement.height;
        const leftEyeBottomY = leftEyeBottom.y * this.canvasElement.nativeElement.height;
        const currentEyeHeight = leftEyeBottomY - leftEyeTopY;
  
        this.blinkDetectionService.registerEyeHeight(currentEyeHeight);
        const blinkDetected = this.blinkDetectionService.detectBlink(currentEyeHeight);
        if (blinkDetected) {
          if (!this.acao) {
            this.subir();
            this.acao = true;
  
            if (!this.primeiraPiscadaDetectada) {
              this.primeiraPiscadaDetectada = true;
              this.iniciarGeracaoPlanetas();
            }
          } else {
            this.descer();
            this.acao = false;
          }
        }
  
        // Draw a line on the left eye
        canvasCtx.beginPath();
        canvasCtx.moveTo(leftEyeTop.x * this.canvasElement.nativeElement.width, leftEyeTopY);
        canvasCtx.lineTo(leftEyeBottom.x * this.canvasElement.nativeElement.width, leftEyeBottomY);
        canvasCtx.strokeStyle = 'red';
        canvasCtx.lineWidth = 2;
        canvasCtx.stroke();
      }
    }
  
    canvasCtx.restore();
  }
  

  iniciarGeracaoPlanetas(): void {
    setInterval(() => this.criarPlaneta(), 2000);
    setInterval(() => this.criarMeteoro(), 5000);
  }

  @HostListener('window:keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent) {
    if (event.key === 'ArrowUp') {
      event.preventDefault();
      this.subir();
    } else if (event.key === 'ArrowDown') {
      event.preventDefault();
      this.descer();
    }
  }

  subir(): void {
    if (this.personagem) {
      this.animatePersonagem('70%');
    }
  }

  descer(): void {
    if (this.personagem) {
      this.animatePersonagem('50px');
    }
  }

  animatePersonagem(targetPosition: string): void {
    if (this.personagem) {
      this.renderer.setStyle(this.personagem, 'transition', 'bottom 2s');
      this.renderer.setStyle(this.personagem, 'bottom', targetPosition);
    }
  }

  private ultimoPlaneta: string | null = null;

  criarPlaneta(): void {
    const planetasRestantes = this.ordemPlanetas.slice(this.indicePlanetaAtual);
    if (planetasRestantes.length === 0) {
      return;
    }

    const planetasParaEscolher = planetasRestantes.slice(0, 3);
    let nomePlaneta: string;

    if (planetasRestantes.length === 1) {
      nomePlaneta = planetasRestantes[0];
    } else {
      const planetasFiltrados = planetasParaEscolher.filter(nome => nome !== this.ultimoPlaneta);
      nomePlaneta = planetasFiltrados.length === 0 
        ? planetasParaEscolher[Math.floor(Math.random() * planetasParaEscolher.length)] 
        : planetasFiltrados[Math.floor(Math.random() * planetasFiltrados.length)];
    }

    this.ultimoPlaneta = nomePlaneta;

    let planeta = this.renderer.createElement('div');
    this.renderer.addClass(planeta, 'planeta');
    this.renderer.setStyle(planeta, 'backgroundImage', `url(${this.imagensPlanetas[nomePlaneta]})`);
    this.renderer.setAttribute(planeta, 'data-name', nomePlaneta);
    this.renderer.setStyle(planeta, 'bottom', `${500 + Math.random() * 80}px`);
    this.renderer.appendChild(this.gameContainer!, planeta);
    this.moverPlaneta(planeta);
  }

  moverPlaneta(planeta: HTMLElement): void {
    let intervaloPlaneta = setInterval(() => {
      let planetaRight = parseInt(getComputedStyle(planeta).right);
      let personagemBottom = parseInt(getComputedStyle(this.personagem!).bottom);
      let personagemLeft = parseInt(getComputedStyle(this.personagem!).left);
      let personagemRight = personagemLeft + this.personagem!.offsetWidth;
      let planetaLeft = window.innerWidth - planetaRight - 50;
      let planetaTop = parseInt(getComputedStyle(planeta).bottom);
      let planetaBottom = planetaTop + planeta.offsetHeight;

      if (planetaRight >= window.innerWidth) {
        planeta.remove();
        clearInterval(intervaloPlaneta);
      } else {
        planeta.style.right = planetaRight + 5 + 'px';
      }

      if (
        planetaLeft < personagemLeft &&
        planetaLeft + planeta.offsetWidth > personagemLeft &&
        personagemBottom < planetaBottom &&
        personagemBottom + this.personagem!.offsetHeight > planetaTop
      ) {
        let nomePlaneta = planeta.getAttribute('data-name')!;
        if (nomePlaneta === this.ordemPlanetas[this.indicePlanetaAtual]) {
          this.planetasColetados!.innerHTML += `<div><img src="${this.imagensPlanetas[nomePlaneta]}" alt="${nomePlaneta}" width="100%" height="100%"></div>`;
          this.indicePlanetaAtual++;
          this.regenerarVida();

          if (this.indicePlanetaAtual === this.ordemPlanetas.length) {
            this.showPopup('win', 'Parabéns!! Você concluiu sua missão');
          }
        } else {
          this.perderVida();
        }
        planeta.remove();
        clearInterval(intervaloPlaneta);
      }
    }, 20);
  }

  criarMeteoro(): void {
    let meteoro = this.renderer.createElement('div');
    this.renderer.addClass(meteoro, 'meteoro');
    this.renderer.setStyle(meteoro, 'backgroundImage', `url(${this.imagemMeteoro})`);
    this.renderer.setStyle(meteoro, 'bottom', '60px');
    this.renderer.setStyle(meteoro, 'right', '-90px');
    this.renderer.appendChild(this.gameContainer!, meteoro);
    this.moverMeteoro(meteoro);
  }

  moverMeteoro(meteoro: HTMLElement): void {
    let intervaloMeteoro = setInterval(() => {
      let meteoroRight = parseInt(getComputedStyle(meteoro).right);
      let personagemBottom = parseInt(getComputedStyle(this.personagem!).bottom);
      let personagemLeft = parseInt(getComputedStyle(this.personagem!).left);
      let meteoroLeft = window.innerWidth - meteoroRight - 50;

      if (meteoroRight >= window.innerWidth) {
        meteoro.remove();
        clearInterval(intervaloMeteoro);
      } else {
        meteoro.style.right = meteoroRight + 5 + 'px';
      }

      if (
        meteoroLeft < personagemLeft + this.personagem!.offsetWidth &&
        meteoroLeft + meteoro.offsetWidth > personagemLeft &&
        personagemBottom < 100
      ) {
        this.perderVida();
        meteoro.remove();
        clearInterval(intervaloMeteoro);
      }
    }, 20);
  }

  perderVida(): void {
    if (this.vidas > 0) {
      this.vidas--;
      this.coracoes[this.vidas].style.display = 'none';
    }
    if (this.vidas === 0) {
      // Handle game over scenario
    }
  }

  regenerarVida(): void {
    if (this.vidas < 3) {
      this.coracoes[this.vidas].style.display = 'inline-block';
      this.vidas++;
    }
  }

  showPopup(status: 'win' | 'lose', message: string): void {
    if (status === 'win') {
      this.textoPopupVitoria!.textContent = message;
      this.popupVitoria!.style.display = 'block';
      this.somVitoria?.play();
    } else {
      this.textoPopupDerrota!.textContent = message;
      this.popupDerrota!.style.display = 'block';
    }
    this.trilhaSonora?.pause();
  }

  hidePopup(): void {
    this.popupVitoria!.style.display = 'none';
    this.popupDerrota!.style.display = 'none';
    this.resetGame();
  }

  goToHome(): void {
    this.router.navigate(['',]);
  }

  resetGame(): void {
    this.vidas = 5;
    this.coracoes.forEach(coracao => coracao.style.display = 'inline-block');
    this.indicePlanetaAtual = 0;
    this.planetasColetados!.innerHTML = '';
    this.trilhaSonora?.play();
  }
}
