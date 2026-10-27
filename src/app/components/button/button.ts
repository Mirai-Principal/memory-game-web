import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-button',
  imports: [],
  templateUrl: './button.html',
  styleUrl: './button.css'
})
export class ButtonComponent {
  /** Texto dinámico del botón */
  readonly text = input<string>('');
  /** Tamaño del botón */
  readonly size = input<'sm' | 'md' | 'lg'>('lg');
  /** Estado deshabilitado */
  readonly disabled = input<boolean>(false);
  /** Tipo de botón HTML */
  readonly type = input<'button' | 'submit' | 'reset'>('button');
  /** Clases CSS adicionales */
  readonly customClass = input<string>('');
  /** Evento click dinámico */
  readonly clicked = output<MouseEvent>();

  handleClick(event: MouseEvent): void {
    if (!this.disabled()) {
      this.clicked.emit(event);
    }
  }
}

