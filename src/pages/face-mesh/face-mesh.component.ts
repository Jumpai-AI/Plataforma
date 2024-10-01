import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { FaceMesh } from '@mediapipe/face_mesh';
import { Camera } from '@mediapipe/camera_utils';
import { BlinkDetectionService } from '../../service/BlinkDetectionService';

@Component({
  selector: 'app-face-mesh',
  templateUrl: './face-mesh.component.html',
  styleUrl: './face-mesh.component.scss'
})

export class FaceMeshComponent implements OnInit, AfterViewInit {
  @ViewChild('videoElement') videoElement!: ElementRef;
  @ViewChild('canvasElement') canvasElement!: ElementRef;
  private faceMesh!: FaceMesh;
  private camera!: Camera;

  constructor(private blinkDetectionService: BlinkDetectionService) {} // Injeta o serviço

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.initializeFaceMesh();
  }

  private initializeFaceMesh(): void {
    this.faceMesh = new FaceMesh({
      locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`
    });

    this.faceMesh.setOptions({
      maxNumFaces: 1, // Rastrear apenas um rosto
      refineLandmarks: true, // Mais precisão nos pontos da face
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
  }

  private onResults(results: any): void {
    const canvasCtx = this.canvasElement.nativeElement.getContext('2d');
    canvasCtx.save();
    canvasCtx.clearRect(0, 0, this.canvasElement.nativeElement.width, this.canvasElement.nativeElement.height);

    // Desenha a imagem do vídeo na tela
    canvasCtx.drawImage(
      results.image,
      0,
      0,
      this.canvasElement.nativeElement.width,
      this.canvasElement.nativeElement.height
    );

    if (results.multiFaceLandmarks) {
      for (const landmarks of results.multiFaceLandmarks) {
        // Pegando os pontos mais alto e mais baixo do olho esquerdo
        const leftEyeTop = landmarks[159]; // Ponto mais alto do olho esquerdo
        const leftEyeBottom = landmarks[145]; // Ponto mais baixo do olho esquerdo

        // Convertendo as coordenadas normalizadas para coordenadas no canvas
        const leftEyeTopY = leftEyeTop.y * this.canvasElement.nativeElement.height;
        const leftEyeBottomY = leftEyeBottom.y * this.canvasElement.nativeElement.height;

        // Calculando a altura do olho (distância entre o ponto mais alto e o mais baixo)
        const currentEyeHeight = leftEyeBottomY - leftEyeTopY;

        // Registrar a altura inicial do olho, se necessário
        this.blinkDetectionService.registerEyeHeight(currentEyeHeight);

        // Verificar piscada
        const blinkDetected = this.blinkDetectionService.detectBlink(currentEyeHeight);
        if (blinkDetected) {
          // Aqui você pode adicionar ações específicas quando uma piscada for detectada
        }

        // Desenhar uma linha no olho esquerdo
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
}
