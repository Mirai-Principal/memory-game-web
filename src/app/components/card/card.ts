import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-card',
  imports: [],
  templateUrl: './card.html',
  styleUrl: './card.css',
})
export class Card {
  /** Ruta de la imagen que se muestra al descubrir la carta */
  readonly imageSrc = input.required<string>();

  /** Texto alternativo para accesibilidad */
  readonly altText = input<string>('Carta Frizac');

  /** Si la carta está volteada boca arriba */
  readonly flipped = input<boolean>(false);

  /** Si la carta ya ha sido emparejada */
  readonly matched = input<boolean>(false);

  /** Si la carta está deshabilitada para interacción */
  readonly disabled = input<boolean>(false);

  /** Si la carta se encuentra en estado de error (no coincidió) */
  readonly hasError = input<boolean>(false);

  /** Emite cuando el usuario hace clic en la carta */
  readonly cardClick = output<void>();

  onCardClick(): void {
    if (!this.disabled() && !this.flipped() && !this.matched()) {
      this.cardClick.emit();
    }
  }
}
