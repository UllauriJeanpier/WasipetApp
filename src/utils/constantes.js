export const PRODUCTS_BY_BRAND = {
  ADVANCE: 'Advance',
  GRAN_PLUS: 'Gran Plus',
  LIVELONG: 'Livelong',
  PROGRATO: 'Progato',
  KUMAR: 'Kumar',
  BOEHRINGER: 'Boehringer',
  ZOETIS: 'Zoetis',
  BAYER: 'Bayer',
  MIRA_PET: 'Mira-Pet',
  ROYAL_PET: 'Royal Pet',
};

export const COLORS_BY_BRAND = {
  ADVANCE: '#EB8817',
  GRAN_PLUS: '#226EB0',
  LIVELONG: '#A3BD31',
  PROGRATO: '#FFD338',
  KUMAR: '#FF6363',
  BOEHRINGER: '#C30F0F',
  ZOETIS: '#36CB72',
  BAYER: '#A94DE9',
  MIRA_PET: '#6F0917',
  ROYAL_PET: '#4C2808',
};

export const PET_GENDERS = [
  {
    _id: 1,
    label: 'Macho',
    value: 'Macho',
  },
  {
    _id: 2,
    label: 'Hembra',
    value: 'Hembra',
  },
];

export const PET_TYPES = [
  {
    _id: 1,
    label: 'Perro',
    value: 'Dog',
  },
  {
    _id: 2,
    label: 'Gato',
    value: 'Cat',
  },
];

export const CATEGORIAS_HOME = [
  {
    id: 1,
    name: 'Alimentos',
    color: '#F2D3AE',
    image: require('../assets/images/cat-alimentos.png'),
  },
  {
    id: 2,
    name: 'Fármacos',
    color: '#D0FFAF',
    image: require('../assets/images/cat-farmacos.png'),
  },
  {
    id: 3,
    name: 'Accesorios',
    color: '#E1BCFF',
    image: require('../assets/images/cat-accesorios.png'),
  },
  {
    id: 4,
    name: 'Higiene',
    color: '#B7E3F7',
    image: require('../assets/images/cat-higiene-aseo.png'),
  },
  {
    id: 5,
    name: 'Nutrición',
    color: '#FFE58D',
    image: require('../assets/images/cat-nutricionales.png'),
  },
  /* {
    id: 6,
    name: 'Marcas',
    color: '#E8A6A5',
    image: require('../assets/images/cat-marcas.png'),
  }, */
];

export const BANNERS_HOME = [
  require('../assets/images/BANNER_HOME_1.jpg'),
  require('../assets/images/BANNER_HOME_2.jpg'),
  require('../assets/images/BANNER_HOME_3.jpg'),
];
