import { Component, ElementRef, Inject, PLATFORM_ID, AfterViewInit, Renderer2, HostListener } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { ActivatedRoute} from '@angular/router';
import { ApiService } from '../../../../service/blink-events';

@Component({
  selector: 'app-sistema-solar',  
  standalone: true,
  imports: [],
  templateUrl: './sistema-solar.component.html',
  styleUrl: './sistema-solar.component.scss'
})
export class SistemaSolarComponent implements AfterViewInit {
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
    "Mercúrio": "../../../../assets/img/fases/facil/sistema-solar/mercurio.png",
    "Vênus": "../../../../assets/img/fases/facil/sistema-solar/venus.png",
    "Terra": "../../../../assets/img/fases/facil/sistema-solar/terra.png",
    "Marte": "../../../../assets/img/fases/facil/sistema-solar/marte.png",
    "Júpiter": "../../../../assets/img/fases/facil/sistema-solar/jupiter.png",
    "Saturno": "../../../../assets/img/fases/facil/sistema-solar/saturno.png",
    "Urano": "../../../../assets/img/fases/facil/sistema-solar/urano.png",
    "Netuno": "../../../../assets/img/fases/facil/sistema-solar/netuno.png"
  };
  imagemMeteoro: string = "../../../../assets/img/fases/facil/sistema-solar/meteoro.png";
  indicePlanetaAtual: number = 0;
  
  trilhaSonora: HTMLAudioElement | null = null;
  somVitoria: HTMLAudioElement | null = null;
  somDerrota: HTMLAudioElement | null = null;

  blinkData: string[] = [];
  acao: boolean = false;


  constructor(
    private renderer: Renderer2,
    private elementRef: ElementRef,
    @Inject(PLATFORM_ID) private platformId: Object,
    private route: ActivatedRoute,
    private apiService: ApiService
  ) { }

  ngAfterViewInit(): void {
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

      this.chamarService(this.route.snapshot.paramMap.get('tipo') ?? '');

      this.botaoPopupVitoria?.addEventListener('click', () => this.hidePopup());
      this.botaoTentarNovamente?.addEventListener('click', () => this.hidePopup());
      this.botaoSair?.addEventListener('click', () => this.goToHome());

      this.trilhaSonora = new Audio('assets/audio/fases/trilha-sonora-fs1.mp3');
      this.somVitoria = new Audio('assets/audio/conquista/vitoria.mp3');
      this.trilhaSonora.loop = true;
      this.trilhaSonora?.play();

      setInterval(() => this.criarPlaneta(), 2000);
      setInterval(() => this.criarMeteoro(), 5000);
    }
  }

  chamarService(tipo: string): void {
    const apiUrl: string = tipo === 'luva' ?
      'http://localhost:3000/conectado/luva' :
      tipo === 'olho' ?
      'http://localhost:3000/conectado/olho' :
      (() => { console.error('Tipo inválido:', tipo); return ''; })(); // tratamento para tipo inválido
  
    if (!apiUrl) return; // Retorna se apiUrl for vazio (tipo inválido)
  
    this.apiService.getBlinkData(apiUrl).subscribe({
      next: (data: string) => {
        if (!this.acao) {
          this.blinkData.push(data);
          this.subir();
          this.acao = true;
        } else {
          this.blinkData.push(data);
          this.descer();
          this.acao = false;
        }
      },
      error: (error: any) => {
        console.error('Erro ao consumir a API:', error);
      }
    });
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

  criarPlaneta(): void {
    if (this.indicePlanetaAtual === this.ordemPlanetas.length) {
      return;
    }

    let nomePlaneta;
    do {
      nomePlaneta = this.ordemPlanetas[Math.floor(Math.random() * this.ordemPlanetas.length)];
    } while (this.indicePlanetaAtual > 0 && nomePlaneta === this.ordemPlanetas[this.indicePlanetaAtual - 1]);

    let planeta = this.renderer.createElement('div');
    this.renderer.addClass(planeta, 'planeta');
    this.renderer.setStyle(planeta, 'backgroundImage', `url(${this.imagensPlanetas[nomePlaneta]})`);
    this.renderer.setAttribute(planeta, 'data-name', nomePlaneta);
    this.renderer.setStyle(planeta, 'bottom', `${250 + Math.random() * 150}px`);
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
      this.showPopup('lose', 'Você falhou na sua missão, tente novamente.');
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
    window.location.href = '/home';
  }

  resetGame(): void {
    this.vidas = 3;
    this.coracoes.forEach(coracao => coracao.style.display = 'inline-block');
    this.indicePlanetaAtual = 0;
    this.planetasColetados!.innerHTML = '';
    this.trilhaSonora?.play();
  }
}
