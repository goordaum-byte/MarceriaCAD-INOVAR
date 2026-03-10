import { Module, Room } from '../store/useEditorStore';

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email: string;
  document: string; // CPF / CNPJ
  address: string;
  city: string;
  state: string;
  observations?: string;
  createdAt: string;
}

export interface Project {
  id: string;
  customerId: string;
  name: string;
  room: Room;
  modules: Module[];
  status: 'draft' | 'budgeted' | 'sold' | 'production' | 'finished' | 'delivered';
  createdAt: string;
  updatedAt: string;
}

export interface Part {
  id: string;
  projectId: string;
  moduleId: string;
  name: string;
  width: number;
  height: number;
  thickness: number;
  material: string;
  color: string;
  texture: string;
  quantity: number;
  type: 'mdf' | 'partition' | 'shelf' | 'door' | 'drawer' | 'back';
}

export interface CuttingPlan {
  id: string;
  projectId: string;
  sheetSize: { width: number; height: number };
  layouts: any[]; // Result of nesting algorithm
  wastePercentage: number;
}

export interface DrillingPlan {
  id: string;
  partId: string;
  holes: {
    x: number;
    y: number;
    diameter: number;
    depth: number;
    type: 'hinge' | 'slide' | 'handle' | 'assembly';
  }[];
}

export interface Budget {
  id: string;
  projectId: string;
  customerId: string;
  items: {
    description: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
  }[];
  laborCost: number;
  installationCost: number;
  shippingCost: number;
  profitMargin: number;
  totalCost: number;
  totalPrice: number;
  status: 'pending' | 'sent' | 'approved' | 'rejected';
  createdAt: string;
}

export interface Sale {
  id: string;
  budgetId: string;
  customerId: string;
  totalValue: number;
  status: 'pending' | 'paid' | 'partial' | 'cancelled';
  paymentMethod: string;
  createdAt: string;
}

export interface ProductionOrder {
  id: string;
  saleId: string;
  projectId: string;
  status: 'waiting' | 'cutting' | 'assembly' | 'finishing' | 'delivery';
  parts: Part[];
  createdAt: string;
}

export interface InventoryItem {
  id: string;
  name: string;
  category: 'mdf' | 'hardware' | 'handle' | 'slide' | 'hinge' | 'profile' | 'led';
  brand: string; // Leo Madeiras etc
  quantity: number;
  unit: 'unit' | 'sheet' | 'meter';
  minQuantity: number;
  price: number;
}

export interface Transaction {
  id: string;
  type: 'income' | 'expense';
  category: string;
  amount: number;
  description: string;
  date: string;
  status: 'pending' | 'completed';
}

export interface Contract {
  id: string;
  customerId: string;
  projectId: string;
  content: string;
  value: number;
  deadline: string;
  createdAt: string;
}

export interface Warranty {
  id: string;
  customerId: string;
  projectId: string;
  deliveryDate: string;
  expiryDate: string;
  terms: string;
}
