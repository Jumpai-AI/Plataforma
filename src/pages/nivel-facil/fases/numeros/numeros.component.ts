import { CommonModule } from '@angular/common';
import { Component, Inject, PLATFORM_ID, OnInit, OnDestroy } from '@angular/core';
import { ApiService } from '../../../../service/blink-events';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-numeros',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './numeros.component.html',
  styleUrls: ['./numeros.component.scss']
})
export class NumerosComponent implements OnInit, OnDestroy {
  questions: any[] = [];
  currentQuestionIndex = 0;
  currentQuestion: any;
  score = 0;
  numQuestions = 10;
  selectedAnswer: number | null = null;
  correctAnswer: number | null = null;
  intervalId: number | null = null;
  buttonIds: string[] = [];
  blinkData: string[] = [];
  private currentIndex = 0;

  private readonly apiUrls = {
    luva: 'http://localhost:3000/conectado/luva',
    olho: 'http://localhost:3000/conectado/olho',
  };

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private route: ActivatedRoute,
    private apiService: ApiService,
  ) {}

  ngOnInit(): void {
    this.initializeQuiz();
  }

  ngOnDestroy(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  private initializeQuiz(): void {
    this.generateQuestions();
    this.currentQuestion = this.questions[this.currentQuestionIndex];
    this.loadBlinkData();
  }

  private loadBlinkData(): void {
    const tipo = this.route.snapshot.paramMap.get('tipo') ?? '';
    const apiUrl = this.apiUrls[tipo as keyof typeof this.apiUrls];

    if (apiUrl && tipo !== 'teclado') {
      this.startButtonSelection();
      this.chamarService(tipo);
    }
  }

  chamarService(tipo: string): void {
    const apiUrl: string = tipo === 'luva' ?
      'http://localhost:3000/conectado/luva' :
      tipo === 'olho' ?
      'http://localhost:3000/conectado/olho' :
      (() => { console.error('Tipo inválido:', tipo); return ''; })(); 
  
    if (!apiUrl) return;
  
    this.apiService.getBlinkData(apiUrl).subscribe({
      next: (data: string) => {
        this.blinkData.push(data);
        this.clickButton()
      },
      error: (error: any) => {
        console.error('Erro ao consumir a API:', error);
      }
    });
  }

  private generateQuestions(): void {
    this.questions = Array.from({ length: this.numQuestions }, () => {
      const isAddition = Math.random() > 0.5;
      const [num1, num2] = this.getRandomNumbers();
      const question = isAddition ? `${num1} + ${num2}` : `${num1} - ${num2}`;
      const correct = isAddition ? num1 + num2 : num1 - num2;
      const answers = this.generateAnswers(correct);

      return { question, answers, correct };
    });
  }

  private getRandomNumbers(): [number, number] {
    let num1 = Math.floor(Math.random() * 20) + 1;
    let num2 = Math.floor(Math.random() * 20) + 1;

    if (num1 < num2) [num1, num2] = [num2, num1];
    return [num1, num2];
  }

  private generateAnswers(correct: number): number[] {
    const answers = new Set<number>();
    answers.add(correct);

    while (answers.size < 4) {
      const randomAnswer = Math.floor(Math.random() * 40) - 10;
      if (randomAnswer >= 0 && randomAnswer !== correct) {
        answers.add(randomAnswer);
      }
    }

    return Array.from(answers).sort((a, b) => a - b);
  }

  checkAnswer(answer: number): void {
    this.selectedAnswer = answer;
    this.correctAnswer = this.currentQuestion.correct;

    if (answer === this.currentQuestion.correct) {
      this.score += 10;
    }

    setTimeout(() => this.nextQuestion(), 1000);
  }

  private nextQuestion(): void {
    if (++this.currentQuestionIndex < this.questions.length) {
      this.currentQuestion = this.questions[this.currentQuestionIndex];
      if (this.route.snapshot.paramMap.get('tipo') !== 'teclado') {
        this.startButtonSelection();
      }
      this.resetSelection();
    } else {
      alert('Quiz terminado! Pontuação final: ' + this.score);
      this.resetQuiz();
    }
  }

  private resetQuiz(): void {
    this.initializeQuiz();
  }

  private resetSelection(): void {
    this.selectedAnswer = null;
    this.correctAnswer = null;
  }

  getButtonId(answer: number): string {
    return `button-${answer}`;
  }

  private startButtonSelection(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }

    this.buttonIds = this.currentQuestion.answers.map(this.getButtonId.bind(this));

    this.intervalId = window.setInterval(() => {
      if (this.buttonIds.length === 0) return;

      this.buttonIds.forEach(id => document.getElementById(id)?.classList.remove('selected'));

      const currentButton = document.getElementById(this.buttonIds[this.currentIndex]);
      currentButton?.classList.add('selected');

      this.currentIndex = (this.currentIndex + 1) % this.buttonIds.length;
    }, 2500);
  }

  private clickButton(): void {
    if (this.buttonIds.length === 0) return;

    setTimeout(() => {
      const buttonId = this.buttonIds[this.currentIndex - 1];
      document.getElementById(buttonId)?.click();
    }, 0);
  }
}
