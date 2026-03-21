import { Outlet, useLocation } from 'react-router-dom';
import { AppSidebar } from './AppSidebar';

const breadcrumbMap: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/vagas': 'Painel de Vagas',
  '/vagas/nova': 'Nova Vaga',
  '/kanban': 'Fluxo de Vagas',
  '/candidatos': 'Candidatos',
  '/assistente-recrutamento': 'Assistente de Recrutamento',
  '/meus-registros': 'Meus Registros',
  '/administracao': 'Administração',
  '/perfil': 'Meu Perfil',
};

export function Layout() {
  const location = useLocation();
  const pathSegments = location.pathname.split('/').filter(Boolean);
  const pageTitle = breadcrumbMap[location.pathname]
    || (pathSegments[0] === 'vagas' && pathSegments[1] && pathSegments[1] !== 'nova' ? 'Detalhe da Vaga' : '')
    || (pathSegments[0] === 'candidatos' && pathSegments[1] ? 'Detalhe do Candidato' : '')
    || 'Página';

  return (
    <div className="flex min-h-screen w-full bg-background">
      <AppSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <header className="sticky top-0 z-10 bg-card/80 backdrop-blur-sm border-b px-6 py-3 flex items-center justify-between">
          <div>
            <p className="text-xs text-muted-foreground">
              {pathSegments.map((seg, i) => (
                <span key={i}>
                  {i > 0 && <span className="mx-1">/</span>}
                  <span className="capitalize">{breadcrumbMap['/' + pathSegments.slice(0, i + 1).join('/')] || seg}</span>
                </span>
              ))}
            </p>
            <h2 className="text-lg font-semibold text-foreground">{pageTitle}</h2>
          </div>
        </header>
        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
