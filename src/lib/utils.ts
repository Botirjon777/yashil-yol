import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number) {
  return new Intl.NumberFormat('uz-UZ', {
    style: 'currency',
    currency: 'UZS',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(date: string | Date) {
  return new Intl.DateTimeFormat('uz-UZ', {
    day: 'numeric',
    month: 'long',
  }).format(new Date(date));
}

export function getVehicleColorHex(colorName: string): string {
  const name = colorName.toLowerCase();
  const colorMap: Record<string, string> = {
    // Uzbek
    'oq': '#FFFFFF',
    'kumush': '#C0C0C0',
    'kulrang': '#808080',
    'qora': '#000000',
    'ko\'k': '#0000FF',
    'to\'q ko\'k': '#000080',
    'qizil': '#FF0000',
    'sutrang': '#F5F5DC',
    'yashil': '#008000',
    'sariq': '#FFFF00',
    'jigarrang': '#A52A2A',
    'stalnoy': '#71797E',
    'mokryy asfalt': '#343434',
    // Russian
    'белый': '#FFFFFF',
    'серебристый': '#C0C0C0',
    'серый': '#808080',
    'черный': '#000000',
    'черный ': '#000000',
    'синий': '#0000FF',
    'темно-синий': '#000080',
    'красный': '#FF0000',
    'бежевый': '#F5F5DC',
    'зеленый': '#008000',
    'желтый': '#FFFF00',
    'коричневый': '#A52A2A',
    'стальной': '#71797E',
    'мокрого асфальта': '#343434',
    // English
    'white': '#FFFFFF',
    'silver': '#C0C0C0',
    'grey': '#808080',
    'gray': '#808080',
    'black': '#000000',
    'blue': '#0000FF',
    'red': '#FF0000',
    'beige': '#F5F5DC',
    'green': '#008000',
  };

  return colorMap[name] || '#CBD5E1'; // Default to a neutral gray if not found
}
