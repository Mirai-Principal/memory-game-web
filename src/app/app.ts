import { Component, signal } from '@angular/core';
import { ButtonComponent } from './components/button/button';

export type GameScreen = 'inicio' | 'juego';

@Component({
  selector: 'app-root',
  imports: [ButtonComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('Aprende con Frizac');
  protected readonly currentScreen = signal<GameScreen>('inicio');

  onStartGame(): void {
    this.currentScreen.set('juego');
  }
}
