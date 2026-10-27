import { Component, input } from '@angular/core';

@Component({
  selector: 'app-card-consejo',
  imports: [],
  templateUrl: './card-consejo.html',
  styleUrl: './card-consejo.css',
})
export class CardConsejo {
  /** Número de orden del consejo */
  readonly numero = input<number | string>(1);

  /** Ruta de la imagen del producto / ilustración */
  readonly imageSrc = input<string>('images/img_cards/1.png');

  /** Texto alternativo para la imagen */
  readonly imageAlt = input<string>('Ilustración consejo');

  /** Texto de la descripción o recomendación */
  readonly descripcion = input<string>('');

  /** Color del círculo con el número */
  readonly badgeColor = input<string>('#4DB748');
}
