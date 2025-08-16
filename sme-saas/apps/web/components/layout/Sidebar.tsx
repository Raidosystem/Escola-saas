"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const nav = [
  { label: 'Dashboard', href: '/' },
  { label: 'Alunos', href: '/secretaria/pessoas/alunos' },
  { label: 'Escolas', href: '/secretaria/estrutura/escolas' },
  { label: 'Matrículas', href: '/secretaria/matriculas' },
  { label: 'Frequência', href: '/secretaria/academico/frequencia' },
  { label: 'Inscrições', href: '/vagas/inscricoes' },
  { label: 'Cardápios', href: '/alimentacao/cardapios' },
  { label: 'Rotas', href: '/transporte/rotas' },
];

export function Sidebar() {
  const pathname = usePathname();
  return (
    <aside className="sidebar">
      <div className="p-4 text-lg font-bold">SME SaaS</div>
      <nav className="flex-1 space-y-1">
        {nav.map(item => (
          <Link key={item.href} href={item.href} className={`nav-link ${pathname === item.href ? 'active' : ''}`}>{item.label}</Link>
        ))}
      </nav>
    </aside>
  );
}

export default Sidebar;
