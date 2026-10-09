import React, { useState, useMemo, useEffect } from 'react';

// Firebase Imports
import { initializeApp } from 'firebase/app';
import {
  getFirestore,
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  collection,
  getDocs,
  addDoc,
} from 'firebase/firestore';

// Ícones SVG nativos (sem dependência externa)
const Search = ({ size = 18, className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.3-4.3" />
  </svg>
);
const Filter = ({ size = 18, className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
  </svg>
);
const Save = ({ size = 18, className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
    <polyline points="17 21 17 13 7 13 7 21" />
    <polyline points="7 3 7 8 15 8" />
  </svg>
);
const Download = ({ size = 18, className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="7 10 12 15 17 10" />
    <line x1="12" x2="12" y1="15" y2="3" />
  </svg>
);
const Printer = ({ size = 18, className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <polyline points="6 9 6 2 18 2 18 9" />
    <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
    <rect width="12" height="8" x="6" y="14" />
  </svg>
);
const CheckCircle = ({ size = 18, className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </svg>
);
const FileText = ({ size = 18, className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="16" x2="8" y1="13" y2="13" />
    <line x1="16" x2="8" y1="17" y2="17" />
    <line x1="10" x2="8" y1="9" y2="9" />
  </svg>
);
const Upload = ({ size = 18, className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="17 8 12 3 7 8" />
    <line x1="12" x2="12" y1="3" y2="15" />
  </svg>
);
const X = ({ size = 18, className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M18 6 6 18" />
    <path d="m6 6 12 12" />
  </svg>
);
const MessageSquare = ({ size = 18, className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
);
const History = ({ size = 18, className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
    <polyline points="3 3 3 8 8 8" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);
const Calendar = ({ size = 18, className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
    <line x1="16" x2="16" y1="2" y2="6" />
    <line x1="8" x2="8" y1="2" y2="6" />
    <line x1="3" x2="21" y1="10" y2="10" />
  </svg>
);
const ArrowLeft = ({ size = 18, className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <line x1="19" x2="5" y1="12" y2="12" />
    <polyline points="12 19 5 12 12 5" />
  </svg>
);
const ChevronRight = ({ size = 18, className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <polyline points="9 18 15 12 9 6" />
  </svg>
);
const AlertCircle = ({ size = 18, className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <circle cx="12" cy="12" r="10" />
    <line x1="12" x2="12" y1="8" y2="12" />
    <line x1="12" x2="12.01" y1="16" y2="16" />
  </svg>
);
const Trash2 = ({ size = 18, className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M3 6h18" />
    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
    <line x1="10" x2="10" y1="11" y2="17" />
    <line x1="14" x2="14" y1="11" y2="17" />
  </svg>
);
const Share2 = ({ size = 18, className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <circle cx="18" cy="5" r="3" />
    <circle cx="6" cy="12" r="3" />
    <circle cx="18" cy="19" r="3" />
    <line x1="8.59" x2="15.42" y1="10.51" y2="6.49" />
    <line x1="15.41" x2="8.59" y1="17.51" y2="13.49" />
  </svg>
);
const Cloud = ({ size = 18, className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z" />
  </svg>
);
const UserPlus = ({ size = 18, className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <line x1="19" x2="19" y1="8" y2="14" />
    <line x1="22" x2="16" y1="11" y2="11" />
  </svg>
);
const Lock = ({ size = 18, className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);
const LogOut = ({ size = 18, className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline points="16 17 21 12 16 7" />
    <line x1="21" x2="9" y1="12" y2="12" />
  </svg>
);
const User = ({ size = 18, className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);
const Users = ({ size = 18, className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

// Configuração do Firebase
const firebaseConfig = {
  apiKey: 'AIzaSyC55CmnAyTbfdK6UfHQOdwZDxNll-4xGP4',
  authDomain: 'inventariofisico10.firebaseapp.com',
  projectId: 'inventariofisico10',
  storageBucket: 'inventariofisico10.firebasestorage.app',
  messagingSenderId: '856703463665',
  appId: '1:856703463665:web:f37a17449fd1df8c137950',
  measurementId: 'G-6C97P3EHGN',
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Base de produtos original
const initialData = [
  {
    id: '1',
    descricao: 'Trigo Anaconda',
    unidade: 'Kg',
    saldo: 0,
    grupo: 'Secos',
    valorUnitario: 0,
  },
  {
    id: '2',
    descricao: 'Tomate para Molho',
    unidade: 'Kg',
    saldo: 0,
    grupo: 'Hortifruti',
    valorUnitario: 0,
  },
  {
    id: '3',
    descricao: 'Tomate para Fatiar',
    unidade: 'Kg',
    saldo: 0,
    grupo: 'Hortifruti',
    valorUnitario: 0,
  },
  {
    id: '4',
    descricao: 'Tomate Cereja',
    unidade: 'Kg',
    saldo: 0,
    grupo: 'Hortifruti',
    valorUnitario: 0,
  },
  {
    id: '5',
    descricao: 'Tinta de Canetão',
    unidade: 'Un',
    saldo: 0,
    grupo: 'Escritório',
    valorUnitario: 0,
  },
  {
    id: '6',
    descricao: 'Tempero Sazon',
    unidade: 'Kg',
    saldo: 0,
    grupo: 'Temperos',
    valorUnitario: 0,
  },
  {
    id: '7',
    descricao: 'Suco Tropical Maracuja',
    unidade: 'Un',
    saldo: 0,
    grupo: 'Bebidas',
    valorUnitario: 0,
  },
  {
    id: '8',
    descricao: 'Suco Tropical Laranja',
    unidade: 'Un',
    saldo: 0,
    grupo: 'Bebidas',
    valorUnitario: 0,
  },
  {
    id: '9',
    descricao: 'Suco Tropical Goiaba',
    unidade: 'Un',
    saldo: 0,
    grupo: 'Bebidas',
    valorUnitario: 0,
  },
  {
    id: '10',
    descricao: 'Suco Tropical Abacaxi',
    unidade: 'Un',
    saldo: 0,
    grupo: 'Bebidas',
    valorUnitario: 0,
  },
  {
    id: '11',
    descricao: 'Salsinha',
    unidade: 'Kg',
    saldo: 0,
    grupo: 'Hortifruti',
    valorUnitario: 0,
  },
  {
    id: '12',
    descricao: 'Salsicha',
    unidade: 'Kg',
    saldo: 0,
    grupo: 'Carnes e Frios',
    valorUnitario: 0,
  },
  {
    id: '13',
    descricao: 'Sal',
    unidade: 'Kg',
    saldo: 0,
    grupo: 'Temperos',
    valorUnitario: 0,
  },
  {
    id: '14',
    descricao: 'Saco de Lixo 60ml',
    unidade: 'Un',
    saldo: 0,
    grupo: 'Limpeza',
    valorUnitario: 0,
  },
  {
    id: '15',
    descricao: 'Saco de Lixo 200ml',
    unidade: 'Un',
    saldo: 0,
    grupo: 'Limpeza',
    valorUnitario: 0,
  },
  {
    id: '16',
    descricao: 'Saco de Lixo 100ml',
    unidade: 'Un',
    saldo: 0,
    grupo: 'Limpeza',
    valorUnitario: 0,
  },
  {
    id: '17',
    descricao: 'Requeijão Catupiry',
    unidade: 'Kg',
    saldo: 0,
    grupo: 'Laticínios',
    valorUnitario: 0,
  },
  {
    id: '18',
    descricao: 'Provolone',
    unidade: 'Kg',
    saldo: 0,
    grupo: 'Laticínios',
    valorUnitario: 0,
  },
  {
    id: '19',
    descricao: 'Pó de Café',
    unidade: 'Kg',
    saldo: 0,
    grupo: 'Secos',
    valorUnitario: 0,
  },
  {
    id: '20',
    descricao: 'Pimenta Calabresa',
    unidade: 'Kg',
    saldo: 0,
    grupo: 'Temperos',
    valorUnitario: 0,
  },
  {
    id: '21',
    descricao: 'Pepperoni',
    unidade: 'Kg',
    saldo: 0,
    grupo: 'Carnes e Frios',
    valorUnitario: 0,
  },
  {
    id: '22',
    descricao: 'Peito de Peru',
    unidade: 'Kg',
    saldo: 0,
    grupo: 'Carnes e Frios',
    valorUnitario: 0,
  },
  {
    id: '23',
    descricao: 'Parmesão',
    unidade: 'Kg',
    saldo: 0,
    grupo: 'Laticínios',
    valorUnitario: 0,
  },
  {
    id: '24',
    descricao: 'Papel Toalha',
    unidade: 'Un',
    saldo: 0,
    grupo: 'Limpeza',
    valorUnitario: 0,
  },
  {
    id: '25',
    descricao: 'Papel Higienico',
    unidade: 'Un',
    saldo: 0,
    grupo: 'Limpeza',
    valorUnitario: 0,
  },
  {
    id: '26',
    descricao: 'Pano de Chão Xadrez',
    unidade: 'Un',
    saldo: 0,
    grupo: 'Limpeza',
    valorUnitario: 0,
  },
  {
    id: '27',
    descricao: 'Palmito',
    unidade: 'Kg',
    saldo: 0,
    grupo: 'Secos',
    valorUnitario: 0,
  },
  {
    id: '28',
    descricao: 'Palha de Aço',
    unidade: 'Un',
    saldo: 0,
    grupo: 'Limpeza',
    valorUnitario: 0,
  },
  {
    id: '29',
    descricao: 'Ovo',
    unidade: 'Un',
    saldo: 0,
    grupo: 'Hortifruti',
    valorUnitario: 0,
  },
  {
    id: '30',
    descricao: 'Oregano',
    unidade: 'Kg',
    saldo: 0,
    grupo: 'Temperos',
    valorUnitario: 0,
  },
  {
    id: '31',
    descricao: 'Oleo',
    unidade: 'L',
    saldo: 0,
    grupo: 'Secos',
    valorUnitario: 0,
  },
  {
    id: '32',
    descricao: 'Mussarela',
    unidade: 'Kg',
    saldo: 0,
    grupo: 'Laticínios',
    valorUnitario: 0,
  },
  {
    id: '33',
    descricao: 'Mostarda',
    unidade: 'Kg',
    saldo: 0,
    grupo: 'Condimentos',
    valorUnitario: 0,
  },
  {
    id: '34',
    descricao: 'Molho da Casa',
    unidade: 'Kg',
    saldo: 0,
    grupo: 'Condimentos',
    valorUnitario: 0,
  },
  {
    id: '35',
    descricao: 'Milho',
    unidade: 'Kg',
    saldo: 0,
    grupo: 'Secos',
    valorUnitario: 0,
  },
  {
    id: '36',
    descricao: 'Massa Tradicional',
    unidade: 'Kg',
    saldo: 0,
    grupo: 'Secos',
    valorUnitario: 0,
  },
  {
    id: '37',
    descricao: 'Marca Texto',
    unidade: 'Un',
    saldo: 0,
    grupo: 'Escritório',
    valorUnitario: 0,
  },
  {
    id: '38',
    descricao: 'Manteiga',
    unidade: 'Kg',
    saldo: 0,
    grupo: 'Laticínios',
    valorUnitario: 0,
  },
  {
    id: '39',
    descricao: 'Manjericão',
    unidade: 'Kg',
    saldo: 0,
    grupo: 'Hortifruti',
    valorUnitario: 0,
  },
  {
    id: '40',
    descricao: 'Lombo Canadense',
    unidade: 'Kg',
    saldo: 0,
    grupo: 'Carnes e Frios',
    valorUnitario: 0,
  },
  {
    id: '41',
    descricao: 'Limpa Aluminio',
    unidade: 'Un',
    saldo: 0,
    grupo: 'Limpeza',
    valorUnitario: 0,
  },
  {
    id: '42',
    descricao: 'Lacre',
    unidade: 'Un',
    saldo: 0,
    grupo: 'Embalagens',
    valorUnitario: 0,
  },
  {
    id: '43',
    descricao: 'Ketchup',
    unidade: 'Kg',
    saldo: 0,
    grupo: 'Condimentos',
    valorUnitario: 0,
  },
  {
    id: '44',
    descricao: 'Heineken Longneck',
    unidade: 'Un',
    saldo: 0,
    grupo: 'Bebidas',
    valorUnitario: 0,
  },
  {
    id: '45',
    descricao: 'Guaranita 2 Litros',
    unidade: 'Un',
    saldo: 0,
    grupo: 'Bebidas',
    valorUnitario: 0,
  },
  {
    id: '46',
    descricao: 'Guaraná Antártica 2 Litros',
    unidade: 'Un',
    saldo: 0,
    grupo: 'Bebidas',
    valorUnitario: 0,
  },
  {
    id: '47',
    descricao: 'Granulado',
    unidade: 'Kg',
    saldo: 0,
    grupo: 'Doces',
    valorUnitario: 0,
  },
  {
    id: '48',
    descricao: 'Grampo',
    unidade: 'Un',
    saldo: 0,
    grupo: 'Escritório',
    valorUnitario: 0,
  },
  {
    id: '49',
    descricao: 'Fubá',
    unidade: 'Kg',
    saldo: 0,
    grupo: 'Secos',
    valorUnitario: 0,
  },
  {
    id: '50',
    descricao: 'Frango Congelado',
    unidade: 'Kg',
    saldo: 0,
    grupo: 'Carnes e Frios',
    valorUnitario: 0,
  },
  {
    id: '51',
    descricao: 'Folha Sulfite',
    unidade: 'Un',
    saldo: 0,
    grupo: 'Escritório',
    valorUnitario: 0,
  },
  {
    id: '52',
    descricao: 'Filtro de Café',
    unidade: 'Un',
    saldo: 0,
    grupo: 'Secos',
    valorUnitario: 0,
  },
  {
    id: '53',
    descricao: 'Fermento',
    unidade: 'Kg',
    saldo: 0,
    grupo: 'Secos',
    valorUnitario: 0,
  },
  {
    id: '54',
    descricao: 'Farinha integral',
    unidade: 'Kg',
    saldo: 0,
    grupo: 'Secos',
    valorUnitario: 0,
  },
  {
    id: '55',
    descricao: 'Ervilha',
    unidade: 'Kg',
    saldo: 0,
    grupo: 'Secos',
    valorUnitario: 0,
  },
  {
    id: '56',
    descricao: 'Durex',
    unidade: 'Un',
    saldo: 0,
    grupo: 'Escritório',
    valorUnitario: 0,
  },
  {
    id: '57',
    descricao: 'Diabo Verde',
    unidade: 'Un',
    saldo: 0,
    grupo: 'Limpeza',
    valorUnitario: 0,
  },
  {
    id: '58',
    descricao: 'Detergente',
    unidade: 'Un',
    saldo: 0,
    grupo: 'Limpeza',
    valorUnitario: 0,
  },
  {
    id: '59',
    descricao: 'Desinfetante',
    unidade: 'Un',
    saldo: 0,
    grupo: 'Limpeza',
    valorUnitario: 0,
  },
  {
    id: '60',
    descricao: 'Creme de Leite',
    unidade: 'Kg',
    saldo: 0,
    grupo: 'Laticínios',
    valorUnitario: 0,
  },
  {
    id: '61',
    descricao: 'Cream Cheese',
    unidade: 'Kg',
    saldo: 0,
    grupo: 'Laticínios',
    valorUnitario: 0,
  },
  {
    id: '62',
    descricao: 'Copo descartável 300ml',
    unidade: 'Un',
    saldo: 0,
    grupo: 'Embalagens',
    valorUnitario: 0,
  },
  {
    id: '63',
    descricao: 'Colorau',
    unidade: 'Kg',
    saldo: 0,
    grupo: 'Temperos',
    valorUnitario: 0,
  },
  {
    id: '64',
    descricao: 'Coco Ralado',
    unidade: 'Kg',
    saldo: 0,
    grupo: 'Doces',
    valorUnitario: 0,
  },
  {
    id: '65',
    descricao: 'Coca Cola Lata 350ml Zero',
    unidade: 'Un',
    saldo: 0,
    grupo: 'Bebidas',
    valorUnitario: 0,
  },
  {
    id: '66',
    descricao: 'Coca Cola Lata 350ml',
    unidade: 'Un',
    saldo: 0,
    grupo: 'Bebidas',
    valorUnitario: 0,
  },
  {
    id: '67',
    descricao: 'Coca Cola 600ml Zero',
    unidade: 'Un',
    saldo: 0,
    grupo: 'Bebidas',
    valorUnitario: 0,
  },
  {
    id: '68',
    descricao: 'Coca Cola 600ml',
    unidade: 'Un',
    saldo: 0,
    grupo: 'Bebidas',
    valorUnitario: 0,
  },
  {
    id: '69',
    descricao: 'Coca Cola 2 Litros Zero',
    unidade: 'Un',
    saldo: 0,
    grupo: 'Bebidas',
    valorUnitario: 0,
  },
  {
    id: '70',
    descricao: 'Coca Cola 2 Litros',
    unidade: 'Un',
    saldo: 0,
    grupo: 'Bebidas',
    valorUnitario: 0,
  },
  {
    id: '71',
    descricao: 'Clipes',
    unidade: 'Un',
    saldo: 0,
    grupo: 'Escritório',
    valorUnitario: 0,
  },
  {
    id: '72',
    descricao: 'Chocolate Branco',
    unidade: 'Kg',
    saldo: 0,
    grupo: 'Doces',
    valorUnitario: 0,
  },
  {
    id: '73',
    descricao: 'Chocolate ao Leite',
    unidade: 'Kg',
    saldo: 0,
    grupo: 'Doces',
    valorUnitario: 0,
  },
  {
    id: '74',
    descricao: 'Cheddar',
    unidade: 'Un',
    saldo: 0,
    grupo: 'Laticínios',
    valorUnitario: 0,
  },
  {
    id: '75',
    descricao: 'Champignon',
    unidade: 'Kg',
    saldo: 0,
    grupo: 'Secos',
    valorUnitario: 0,
  },
  {
    id: '76',
    descricao: 'Cebola Roxa',
    unidade: 'Kg',
    saldo: 0,
    grupo: 'Hortifruti',
    valorUnitario: 0,
  },
  {
    id: '77',
    descricao: 'Cebola Branca',
    unidade: 'Kg',
    saldo: 0,
    grupo: 'Hortifruti',
    valorUnitario: 0,
  },
  {
    id: '78',
    descricao: 'Caneta',
    unidade: 'Un',
    saldo: 0,
    grupo: 'Escritório',
    valorUnitario: 0,
  },
  {
    id: '79',
    descricao: 'Canela',
    unidade: 'Kg',
    saldo: 0,
    grupo: 'Temperos',
    valorUnitario: 0,
  },
  {
    id: '80',
    descricao: 'Caldo de Galinha',
    unidade: 'Kg',
    saldo: 0,
    grupo: 'Temperos',
    valorUnitario: 0,
  },
  {
    id: '81',
    descricao: 'Calabresa',
    unidade: 'Kg',
    saldo: 0,
    grupo: 'Carnes e Frios',
    valorUnitario: 0,
  },
  {
    id: '82',
    descricao: 'Caixa de Pizza Pequena',
    unidade: 'Un',
    saldo: 0,
    grupo: 'Embalagens',
    valorUnitario: 0,
  },
  {
    id: '83',
    descricao: 'Caixa de Pizza Grande',
    unidade: 'Un',
    saldo: 0,
    grupo: 'Embalagens',
    valorUnitario: 0,
  },
  {
    id: '84',
    descricao: 'Bucha de Lavar Louça',
    unidade: 'Un',
    saldo: 0,
    grupo: 'Limpeza',
    valorUnitario: 0,
  },
  {
    id: '85',
    descricao: 'Brocolis Temperado',
    unidade: 'Kg',
    saldo: 0,
    grupo: 'Hortifruti',
    valorUnitario: 0,
  },
  {
    id: '86',
    descricao: 'Brocolis Congelado',
    unidade: 'Kg',
    saldo: 0,
    grupo: 'Hortifruti',
    valorUnitario: 0,
  },
  {
    id: '87',
    descricao: 'Bobina Plastica Pequena',
    unidade: 'Un',
    saldo: 0,
    grupo: 'Embalagens',
    valorUnitario: 0,
  },
  {
    id: '88',
    descricao: 'Bobina Plastica Grande',
    unidade: 'Un',
    saldo: 0,
    grupo: 'Embalagens',
    valorUnitario: 0,
  },
  {
    id: '89',
    descricao: 'Bobina Impressora',
    unidade: 'Un',
    saldo: 0,
    grupo: 'Escritório',
    valorUnitario: 0,
  },
  {
    id: '90',
    descricao: 'Bicabornato',
    unidade: 'Kg',
    saldo: 0,
    grupo: 'Secos',
    valorUnitario: 0,
  },
  {
    id: '91',
    descricao: 'Batata Palha',
    unidade: 'Kg',
    saldo: 0,
    grupo: 'Secos',
    valorUnitario: 0,
  },
  {
    id: '92',
    descricao: 'Barbecue',
    unidade: 'Kg',
    saldo: 0,
    grupo: 'Condimentos',
    valorUnitario: 0,
  },
  {
    id: '93',
    descricao: 'Banana Nanica',
    unidade: 'Kg',
    saldo: 0,
    grupo: 'Hortifruti',
    valorUnitario: 0,
  },
  {
    id: '94',
    descricao: 'Bacon em Cubos',
    unidade: 'Kg',
    saldo: 0,
    grupo: 'Carnes e Frios',
    valorUnitario: 0,
  },
  {
    id: '95',
    descricao: 'Azeitona',
    unidade: 'Kg',
    saldo: 0,
    grupo: 'Secos',
    valorUnitario: 0,
  },
  {
    id: '96',
    descricao: 'Atum',
    unidade: 'Kg',
    saldo: 0,
    grupo: 'Secos',
    valorUnitario: 0,
  },
  {
    id: '97',
    descricao: 'Apresuntado',
    unidade: 'Kg',
    saldo: 0,
    grupo: 'Carnes e Frios',
    valorUnitario: 0,
  },
  {
    id: '98',
    descricao: 'Alho Frito',
    unidade: 'Kg',
    saldo: 0,
    grupo: 'Temperos',
    valorUnitario: 0,
  },
  {
    id: '99',
    descricao: 'Alho Descascado',
    unidade: 'Kg',
    saldo: 0,
    grupo: 'Hortifruti',
    valorUnitario: 0,
  },
  {
    id: '100',
    descricao: 'Alcool',
    unidade: 'Un',
    saldo: 0,
    grupo: 'Limpeza',
    valorUnitario: 0,
  },
  {
    id: '101',
    descricao: 'Alcatra',
    unidade: 'Kg',
    saldo: 0,
    grupo: 'Carnes e Frios',
    valorUnitario: 0,
  },
  {
    id: '102',
    descricao: 'Agua sem Gás 500ml',
    unidade: 'Un',
    saldo: 0,
    grupo: 'Bebidas',
    valorUnitario: 0,
  },
  {
    id: '103',
    descricao: 'Agua com Gás 500ml',
    unidade: 'Un',
    saldo: 0,
    grupo: 'Bebidas',
    valorUnitario: 0,
  },
  {
    id: '104',
    descricao: 'Açucar',
    unidade: 'Kg',
    saldo: 0,
    grupo: 'Secos',
    valorUnitario: 0,
  },
  {
    id: '105',
    descricao: 'Copo West Coast',
    unidade: 'Un',
    saldo: 0,
    grupo: 'Embalagens',
    valorUnitario: 0,
  },
];

export default function InventoryApp() {
  useEffect(() => {
    if (!document.getElementById('tailwind-script')) {
      const script = document.createElement('script');
      script.id = 'tailwind-script';
      script.src = 'https://cdn.tailwindcss.com';
      document.head.appendChild(script);
    }
  }, []);

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [loginUser, setLoginUser] = useState('');
  const [loginPass, setLoginPass] = useState('');
  const [loginError, setLoginError] = useState('');
  const [userRole, setUserRole] = useState(null);

  const [isDbConnected, setIsDbConnected] = useState(false);
  const [catalog, setCatalog] = useState([]);
  const [contagens, setContagens] = useState({});
  const [editingSaldos, setEditingSaldos] = useState({});
  const [historico, setHistorico] = useState([]);
  const [inventarioSelecionado, setInventarioSelecionado] = useState(null);

  const [usuariosDB, setUsuariosDB] = useState([]);
  const [novoUser, setNovoUser] = useState({
    username: '',
    password: '',
    role: 'equipe',
  });

  const [activeTab, setActiveTab] = useState('atual');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterGroup, setFilterGroup] = useState('Todos');
  const [currentDate] = useState(new Date().toLocaleDateString('pt-BR'));

  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [toastMessage, setToastMessage] = useState('');

  const grupos = [
    'Todos',
    ...new Set(catalog.map((item) => item.grupo)),
  ].sort();

  const handleLogin = async () => {
    setIsLoggingIn(true);
    const u = loginUser.toLowerCase().trim();

    if (u === 'gerente' && loginPass === 'admin123') {
      setUserRole('gerente');
      setIsLoggedIn(true);
      setLoginError('');
      setIsLoggingIn(false);
      return;
    }

    try {
      const snapshot = await getDocs(collection(db, 'usuarios_acesso'));
      let found = false;

      snapshot.forEach((doc) => {
        const data = doc.data();
        if (data.username === u && data.password === loginPass) {
          setUserRole(data.role);
          setIsLoggedIn(true);
          setLoginError('');
          found = true;
        }
      });

      if (!found) {
        if (u === 'equipe' && loginPass === 'equipe123' && snapshot.empty) {
          setUserRole('equipe');
          setIsLoggedIn(true);
          setLoginError('');
        } else {
          setLoginError('Usuário ou senha incorretos.');
        }
      }
    } catch (e) {
      setLoginError('Erro de conexão com o banco.');
    }
    setIsLoggingIn(false);
  };

  useEffect(() => {
    if (!isLoggedIn) return;
    const catalogRef = collection(db, 'produtos');
    const unsubCatalog = onSnapshot(catalogRef, (snap) => {
      if (snap.empty && catalog.length === 0) {
        initialData.forEach(async (item) => {
          await setDoc(doc(db, 'produtos', item.id), item);
        });
      } else {
        const items = snap.docs.map((d) => d.data());
        items.sort((a, b) => parseInt(a.id) - parseInt(b.id));
        setCatalog(items);
        setIsDbConnected(true);
      }
    });

    const historyRef = collection(db, 'historico');
    const unsubHistory = onSnapshot(historyRef, (snap) => {
      const h = snap.docs.map((d) => ({ ...d.data(), fbId: d.id }));
      h.sort((a, b) => b.timestamp - a.timestamp);
      setHistorico(h);
    });

    return () => {
      unsubCatalog();
      unsubHistory();
    };
  }, [isLoggedIn]);

  useEffect(() => {
    if (activeTab === 'usuarios') {
      const carregarUsers = async () => {
        const snap = await getDocs(collection(db, 'usuarios_acesso'));
        const lista = [];
        snap.forEach((doc) => lista.push({ id: doc.id, ...doc.data() }));
        setUsuariosDB(lista);
      };
      carregarUsers();
    }
  }, [activeTab]);

  const handleAddUser = async (e) => {
    e.preventDefault();
    if (!novoUser.username || !novoUser.password) return;
    try {
      const docRef = await addDoc(collection(db, 'usuarios_acesso'), novoUser);
      setUsuariosDB([...usuariosDB, { id: docRef.id, ...novoUser }]);
      setNovoUser({ username: '', password: '', role: 'equipe' });
      showToast('Usuário cadastrado com sucesso!');
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteUser = async (id) => {
    if (window.confirm('Excluir este acesso permanentemente?')) {
      await deleteDoc(doc(db, 'usuarios_acesso', id));
      setUsuariosDB(usuariosDB.filter((u) => u.id !== id));
      showToast('Usuário excluído!');
    }
  };

  const inventory = useMemo(() => {
    return catalog.map((item) => ({
      ...item,
      contagem: contagens[item.id] !== undefined ? contagens[item.id] : '',
    }));
  }, [catalog, contagens]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 4000);
  };

  const calculateDerivedValues = (item) => {
    const contagemNum = parseFloat(item.contagem) || 0;
    const saldoNum = parseFloat(item.saldo) || 0;
    const diferenca = contagemNum - saldoNum;
    const displayDiferenca = item.contagem === '' ? '-' : diferenca.toFixed(3);
    const hasDiferenca = diferenca !== 0 && item.contagem !== '';
    return { displayDiferenca, hasDiferenca, diferencaNum: diferenca };
  };

  const handleContagemChange = (id, value) => {
    const numValue = value.replace(/[^0-9.,]/g, '').replace(',', '.');
    setContagens((prev) => ({ ...prev, [id]: numValue }));
  };

  const handleSaldoBlur = async (item, valorDigitado) => {
    if (!isLoggedIn || userRole === 'equipe') return;
    const numValue = valorDigitado.replace(/[^0-9.,-]/g, '').replace(',', '.');
    const newEditing = { ...editingSaldos };
    delete newEditing[item.id];
    setEditingSaldos(newEditing);

    if (numValue !== item.saldo.toString()) {
      try {
        await updateDoc(doc(db, 'produtos', item.id), {
          saldo: numValue || '0',
        });
      } catch (e) {
        console.error(e);
      }
    }
  };

  const salvarInventario = async (limparContagens) => {
    if (!isLoggedIn) return;
    const novoRegistro = {
      id: Date.now().toString(),
      timestamp: Date.now(),
      data: new Date().toLocaleString('pt-BR'),
      itens: inventory.map((item) => ({ ...item })),
      autor: userRole,
    };
    try {
      await setDoc(doc(db, 'historico', novoRegistro.id), novoRegistro);
      setIsSaveModalOpen(false);
      showToast('Inventário salvo na Nuvem!');
      if (limparContagens) setContagens({});
    } catch (e) {
      alert('Erro ao salvar no banco.');
    }
  };

  const deletarHistorico = async () => {
    if (!isLoggedIn || !deleteConfirmId || userRole !== 'gerente') return;
    try {
      await deleteDoc(doc(db, 'historico', deleteConfirmId));
      setDeleteConfirmId(null);
      showToast('Relatório apagado!');
    } catch (e) {}
  };

  const filteredInventory = useMemo(() => {
    const listaAlvo =
      activeTab === 'detalhe_historico' && inventarioSelecionado
        ? inventarioSelecionado.itens
        : inventory;
    return listaAlvo.filter((item) => {
      const matchesSearch =
        item.descricao.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.id.includes(searchTerm);
      const matchesGroup =
        filterGroup === 'Todos' || item.grupo === filterGroup;
      return matchesSearch && matchesGroup;
    });
  }, [inventory, inventarioSelecionado, searchTerm, filterGroup, activeTab]);

  const divergencias = useMemo(() => {
    return inventory.filter(
      (item) => calculateDerivedValues(item).hasDiferenca
    );
  }, [inventory]);

  const compartilharWhatsApp = () => {
    let texto = `*📊 Relatório de Divergências - Inventário*\n🗓️ *Data:* ${currentDate}\n\n`;
    if (divergencias.length === 0) {
      texto += '✅ Tudo batendo certinho! Nenhuma divergência encontrada.\n';
    } else {
      texto += `Foram encontradas ${divergencias.length} divergências:\n\n`;
      divergencias.forEach((item) => {
        const { displayDiferenca, diferencaNum } = calculateDerivedValues(item);
        const sinal = diferencaNum > 0 ? '🟢 Sobrou:' : '🔴 Faltou:';
        texto += `▪️ *${item.descricao}* (${item.grupo})\n   Saldo Sist: ${
          item.saldo || 0
        } | Físico: ${item.contagem}\n   ${sinal} ${displayDiferenca} ${
          item.unidade
        }\n\n`;
      });
    }
    window.open(`https://wa.me/?text=${encodeURIComponent(texto)}`, '_blank');
  };

  const convidarParaContagem = () => {
    const txt = `*📋 Inventário Liberado!*\n\nAcesse o link do sistema para iniciar a contagem de hoje.\n🔗 *Link:* ${window.location.href}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(txt)}`, '_blank');
  };

  if (!isLoggedIn) {
    return (
      <div
        translate="no"
        className="notranslate min-h-screen bg-gray-100 flex items-center justify-center p-4 font-sans"
      >
        <div className="bg-white p-8 rounded-xl shadow-xl w-full max-w-md">
          <div className="flex justify-center mb-6">
            <div className="bg-blue-100 p-4 rounded-full text-blue-600 shadow-sm border border-blue-200">
              <Lock size={32} />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-center text-gray-800 mb-1">
            Acesso ao Sistema
          </h1>
          <p className="text-center text-gray-500 mb-8 text-sm">
            Controle de Inventário Cloud
          </p>

          {loginError && (
            <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-200 flex items-center gap-2">
              <AlertCircle size={16} /> {loginError}
            </div>
          )}

          <div className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1 flex items-center gap-1">
                <User size={14} /> Usuário
              </label>
              <input
                type="text"
                value={loginUser}
                onChange={(e) => setLoginUser(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:bg-white transition-colors outline-none"
                placeholder="Digite seu usuário"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1 flex items-center gap-1">
                <Lock size={14} /> Senha
              </label>
              <input
                type="password"
                value={loginPass}
                onChange={(e) => setLoginPass(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:bg-white transition-colors outline-none"
                placeholder="••••••••"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleLogin();
                  }
                }}
              />
            </div>
            <button
              onClick={handleLogin}
              disabled={isLoggingIn}
              className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors shadow-md flex justify-center items-center gap-2 disabled:bg-blue-400"
            >
              {isLoggingIn ? 'Verificando...' : 'Entrar no Sistema'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      translate="no"
      className="notranslate min-h-screen bg-gray-50 flex flex-col font-sans"
    >
      {toastMessage && (
        <div className="fixed bottom-6 right-6 bg-green-600 text-white px-6 py-3 rounded-lg shadow-2xl font-medium z-50 flex items-center gap-2">
          <CheckCircle size={20} />
          {toastMessage}
        </div>
      )}

      <header className="bg-white border-b border-gray-200 shadow-sm z-10">
        <div className="px-6 py-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 max-w-7xl mx-auto w-full">
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-gray-800 flex items-center gap-2">
              <FileText className="text-blue-600" />
              Gestão de Inventário
              {isDbConnected && (
                <span className="text-xs font-semibold bg-blue-100 text-blue-700 px-2 py-1 rounded-full flex items-center gap-1 ml-2">
                  <Cloud size={12} /> Nuvem Ativa
                </span>
              )}
            </h1>
            <p className="text-sm text-gray-500 mt-1 flex items-center gap-1">
              Perfil logado: <strong className="uppercase">{userRole}</strong> •
              Data: {currentDate}
            </p>
          </div>

          <div className="flex flex-wrap gap-2 print:hidden">
            {userRole === 'gerente' && (
              <button
                onClick={convidarParaContagem}
                className="flex items-center gap-2 px-4 py-2 bg-[#25D366] text-white rounded-lg hover:bg-[#128C7E] transition-colors shadow-sm text-sm font-semibold"
              >
                <MessageSquare size={16} /> Compartilhar App
              </button>
            )}

            <button
              onClick={() => {
                setIsLoggedIn(false);
                setLoginUser('');
                setLoginPass('');
              }}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-200 transition-colors shadow-sm text-sm font-semibold"
            >
              <LogOut size={16} /> Sair
            </button>

            {activeTab === 'atual' && (
              <button
                onClick={() => setIsSaveModalOpen(true)}
                className="flex items-center gap-2 px-5 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors shadow-sm text-sm font-medium"
              >
                {userRole === 'gerente' ? (
                  <Save size={16} />
                ) : (
                  <CheckCircle size={16} />
                )}
                {userRole === 'gerente'
                  ? 'Gravar Inventário'
                  : 'Finalizar Contagem'}
              </button>
            )}
          </div>
        </div>

        <div className="px-6 flex gap-6 max-w-7xl mx-auto w-full print:hidden overflow-x-auto">
          <button
            onClick={() => setActiveTab('atual')}
            className={`py-3 px-2 font-medium text-sm flex items-center gap-2 border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'atual'
                ? 'border-blue-600 text-blue-700'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <CheckCircle size={18} /> Inventário Atual
          </button>
          <button
            onClick={() => setActiveTab('historico')}
            className={`py-3 px-2 font-medium text-sm flex items-center gap-2 border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'historico' || activeTab === 'detalhe_historico'
                ? 'border-blue-600 text-blue-700'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <History size={18} /> Histórico na Nuvem
          </button>

          {userRole === 'gerente' && (
            <>
              <button
                onClick={() => setActiveTab('relatorio')}
                className={`py-3 px-2 font-medium text-sm flex items-center gap-2 border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === 'relatorio'
                    ? 'border-red-500 text-red-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <AlertCircle size={18} /> Divergências
              </button>
              <button
                onClick={() => setActiveTab('usuarios')}
                className={`py-3 px-2 font-medium text-sm flex items-center gap-2 border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === 'usuarios'
                    ? 'border-purple-600 text-purple-700'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <Users size={18} /> Controle de Acessos
              </button>
            </>
          )}
        </div>
      </header>

      <main className="flex-1 overflow-hidden flex flex-col max-w-7xl mx-auto w-full px-4 sm:px-6 py-6">
        {activeTab === 'usuarios' && userRole === 'gerente' && (
          <section className="flex-1 bg-white rounded-xl shadow-sm border border-gray-100 p-6 overflow-y-auto">
            <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <UserPlus className="text-purple-600" /> Criar Novos Acessos
            </h2>

            <div className="bg-gray-50 p-5 rounded-xl border border-gray-200 mb-8">
              <form
                onSubmit={handleAddUser}
                className="flex flex-wrap gap-4 items-end"
              >
                <div className="flex-1 min-w-[200px]">
                  <label className="block text-xs font-semibold text-gray-600 uppercase mb-2">
                    Usuário (Login)
                  </label>
                  <input
                    required
                    type="text"
                    value={novoUser.username}
                    onChange={(e) =>
                      setNovoUser({
                        ...novoUser,
                        username: e.target.value.toLowerCase().trim(),
                      })
                    }
                    className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                    placeholder="ex: pedro.estoque"
                  />
                </div>
                <div className="flex-1 min-w-[200px]">
                  <label className="block text-xs font-semibold text-gray-600 uppercase mb-2">
                    Senha
                  </label>
                  <input
                    required
                    type="text"
                    value={novoUser.password}
                    onChange={(e) =>
                      setNovoUser({ ...novoUser, password: e.target.value })
                    }
                    className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                    placeholder="Digite a senha"
                  />
                </div>
                <div className="w-48">
                  <label className="block text-xs font-semibold text-gray-600 uppercase mb-2">
                    Perfil
                  </label>
                  <select
                    value={novoUser.role}
                    onChange={(e) =>
                      setNovoUser({ ...novoUser, role: e.target.value })
                    }
                    className="w-full p-2.5 border border-gray-300 rounded-lg bg-white outline-none"
                  >
                    <option value="equipe">Equipe (Contador)</option>
                    <option value="gerente">Gerente (Admin)</option>
                  </select>
                </div>
                <button
                  type="submit"
                  className="bg-purple-600 text-white px-6 py-2.5 rounded-lg font-bold hover:bg-purple-700 transition-colors h-[46px] shadow-sm"
                >
                  Salvar
                </button>
              </form>
            </div>

            <div>
              <h3 className="font-bold text-gray-700 mb-4 flex items-center gap-2">
                <Users size={18} /> Usuários Cadastrados na Nuvem
              </h3>
              <div className="overflow-x-auto rounded-xl border border-gray-200">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                        Nome de Usuário
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                        Senha Ativa
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                        Perfil
                      </th>
                      <th className="px-6 py-3 text-center text-xs font-semibold text-gray-600 uppercase">
                        Ação
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    <tr className="bg-purple-50/50">
                      <td className="px-6 py-4 text-sm font-bold text-gray-900">
                        gerente
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 font-mono">
                        admin123
                      </td>
                      <td className="px-6 py-4 text-sm font-bold text-purple-700 uppercase">
                        GERENTE{' '}
                        <span className="text-[10px] text-purple-500 lowercase ml-1">
                          (Chave Mestra)
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center text-xs text-gray-400 font-medium">
                        Padrão do Sistema
                      </td>
                    </tr>
                    {usuariosDB.map((u) => (
                      <tr
                        key={u.id}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-6 py-4 text-sm font-medium text-gray-800">
                          {u.username}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600 font-mono">
                          {u.password}
                        </td>
                        <td className="px-6 py-4 text-sm font-bold text-blue-600 uppercase">
                          {u.role}
                        </td>
                        <td className="px-6 py-4 text-center">
                          <button
                            onClick={() => handleDeleteUser(u.id)}
                            className="text-red-500 hover:bg-red-50 hover:text-red-700 p-2 rounded-lg transition-colors"
                          >
                            <Trash2 size={18} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        )}

        {(activeTab === 'atual' || activeTab === 'detalhe_historico') && (
          <section className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6 flex flex-wrap gap-4 items-end shrink-0 print:hidden">
            {activeTab === 'detalhe_historico' && (
              <button
                onClick={() => setActiveTab('historico')}
                className="mb-1 flex items-center gap-1 text-blue-600 hover:text-blue-800 font-medium text-sm pr-4 border-r border-gray-200"
              >
                <ArrowLeft size={16} /> Voltar
              </button>
            )}

            <div className="flex-1 min-w-[200px]">
              <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2">
                Buscar Insumo
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="text"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Ex: Tomate, Copo, Chocolate..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <div className="w-full sm:w-64">
              <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2">
                Grupo
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Filter className="h-4 w-4 text-gray-400" />
                </div>
                <select
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 sm:text-sm appearance-none bg-white"
                  value={filterGroup}
                  onChange={(e) => setFilterGroup(e.target.value)}
                >
                  {grupos.map((grupo) => (
                    <option key={grupo} value={grupo}>
                      {grupo}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex items-center pb-2 px-2 w-full sm:w-auto">
              <span className="text-sm text-gray-500 font-medium bg-gray-100 px-3 py-1 rounded-full">
                {filteredInventory.length} itens listados
              </span>
            </div>
          </section>
        )}

        {activeTab === 'historico' && (
          <section className="flex-1 bg-white rounded-xl shadow-sm border border-gray-100 p-6 overflow-y-auto">
            <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <Cloud className="text-blue-500" /> Inventários Salvos
            </h2>

            {historico.length === 0 ? (
              <div className="text-center py-16 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                <Calendar className="mx-auto h-12 w-12 text-gray-400 mb-3" />
                <h3 className="text-lg font-medium text-gray-900">
                  Banco de Dados Vazio
                </h3>
                <p className="text-gray-500 mt-1">
                  Quando alguém gravar um inventário, ele aparecerá aqui.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {historico.map((reg) => {
                  const itensConferidos = reg.itens.filter(
                    (i) => i.contagem !== ''
                  ).length;
                  return (
                    <div
                      key={reg.id}
                      className="border border-gray-200 rounded-lg p-5 hover:border-blue-400 hover:shadow-md transition-all flex flex-col cursor-pointer group"
                      onClick={() => {
                        setInventarioSelecionado(reg);
                        setActiveTab('detalhe_historico');
                      }}
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-1">
                            Data da Conferência
                          </p>
                          <p className="text-lg font-bold text-gray-800">
                            {reg.data.split(' ')[0]}
                          </p>
                          <p className="text-sm text-gray-500">
                            {reg.data.split(' ')[1]}
                          </p>
                        </div>
                        <div className="bg-blue-50 p-2 rounded-full text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                          <ChevronRight size={20} />
                        </div>
                      </div>
                      <div className="mt-auto pt-4 border-t border-gray-100 flex justify-between items-center text-sm">
                        <span className="text-gray-600">
                          <strong>{itensConferidos}</strong> itens contados
                        </span>
                        {userRole === 'gerente' && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setDeleteConfirmId(reg.fbId);
                            }}
                            className="text-red-400 hover:text-red-600 transition-colors p-1"
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        )}

        {(activeTab === 'atual' || activeTab === 'detalhe_historico') && (
          <section className="flex-1 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col relative">
            {!isDbConnected && (
              <div className="absolute inset-0 bg-white/80 backdrop-blur flex items-center justify-center z-20">
                <div className="text-gray-600 flex flex-col items-center">
                  <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-3"></div>
                  Conectando ao banco de dados...
                </div>
              </div>
            )}

            {activeTab === 'detalhe_historico' && inventarioSelecionado && (
              <div className="bg-blue-50/80 px-6 py-3 border-b border-blue-100 flex justify-between items-center print:hidden">
                <span className="text-blue-800 font-medium flex items-center gap-2">
                  <AlertCircle size={18} />
                  Inventário de: <strong>{inventarioSelecionado.data}</strong>
                </span>
                <span className="text-xs bg-blue-200 text-blue-800 px-2 py-1 rounded uppercase font-bold tracking-wider">
                  Modo Leitura
                </span>
              </div>
            )}

            <div className="overflow-x-auto overflow-y-auto flex-1 pb-20">
              <table className="min-w-full divide-y divide-gray-200 relative">
                <thead className="bg-gray-50 sticky top-0 z-10 shadow-sm">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase w-16">
                      Cód.
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                      Insumo
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase w-32 hidden sm:table-cell">
                      Grupo
                    </th>
                    <th className="px-2 py-3 text-center text-xs font-semibold text-gray-600 uppercase w-16">
                      Unid.
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase w-32 bg-blue-50/50">
                      Saldo Sist. {userRole === 'gerente' && '✎'}
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-semibold text-blue-700 uppercase w-32 bg-blue-50">
                      Qtde Real ✎
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase w-24">
                      Dif.
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredInventory.map((item, index) => {
                    const { displayDiferenca, diferencaNum } =
                      calculateDerivedValues(item);
                    const isReadOnly = activeTab === 'detalhe_historico';

                    const saldoAtualExibido =
                      editingSaldos[item.id] !== undefined
                        ? editingSaldos[item.id]
                        : item.saldo || '';

                    return (
                      <tr
                        key={item.id}
                        className={`hover:bg-gray-50 transition-colors ${
                          index % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'
                        }`}
                      >
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 font-mono">
                          {item.id}
                        </td>
                        <td
                          className="px-4 py-3 text-sm font-medium text-gray-900 line-clamp-1 truncate max-w-[200px] sm:max-w-[250px]"
                          title={item.descricao}
                        >
                          {item.descricao}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-xs text-gray-500 hidden sm:table-cell">
                          {item.grupo}
                        </td>
                        <td className="px-2 py-3 whitespace-nowrap text-sm text-gray-500 text-center font-medium bg-gray-100/50 rounded-md">
                          {item.unidade}
                        </td>

                        <td className="px-4 py-2 whitespace-nowrap bg-blue-50/10">
                          {isReadOnly || userRole === 'equipe' ? (
                            <div className="text-right text-sm text-gray-700 font-medium px-2 py-1.5">
                              {item.saldo}
                            </div>
                          ) : (
                            <input
                              type="text"
                              className="w-full px-2 py-1.5 border border-transparent hover:border-gray-300 rounded focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-right font-medium text-gray-700 bg-transparent hover:bg-white focus:bg-white"
                              placeholder="0"
                              value={saldoAtualExibido}
                              onChange={(e) =>
                                setEditingSaldos({
                                  ...editingSaldos,
                                  [item.id]: e.target.value,
                                })
                              }
                              onBlur={(e) =>
                                handleSaldoBlur(item, e.target.value)
                              }
                            />
                          )}
                        </td>

                        <td
                          className={`px-4 py-2 whitespace-nowrap ${
                            isReadOnly ? 'bg-transparent' : 'bg-blue-50/30'
                          }`}
                        >
                          {isReadOnly ? (
                            <div className="text-right text-sm text-blue-900 font-bold px-2 py-1.5">
                              {item.contagem || '-'}
                            </div>
                          ) : (
                            <input
                              type="number"
                              className="w-full px-2 py-1.5 border border-blue-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-right font-medium text-blue-900 placeholder-gray-400 bg-white shadow-sm"
                              placeholder="0"
                              value={item.contagem}
                              onChange={(e) =>
                                handleContagemChange(item.id, e.target.value)
                              }
                            />
                          )}
                        </td>

                        <td
                          className={`px-4 py-3 whitespace-nowrap text-sm font-bold text-right ${
                            item.contagem === ''
                              ? 'text-gray-400'
                              : diferencaNum > 0
                              ? 'text-green-600 bg-green-50'
                              : diferencaNum < 0
                              ? 'text-red-600 bg-red-50'
                              : 'text-gray-500'
                          }`}
                        >
                          {diferencaNum > 0 && item.contagem !== '' ? '+' : ''}
                          {displayDiferenca}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {activeTab === 'relatorio' && userRole === 'gerente' && (
          <section className="flex-1 bg-white rounded-xl shadow-sm border border-gray-100 p-6 overflow-y-auto print:p-0 print:border-none print:shadow-none print:bg-transparent">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4 print:hidden">
              <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                <AlertCircle className="text-red-500" /> Relatório de
                Divergências
              </h2>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={compartilharWhatsApp}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors shadow-sm text-sm font-medium"
                >
                  <Share2 size={16} /> Enviar WhatsApp
                </button>
                <button
                  onClick={() => window.print()}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors shadow-sm text-sm font-medium"
                >
                  <Printer size={16} /> Imprimir / PDF
                </button>
              </div>
            </div>

            <div className="hidden print:block mb-6 border-b pb-4">
              <h1 className="text-2xl font-bold text-gray-900">
                Relatório de Divergências de Inventário
              </h1>
              <div className="flex gap-4 mt-2 text-sm text-gray-600">
                <p>
                  <strong>Data:</strong> {currentDate}
                </p>
                <p>
                  <strong>Total com diferença:</strong> {divergencias.length}
                </p>
              </div>
            </div>

            {divergencias.length === 0 ? (
              <div className="text-center py-16 bg-gray-50 rounded-lg border border-dashed border-gray-300 print:hidden">
                <CheckCircle className="mx-auto h-12 w-12 text-green-500 mb-3" />
                <h3 className="text-lg font-medium text-gray-900">
                  Tudo batendo certinho!
                </h3>
                <p className="text-gray-500 mt-1">
                  Nenhuma divergência encontrada nas contagens feitas até o
                  momento.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 border print:border-gray-300">
                  <thead className="bg-gray-50 print:bg-gray-100">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                        Insumo
                      </th>
                      <th className="px-2 py-3 text-center text-xs font-semibold text-gray-600 uppercase">
                        Unid.
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase">
                        Saldo Sis.
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase">
                        Físico
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-bold text-red-600 uppercase">
                        Diferença
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {divergencias.map((item, index) => {
                      const { displayDiferenca, diferencaNum } =
                        calculateDerivedValues(item);
                      return (
                        <tr
                          key={item.id}
                          className={
                            index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'
                          }
                        >
                          <td className="px-4 py-3 text-sm font-medium text-gray-900">
                            {item.descricao}
                          </td>
                          <td className="px-2 py-3 whitespace-nowrap text-sm text-gray-500 text-center">
                            {item.unidade}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700 text-right">
                            {item.saldo}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 text-right font-medium">
                            {item.contagem}
                          </td>
                          <td
                            className={`px-4 py-3 whitespace-nowrap text-sm font-bold text-right ${
                              diferencaNum > 0
                                ? 'text-green-600'
                                : 'text-red-600'
                            }`}
                          >
                            {diferencaNum > 0 ? '+' : ''}
                            {displayDiferenca}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        )}
      </main>

      {isSaveModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex items-center gap-3">
              <div className="bg-emerald-100 p-2 rounded-full text-emerald-600">
                <Cloud size={24} />
              </div>
              <h2 className="text-xl font-bold text-gray-800">
                Gravar na Nuvem
              </h2>
            </div>
            <div className="p-6">
              <p className="text-gray-600 mb-4 text-sm leading-relaxed">
                Este relatório ficará salvo no banco de dados para consulta na
                aba <strong>"Histórico na Nuvem"</strong>.
              </p>
              <div className="flex flex-col gap-3 mt-6">
                <button
                  onClick={() => salvarInventario(true)}
                  className="w-full px-4 py-3 bg-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-700 transition-colors shadow-sm"
                >
                  Salvar e <strong>Limpar Tela</strong>
                </button>
                <button
                  onClick={() => salvarInventario(false)}
                  className="w-full px-4 py-3 bg-white border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Salvar e <strong>Manter Contagens</strong>
                </button>
                <button
                  onClick={() => setIsSaveModalOpen(false)}
                  className="w-full px-4 py-2 text-gray-500 font-medium hover:text-gray-700 transition-colors mt-2"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {deleteConfirmId && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-sm overflow-hidden">
            <div className="p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                Excluir Relatório?
              </h3>
              <p className="text-sm text-gray-500 mb-6">
                Esta ação apagará o registro permanentemente.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setDeleteConfirmId(null)}
                  className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200"
                >
                  Cancelar
                </button>
                <button
                  onClick={deletarHistorico}
                  className="flex-1 px-4 py-2 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700"
                >
                  Sim, excluir
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}