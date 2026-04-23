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

export function formatDate(date: string | Date | undefined | null) {
  if (!date) return '---';
  const d = new Date(date);
  if (isNaN(d.getTime())) return '---';

  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
}

export function formatDateTime(date: string | Date | undefined | null) {
  if (!date) return '---';
  const d = new Date(date);
  if (isNaN(d.getTime())) return '---';

  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  return `${day}/${month}/${year} ${hours}:${minutes}`;
}

export function getVehicleColorHex(colorName: string): string {
  const name = colorName.toLowerCase();
  const colorMap: Record<string, string> = {
    // Uzbek
    'qizil': '#FF0000',
    'yashil': '#00FF00',
    'ko\'k': '#0000FF',
    'sariq': '#FFFF00',
    'qora': '#000000',
    'oq': '#FFFFFF',
    'kulrang': '#808080',
    'to‘q ko‘k': '#000080',
    'jigarrang': '#A52A2A',
    'to‘q yashil': '#006400',
    'olcha': '#800000',
    'zaytun': '#808000',
    'kumush': '#C0C0C0',
    'olovrang': '#FFA500',
    'siyohrang': '#800080',
    'pushti': '#FFC0CB',
    'ko‘k-yashil': '#008080',
    'aqua': '#00FFFF',
    'shaftoli': '#FFDAB9',
    'oltin': '#FFD700',
    'bej': '#F5F5DC',
    'shokolad': '#D2691E',
    'karamel': '#AF6E4D',
    'quyosh': '#FFD300',
    'dengiz to‘lqini': '#2E8B57',
    'pushti binafsha': '#FF00FF',
    'qaymoqrang': '#FFFFF0',
    'jigar binafsha': '#4B0082',
    'zangori': '#87CEEB',
    'to‘q kulrang': '#A9A9A9',
    // English
    'red': '#FF0000',
    'green': '#00FF00',
    'blue': '#0000FF',
    'yellow': '#FFFF00',
    'black': '#000000',
    'white': '#FFFFFF',
    'gray': '#808080',
    'navy': '#000080',
    'brown': '#A52A2A',
    'dark green': '#006400',
    'maroon': '#800000',
    'olive': '#808000',
    'silver': '#C0C0C0',
    'orange': '#FFA500',
    'purple': '#800080',
    'pink': '#FFC0CB',
    'teal': '#008080',
    'peach': '#FFDAB9',
    'gold': '#FFD700',
    'beige': '#F5F5DC',
    'chocolate': '#D2691E',
    'caramel': '#AF6E4D',
    'sunshine': '#FFD300',
    'sea wave': '#2E8B57',
    'magenta': '#FF00FF',
    'ivory': '#FFFFF0',
    'indigo': '#4B0082',
    'sky blue': '#87CEEB',
    'dark gray': '#A9A9A9',
    // Russian
    'красный': '#FF0000',
    'зелёный': '#00FF00',
    'синий': '#0000FF',
    'жёлтый': '#FFFF00',
    'чёрный': '#000000',
    'белый': '#FFFFFF',
    'серый': '#808080',
    'морской': '#000080',
    'коричневый': '#A52A2A',
    'тёмно-зелёный': '#006400',
    'бордовый': '#800000',
    'оливковый': '#808000',
    'серебряный': '#C0C0C0',
    'оранжевый': '#FFA500',
    'пурпурный': '#800080',
    'розовый': '#FFC0CB',
    'бирюзовый': '#008080',
    'аква': '#00FFFF',
    'персиковый': '#FFDAB9',
    'золотой': '#FFD700',
    'бежевый': '#F5F5DC',
    'шоколадный': '#D2691E',
    'карамельный': '#AF6E4D',
    'солнечный': '#FFD300',
    'морская волна': '#2E8B57',
    'фуксия': '#FF00FF',
    'слоновая кость': '#FFFFF0',
    'индиго': '#4B0082',
    'небесно-голубой': '#87CEEB',
    'тёмно-серый': '#A9A9A9',
  };

  return colorMap[name] || '#CBD5E1'; // Default to a neutral gray if not found
}
