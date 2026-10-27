export interface ConsejoItem {
  numero: number;
  imageSrc: string;
  descripcion: string;
  badgeColor: string;
  tituloPar: string;
}

export const CONSEJOS_DATA: ConsejoItem[] = [
  {
    numero: 1,
    imageSrc: 'images/img_cards/1.png',
    badgeColor: '#4DB748',
    tituloPar: '¡Encontraste el alivio con FRIZAC!',
    descripcion: 'Usa el dosificador indicado, evita cucharas de cocina y respeta la dosis prescrita por tu médico.'
  },
  {
    numero: 2,
    imageSrc: 'images/img_cards/2.png',
    badgeColor: '#F37021',
    tituloPar: '¡Una acción que cuida a tu familia!',
    descripcion: 'Tapa los depósitos de agua y límpialos cada semana.'
  },
  {
    numero: 3,
    imageSrc: 'images/img_cards/3.png',
    badgeColor: '#16BA9D',
    tituloPar: '¡Activa el cuidado!',
    descripcion: 'Protégete de las picaduras, también durante el día. Usa mosquiteros y repelente.'
  },
  {
    numero: 4,
    imageSrc: 'images/img_cards/4.png',
    badgeColor: '#E62B65',
    tituloPar: '¡Reconoce la fiebre!',
    descripcion: 'Controla la temperatura y sigue las indicaciones de tu médico.'
  },
  {
    numero: 5,
    imageSrc: 'images/img_cards/5.png',
    badgeColor: '#00B3E6',
    tituloPar: '¡Presta atención a las señales!',
    descripcion: 'Ante dolor abdominal intenso, vómitos persistentes o sangrado, busca atención inmediata, aunque la fiebre haya bajado.'
  },
  {
    numero: 6,
    imageSrc: 'images/img_cards/6.png',
    badgeColor: '#EE7BB4',
    tituloPar: '¡Con FRIZAC, el cuidado continúa!',
    descripcion: 'FRIZAC ayuda a aliviar la fiebre y el dolor. Úsalo según la indicación médica.'
  }
];
