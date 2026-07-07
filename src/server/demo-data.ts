export const DEMO_EMAIL = "demo@carta.co";
export const DEMO_PASSWORD = "demo1234";
export const DEMO_BUSINESS_NAME = "Sabor Cafetero (Demo)";
export const DEMO_SLUG = "sabor-cafetero";

export interface DemoDish {
  name: string;
  category: string;
  description: string;
  price: number;
  tags: string[];
  imageUrl?: string;
  soldOut?: boolean;
}

// Fotos de prueba servidas desde el CDN de Unsplash (uso libre según su licencia).
function unsplash(photoId: string): string {
  return `https://images.unsplash.com/photo-${photoId}?w=800&q=70&auto=format&fit=crop`;
}

export const DEMO_CATEGORIES = [
  "Entradas",
  "Sopas",
  "Platos fuertes",
  "Asados",
  "Bebidas",
  "Postres",
];

export const DEMO_DISHES: DemoDish[] = [
  {
    name: "Empanadas (3 unidades)",
    category: "Entradas",
    description: "Empanadas de carne desmechada con papa, acompañadas de ají casero y limón.",
    price: 6000,
    tags: ["recomendado"],
    imageUrl: unsplash("1601050690597-df0568f70950"),
  },
  {
    name: "Arepa de choclo con queso",
    category: "Entradas",
    description: "Arepa dulce de maíz tierno, rellena de queso campesino fundido y mantequilla.",
    price: 8000,
    tags: ["vegetariano"],
    imageUrl: unsplash("1567620905732-2d1ec7ab7445"),
  },
  {
    name: "Patacón con hogao",
    category: "Entradas",
    description: "Patacón crujiente bañado en hogao criollo (tomate, cebolla, ajo y comino).",
    price: 7000,
    tags: ["vegetariano"],
    imageUrl: unsplash("1541592106381-b31e9677c0e5"),
  },
  {
    name: "Chicharrón crujiente",
    category: "Entradas",
    description: "Chicharrón de cerdo frito a la perfección, servido con limón, sal y ají.",
    price: 12000,
    tags: [],
    imageUrl: unsplash("1432139555190-58524dae6a55"),
  },
  {
    name: "Sancocho de gallina",
    category: "Sopas",
    description: "Sancocho tradicional de gallina criolla con yuca, plátano, papa y mazorca, servido con arroz y aguacate.",
    price: 18000,
    tags: ["recomendado"],
    imageUrl: unsplash("1547592166-23ac45744acd"),
  },
  {
    name: "Ajiaco santafereño",
    category: "Sopas",
    description: "Ajiaco con tres papas, pollo desmenuzado, mazorca, guascas y alcaparras, acompañado de crema de leche y aguacate.",
    price: 16000,
    tags: [],
    imageUrl: unsplash("1476718406336-bb5a9690ee2a"),
  },
  {
    name: "Bandeja paisa",
    category: "Platos fuertes",
    description: "La bandeja más completa: arroz, frijoles, carne molida, chicharrón, huevo frito, plátano maduro, aguacate, arepa y morcilla.",
    price: 28000,
    tags: ["recomendado"],
    imageUrl: unsplash("1504674900247-0877df9cc836"),
  },
  {
    name: "Chuleta de cerdo",
    category: "Platos fuertes",
    description: "Chuleta de cerdo empanizada, jugosa por dentro y crocante por fuera, servida con papas a la francesa y ensalada fresca.",
    price: 22000,
    tags: [],
    imageUrl: unsplash("1414235077428-338989a2e8c0"),
  },
  {
    name: "Bandeja montañera",
    category: "Platos fuertes",
    description: "Arroz, carne asada, chorizo, arepa, huevo frito, plátano maduro, aguacate y fríjoles antioqueños.",
    price: 25000,
    tags: [],
    imageUrl: unsplash("1512058564366-18510be2db19"),
  },
  {
    name: "Cazuela de fríjoles",
    category: "Platos fuertes",
    description: "Cazuela de fríjoles rojos con cerdo, acompañada de arroz, aguacate, plátano maduro y hogao.",
    price: 15000,
    tags: [],
    imageUrl: unsplash("1547496502-affa22d38842"),
  },
  {
    name: "Mojarra frita",
    category: "Platos fuertes",
    description: "Mojarra de río frita entera, crocante, servida con arroz, patacones y ensalada fresca.",
    price: 20000,
    tags: [],
    imageUrl: unsplash("1467003909585-2f8a72700288"),
  },
  {
    name: "Carne asada con chimichurri",
    category: "Platos fuertes",
    description: "Carne de res asada al punto, bañada en chimichurri casero, acompañada de papas criollas y verduras salteadas.",
    price: 24000,
    tags: [],
    imageUrl: unsplash("1546833999-b9f581a1996d"),
  },
  {
    name: "Costillas BBQ",
    category: "Asados",
    description: "Costillas de cerdo bañadas en salsa BBQ ahumada, horneadas lentamente hasta que se desprenden del hueso.",
    price: 26000,
    tags: ["recomendado"],
    imageUrl: unsplash("1544025162-d76694265947"),
  },
  {
    name: "Pechuga a la plancha",
    category: "Asados",
    description: "Pechuga de pollo marinada en hierbas y asada a la parrilla, con verduras salteadas y arroz con coco.",
    price: 19000,
    tags: [],
    imageUrl: unsplash("1532550907401-a500c9a57435"),
  },
  {
    name: "Lulada",
    category: "Bebidas",
    description: "Refrescante bebida valluna de lulo con hielo, azúcar y un toque de soda.",
    price: 5000,
    tags: [],
    imageUrl: unsplash("1513558161293-cdaf765ed2fd"),
  },
  {
    name: "Jugo de lulo",
    category: "Bebidas",
    description: "Jugo natural de lulo recién exprimido, endulzado con panela.",
    price: 4000,
    tags: ["vegetariano"],
    imageUrl: unsplash("1600271886742-f049cd451bba"),
  },
  {
    name: "Limonada de coco",
    category: "Bebidas",
    description: "Limonada cremosa con leche de coco natural y un toque de hierbabuena.",
    price: 6000,
    tags: [],
    imageUrl: unsplash("1523677011781-c91d1bbe2f9e"),
  },
  {
    name: "Aromática de limonaria",
    category: "Bebidas",
    description: "Infusión caliente de limonaria fresca con miel de abejas y jengibre.",
    price: 3000,
    tags: ["vegetariano"],
    imageUrl: unsplash("1576092768241-dec231879fc3"),
  },
  {
    name: "Tres leches",
    category: "Postres",
    description: "Bizcocho esponjoso bañado en tres leches, cubierto de merengue tostado y canela.",
    price: 8000,
    tags: ["recomendado"],
    imageUrl: unsplash("1565958011703-44f9829ba187"),
  },
  {
    name: "Arroz con leche",
    category: "Postres",
    description: "Arroz con leche cremoso, preparado con canela, clavos de olor y pasas.",
    price: 6000,
    tags: [],
    imageUrl: unsplash("1488477181946-6428a0291777"),
  },
  {
    name: "Merengón",
    category: "Postres",
    description: "Merengón de frutas frescas con crema de leche y trozos de merengue crocante.",
    price: 7000,
    tags: [],
    imageUrl: unsplash("1464305795204-6f5bbfc7fb81"),
  },
];
