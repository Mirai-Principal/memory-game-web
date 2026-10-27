import { Component, computed, signal } from '@angular/core';
import { ButtonComponent } from './components/button/button';
import { Card } from './components/card/card';
import { MensajeModal } from './components/mensaje-modal/mensaje-modal';
import { Consejos } from './components/consejos/consejos';
import { CONSEJOS_DATA, ConsejoItem } from './data/consejos.data';

export type GameScreen = 'inicio' | 'juego';

export interface MemoryCard {
  id: number;
  imageId: number;
  imageSrc: string;
  flipped: boolean;
  matched: boolean;
  hasError?: boolean;
}

@Component({
  selector: 'app-root',
  imports: [ButtonComponent, Card, MensajeModal, Consejos],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('Aprende con Frizac');
  protected readonly currentScreen = signal<GameScreen>('inicio');

  // Modales
  protected readonly showStartModal = signal<boolean>(false);
  protected readonly showConsejosModal = signal<boolean>(false);
  protected readonly currentMatchConsejo = signal<ConsejoItem | null>(null);
  protected readonly showVictoryModal = signal<boolean>(false);

  // Estado del juego
  protected readonly cards = signal<MemoryCard[]>([]);
  protected readonly moves = signal<number>(0);
  protected readonly matchedPairs = signal<number>(0);
  protected readonly isChecking = signal<boolean>(false);

  // Estado de pantalla completa
  protected readonly isFullscreen = signal<boolean>(false);

  constructor() {
    if (typeof document !== 'undefined') {
      const updateState = () => {
        const active = !!(
          document.fullscreenElement ||
          (document as any).webkitFullscreenElement ||
          (document as any).mozFullScreenElement ||
          (document as any).msFullscreenElement
        );
        this.isFullscreen.set(active);
      };

      document.addEventListener('fullscreenchange', updateState);
      document.addEventListener('webkitfullscreenchange', updateState);
      document.addEventListener('mozfullscreenchange', updateState);
      document.addEventListener('MSFullscreenChange', updateState);
    }
  }

  /**
   * Alterna entre el modo pantalla completa y normal
   */
  toggleFullscreen(): void {
    if (typeof document === 'undefined') return;

    const doc = document as any;
    const docEl = document.documentElement as any;

    const isFull = !!(
      doc.fullscreenElement ||
      doc.webkitFullscreenElement ||
      doc.mozFullScreenElement ||
      doc.msFullscreenElement
    );

    if (!isFull) {
      if (docEl.requestFullscreen) {
        docEl.requestFullscreen().catch((err: any) => console.warn('Error al activar fullscreen:', err));
      } else if (docEl.webkitRequestFullscreen) {
        docEl.webkitRequestFullscreen();
      } else if (docEl.mozRequestFullScreen) {
        docEl.mozRequestFullScreen();
      } else if (docEl.msRequestFullscreen) {
        docEl.msRequestFullscreen();
      }
    } else {
      if (doc.exitFullscreen) {
        doc.exitFullscreen().catch((err: any) => console.warn('Error al salir de fullscreen:', err));
      } else if (doc.webkitExitFullscreen) {
        doc.webkitExitFullscreen();
      } else if (doc.mozCancelFullScreen) {
        doc.mozCancelFullScreen();
      } else if (doc.msExitFullscreen) {
        doc.msExitFullscreen();
      }
    }
  }

  private selectedCards: MemoryCard[] = [];

  /**
   * Abre el modal informativo previo al inicio del juego
   */
  openStartModal(): void {
    this.showStartModal.set(true);
  }

  /**
   * Cierra el modal de inicio sin empezar la partida
   */
  closeStartModal(): void {
    this.showStartModal.set(false);
  }

  /**
   * Cierra el modal de inicio y arranca la partida
   */
  onStartFromModal(): void {
    this.showStartModal.set(false);
    this.startGame();
  }

  /**
   * Abre el modal con los consejos de cuidado
   */
  openConsejosModal(): void {
    this.showConsejosModal.set(true);
  }

  /**
   * Cierra el modal de consejos de cuidado
   */
  closeConsejosModal(): void {
    this.showConsejosModal.set(false);
  }

  /**
   * Helper genérico para reproducir efectos de sonido
   */
  private playSound(name: string): void {
    try {
      const audio = new Audio(`sounds/${name}.wav`);
      audio.currentTime = 0;
      audio.play().catch(err => {
        console.warn(`Audio ${name}.wav no pudo reproducirse:`, err);
      });
    } catch (e) {
      console.warn(`Error al inicializar audio ${name}.wav:`, e);
    }
  }

  /**
   * Reproduce el sonido al voltear una carta
   */
  private playFlipSound(): void {
    this.playSound('flip');
  }

  /**
   * Reproduce el sonido de coincidencia
   */
  private playMatchSound(): void {
    this.playSound('match');
  }

  /**
   * Reproduce el sonido de error cuando no coinciden
   */
  private playErrorSound(): void {
    this.playSound('error');
  }

  /**
   * Reproduce el sonido de victoria
   */
  private playWinSound(): void {
    this.playSound('win');
  }

  /**
   * Inicia o reinicia una partida barajando las cartas en orden aleatorio
   */
  startGame(): void {
    const cardImages = [1, 2, 3, 4, 5, 6];
    // Exactamente 2 copias de cada imagen para 6 parejas (12 cartas en total)
    const paired = [...cardImages, ...cardImages];

    // Algoritmo Fisher-Yates para barajar aleatoriamente
    for (let i = paired.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [paired[i], paired[j]] = [paired[j], paired[i]];
    }

    const initialCards: MemoryCard[] = paired.map((imageId, index) => ({
      id: index,
      imageId,
      imageSrc: `images/img_cards/${imageId}.png`,
      flipped: false,
      matched: false,
      hasError: false
    }));

    this.cards.set(initialCards);
    this.moves.set(0);
    this.matchedPairs.set(0);
    this.isChecking.set(false);
    this.selectedCards = [];
    this.currentMatchConsejo.set(null);
    this.showVictoryModal.set(false);
    this.currentScreen.set('juego');
  }

  /**
   * Maneja el clic en una carta de la cuadrícula
   */
  onCardClick(clickedCard: MemoryCard): void {
    // Si estamos comparando o la carta ya está descubierta / emparejada, ignorar
    if (this.isChecking() || clickedCard.flipped || clickedCard.matched) {
      return;
    }

    // Sonido de volteo al tocar la carta
    this.playFlipSound();

    // Voltear la carta seleccionada
    this.updateCardState(clickedCard.id, { flipped: true });
    this.selectedCards.push(clickedCard);

    // Si es la segunda carta descubierta en el turno, verificar coincidencia
    if (this.selectedCards.length === 2) {
      this.moves.update(m => m + 1);
      this.isChecking.set(true);

      const [first, second] = this.selectedCards;

      if (first.imageId === second.imageId) {
        // ¡Pareja correcta encontrada!
        // Al terminar el volteo de la 2da carta, reproducir match.wav y activar estrellas/desaparición
        setTimeout(() => {
          this.playMatchSound();
          this.updateCardState(first.id, { matched: true, hasError: false });
          this.updateCardState(second.id, { matched: true, hasError: false });
          this.matchedPairs.update(p => p + 1);
          this.selectedCards = [];
          this.isChecking.set(false);

          // Mostrar mensaje con el consejo específico para este número
          const consejo = CONSEJOS_DATA.find(c => c.numero === first.imageId);
          if (consejo) {
            setTimeout(() => {
              this.currentMatchConsejo.set(consejo);
            }, 450);
          }
        }, 350);
      } else {
        // No coinciden: sonido de error y temblor visual
        setTimeout(() => {
          this.playErrorSound();
          this.updateCardState(first.id, { hasError: true });
          this.updateCardState(second.id, { hasError: true });
        }, 320);

        // Volver a ocultar tras mostrar el error
        setTimeout(() => {
          this.updateCardState(first.id, { flipped: false, hasError: false });
          this.updateCardState(second.id, { flipped: false, hasError: false });
          this.selectedCards = [];
          this.isChecking.set(false);
        }, 950);
      }
    }
  }

  /**
   * Cierra el modal de consejo de la pareja encontrada.
   * Si era la última pareja, muestra la pantalla de victoria.
   */
  closeMatchModal(): void {
    this.currentMatchConsejo.set(null);
    if (this.matchedPairs() === 6) {
      setTimeout(() => {
        this.playWinSound();
        this.showVictoryModal.set(true);
      }, 350);
    }
  }

  private updateCardState(id: number, patch: Partial<MemoryCard>): void {
    this.cards.update(list =>
      list.map(c => (c.id === id ? { ...c, ...patch } : c))
    );
  }

  goToHome(): void {
    this.currentMatchConsejo.set(null);
    this.showVictoryModal.set(false);
    this.currentScreen.set('inicio');
  }
}
