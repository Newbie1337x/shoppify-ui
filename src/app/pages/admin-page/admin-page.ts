import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

type TrendDirection = 'up' | 'down' | 'flat';
type ActivityStatus = 'completed' | 'in-progress' | 'pending';

interface OverviewCard {
  label: string;
  value: string;
  trend: TrendDirection;
  trendText: string;
  variant: 'violet' | 'indigo' | 'teal';
}

interface InsightCard {
  icon: string;
  title: string;
  description: string;
  highlight: string;
  helper: string;
}

interface QuickAction {
  icon: string;
  label: string;
  description: string;
  hint: string;
  accent: 'violet' | 'sky' | 'amber' | 'emerald';
}

interface ActivityItem {
  title: string;
  description: string;
  when: string;
  status: ActivityStatus;
}

@Component({
  selector: 'app-admin-page',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './admin-page.html',
  styleUrls: ['./admin-page.css']
})
export class AdminPage {
  overviewCards: OverviewCard[] = [
    {
      label: 'Ventas de hoy',
      value: '$12.8K',
      trend: 'up',
      trendText: '+12% vs ayer',
      variant: 'violet'
    },
    {
      label: 'Pedidos abiertos',
      value: '47',
      trend: 'flat',
      trendText: '15 priorizados',
      variant: 'indigo'
    },
    {
      label: 'Nivel de stock',
      value: '92%',
      trend: 'up',
      trendText: 'Inventario saludable',
      variant: 'teal'
    }
  ];

  insightCards: InsightCard[] = [
    {
      icon: 'TC',
      title: 'Top categoria',
      description: 'Electronica mantiene el 38% de la facturacion semanal.',
      highlight: '+8.3%',
      helper: 'crecimiento semanal'
    },
    {
      icon: 'LG',
      title: 'Logistica',
      description: 'El 94% de las ordenes salio a tiempo durante las ultimas 24h.',
      highlight: '6 pendientes',
      helper: 'requieren seguimiento'
    },
    {
      icon: 'XP',
      title: 'Experiencia',
      description: 'Los clientes calificaron sus compras con 4.8 estrellas en promedio.',
      highlight: '126 resenas',
      helper: 'ultimos 7 dias'
    }
  ];

  quickActions: QuickAction[] = [
    {
      icon: '+',
      label: 'Nuevo producto',
      description: 'Publica un lanzamiento y programalo en el catalogo.',
      hint: '5 min',
      accent: 'violet'
    },
    {
      icon: 'AD',
      label: 'Campana flash',
      description: 'Crea un banner destacado para impulsar ventas express.',
      hint: 'Promueve ahora',
      accent: 'sky'
    },
    {
      icon: '$',
      label: 'Actualizar precios',
      description: 'Ajusta margenes y descuentos de forma masiva.',
      hint: 'Lista inteligente',
      accent: 'amber'
    },
    {
      icon: 'EQ',
      label: 'Invitar colaborador',
      description: 'Agrega un nuevo miembro y asigna permisos personalizados.',
      hint: 'Roles seguros',
      accent: 'emerald'
    }
  ];

  activityFeed: ActivityItem[] = [
    {
      title: 'Lucia valido 12 productos',
      description: 'Se actualizaron imagenes y descripciones para la coleccion otono.',
      when: 'Hace 12 minutos',
      status: 'completed'
    },
    {
      title: 'Envia recordatorio de pago',
      description: '3 pedidos con mas de 48h sin confirmacion de transferencia.',
      when: 'Hace 26 minutos',
      status: 'pending'
    },
    {
      title: 'Control de inventario semanal',
      description: 'El equipo de almacen esta auditando 4 categorias criticas.',
      when: 'En progreso',
      status: 'in-progress'
    }
  ];
}

