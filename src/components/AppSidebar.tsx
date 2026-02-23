import { NavLink, useLocation } from 'react-router-dom';
import { LayoutDashboard, List, Kanban, Users, FolderOpen, Settings, UserCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAppStore } from '@/data/store';
import { useState } from 'react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

const mainNav = [
  { label: 'Dashboard', to: '/dashboard', icon: LayoutDashboard },
  { label: 'Painel de Vagas', to: '/vagas', icon: List },
  { label: 'Fluxo de Vagas', to: '/kanban', icon: Kanban },
  { label: 'Candidatos', to: '/candidatos', icon: Users },
  { label: 'Meus Registros', to: '/meus-registros', icon: FolderOpen },
];

const adminNav = [
  { label: 'Administração', to: '/administracao', icon: Settings },
];

export function AppSidebar() {
  const { currentUser } = useAppStore();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const canAdmin = currentUser?.role === 'ADMIN' || currentUser?.role === 'COORDENADOR_RH';

  const linkClass = (path: string) => cn(
    'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150',
    location.pathname === path || (path !== '/dashboard' && location.pathname.startsWith(path))
      ? 'bg-sidebar-muted text-primary'
      : 'text-sidebar-fg/70 hover:text-sidebar-fg hover:bg-sidebar-muted/50'
  );

  const renderLink = (item: typeof mainNav[0]) => {
    const link = (
      <NavLink to={item.to} className={linkClass(item.to)}>
        <item.icon className="h-5 w-5 flex-shrink-0" />
        {!collapsed && <span>{item.label}</span>}
      </NavLink>
    );

    if (collapsed) {
      return (
        <Tooltip key={item.to} delayDuration={0}>
          <TooltipTrigger asChild>{link}</TooltipTrigger>
          <TooltipContent side="right">{item.label}</TooltipContent>
        </Tooltip>
      );
    }
    return <div key={item.to}>{link}</div>;
  };

  const roleLabel = currentUser?.role === 'ADMIN' ? 'Administrador' 
    : currentUser?.role === 'COORDENADOR_RH' ? 'Coordenador RH'
    : currentUser?.role === 'RECRUTADOR' ? 'Recrutador'
    : currentUser?.role === 'COMERCIAL' ? 'Comercial'
    : 'Sem perfil';

  return (
    <aside className={cn(
      'sidebar-gradient flex flex-col h-screen sticky top-0 transition-all duration-200 border-r border-sidebar-muted/30',
      collapsed ? 'w-16' : 'w-60'
    )}>
      <div className="flex items-center justify-between px-4 py-5 border-b border-sidebar-muted/30">
        {!collapsed && (
          <div>
            <h1 className="text-sidebar-fg font-bold text-lg tracking-tight">IDVLabs</h1>
            <p className="text-sidebar-fg/50 text-[10px] uppercase tracking-widest">Talent Acquisition</p>
          </div>
        )}
        <button onClick={() => setCollapsed(!collapsed)} className="text-sidebar-fg/50 hover:text-sidebar-fg p-1 rounded transition-colors">
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </button>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {mainNav.map(renderLink)}
        {canAdmin && (
          <>
            <div className="my-3 border-t border-sidebar-muted/30" />
            {adminNav.map(renderLink)}
          </>
        )}
      </nav>

      <div className="border-t border-sidebar-muted/30 p-3">
        {(() => {
          const link = (
            <NavLink to="/perfil" className={linkClass('/perfil')}>
              <UserCircle className="h-5 w-5 flex-shrink-0" />
              {!collapsed && (
                <div className="min-w-0">
                  <p className="text-sm font-medium truncate text-sidebar-fg">{currentUser?.nome || '...'}</p>
                  <p className="text-[11px] text-sidebar-fg/50 truncate">{roleLabel}</p>
                </div>
              )}
            </NavLink>
          );
          if (collapsed) {
            return (
              <Tooltip delayDuration={0}>
                <TooltipTrigger asChild>{link}</TooltipTrigger>
                <TooltipContent side="right">{currentUser?.nome}</TooltipContent>
              </Tooltip>
            );
          }
          return link;
        })()}
      </div>
    </aside>
  );
}
