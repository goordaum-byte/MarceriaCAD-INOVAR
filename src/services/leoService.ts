/**
 * Mock service for Leo Madeiras integration.
 * In a real scenario, this would be a crawler or an API client.
 */

export interface LeoProduct {
  id: string;
  name: string;
  category: 'mdf' | 'hardware' | 'handle' | 'slide' | 'hinge';
  brand: string;
  textureUrl?: string;
  color?: string;
  metadata?: any;
}

const MOCK_LEO_DATA: LeoProduct[] = [
  { id: 'mdf-01', name: 'Branco Diamante', category: 'mdf', brand: 'Duratex', color: '#ffffff' },
  { id: 'mdf-02', name: 'Louro Freijó', category: 'mdf', brand: 'Duratex', textureUrl: 'https://picsum.photos/seed/wood1/200/200' },
  { id: 'mdf-03', name: 'Carvalho Hanover', category: 'mdf', brand: 'Duratex', textureUrl: 'https://picsum.photos/seed/wood2/200/200' },
  { id: 'mdf-04', name: 'Nogueira Caiena', category: 'mdf', brand: 'Duratex', textureUrl: 'https://picsum.photos/seed/wood3/200/200' },
  { id: 'mdf-05', name: 'Grafite', category: 'mdf', brand: 'Duratex', color: '#424242' },
  { id: 'mdf-06', name: 'Preto Silk', category: 'mdf', brand: 'Duratex', color: '#1a1a1a' },
  { id: 'hw-01', name: 'Dobradiça 35mm Click', category: 'hinge', brand: 'FGVtn' },
  { id: 'hw-02', name: 'Corrediça Telescópica 450mm', category: 'slide', brand: 'Leo' },
  { id: 'hw-03', name: 'Puxador Perfil Alumínio G', category: 'handle', brand: 'Leo' },
  { id: 'hw-04', name: 'Puxador Alça Escovada', category: 'handle', brand: 'Leo' },
];

export const syncLeoMadeiras = async (): Promise<LeoProduct[]> => {
  console.log('Syncing with Leo Madeiras catalog...');
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  return MOCK_LEO_DATA;
};
