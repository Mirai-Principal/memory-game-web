import { Component, input, output } from '@angular/core';
import { ButtonComponent } from '../button/button';

@Component({
  selector: 'app-mensaje-modal',
  imports: [ButtonComponent],
  templateUrl: './mensaje-modal.html',
  styleUrl: './mensaje-modal.css',
})
export class MensajeModal {
  /** Título principal del modal */
  readonly title = input<string>('');

  /** Subtítulo o texto explicativo */
  readonly subtitle = input<string>('');

  /** Ruta de imagen opcional a mostrar */
  readonly imageSrc = input<string>('');

  /** Texto alternativo para la imagen */
  readonly imageAlt = input<string>('Imagen modal');

  /** Clases CSS para el ancho máximo del contenedor del modal */
  readonly maxWidthClass = input<string>('max-w-[88%] sm:max-w-md');

  /** Texto del botón principal de acción */
  readonly primaryButtonText = input<string>('');

  /** Texto del botón secundario / enlace opcional */
  readonly secondaryButtonText = input<string>('');

  /** Evento emitido al pulsar el botón principal */
  readonly primaryAction = output<void>();

  /** Evento emitido al pulsar el botón secundario */
  readonly secondaryAction = output<void>();

  /** Evento emitido al cerrar o hacer clic en el backdrop */
  readonly close = output<void>();

  onPrimaryClick(): void {
    this.primaryAction.emit();
  }

  onSecondaryClick(): void {
    this.secondaryAction.emit();
  }

  onBackdropClick(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      this.close.emit();
    }
  }
}
