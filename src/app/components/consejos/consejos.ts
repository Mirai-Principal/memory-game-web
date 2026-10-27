import { Component, output } from '@angular/core';
import { CardConsejo } from '../card-consejo/card-consejo';
import { ButtonComponent } from '../button/button';
import { CONSEJOS_DATA, ConsejoItem } from '../../data/consejos.data';

@Component({
  selector: 'app-consejos',
  imports: [CardConsejo, ButtonComponent],
  templateUrl: './consejos.html',
  styleUrl: './consejos.css',
})
export class Consejos {
  readonly consejos: ConsejoItem[] = CONSEJOS_DATA;
  readonly close = output<void>();

  onClose(): void {
    this.close.emit();
  }
}
