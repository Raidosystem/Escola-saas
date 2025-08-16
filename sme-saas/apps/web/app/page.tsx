'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function getUser() {
      try {
        const { data: { user }, error } = await supabase.auth.getUser();
        if (error) {
          console.error('Error getting user:', error);
        } else {
          setUser(user);
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    }

    getUser();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-800 mb-6">
            Sistema de Gestão Educacional
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Plataforma completa para gerenciamento de escolas municipais, secretarias de educação e processos educacionais.
          </p>
          
          {user ? (
            <div className="bg-white rounded-lg shadow-lg p-8 max-w-md mx-auto">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                Bem-vindo, {user.email}!
              </h2>
              <p className="text-gray-600 mb-6">
                Escolha uma seção para começar:
              </p>
              <div className="space-y-4">
                <button
                  onClick={() => router.push('/secretaria')}
                  className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition duration-200"
                >
                  Secretaria de Educação
                </button>
                <button
                  onClick={() => router.push('/alimentacao')}
                  className="w-full bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition duration-200"
                >
                  Alimentação Escolar
                </button>
                <button
                  onClick={() => router.push('/transporte')}
                  className="w-full bg-yellow-600 text-white px-6 py-3 rounded-lg hover:bg-yellow-700 transition duration-200"
                >
                  Transporte Escolar
                </button>
                <button
                  onClick={() => router.push('/vagas')}
                  className="w-full bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition duration-200"
                >
                  Vagas e Inscrições
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-lg p-8 max-w-md mx-auto">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                Acesso ao Sistema
              </h2>
              <p className="text-gray-600 mb-6">
                Entre com suas credenciais para acessar o sistema.
              </p>
              <div className="space-y-4">
                <button
                  onClick={() => router.push('/login')}
                  className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition duration-200"
                >
                  Fazer Login
                </button>
                <button
                  onClick={() => router.push('/register')}
                  className="w-full bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition duration-200"
                >
                  Criar Conta
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="grid md:grid-cols-3 gap-8 mt-16">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="text-blue-600 text-4xl mb-4">🏫</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Gestão Escolar</h3>
            <p className="text-gray-600">
              Controle completo de escolas, turmas, matrículas e dados acadêmicos.
            </p>
          </div>
          
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="text-green-600 text-4xl mb-4">🍎</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Alimentação</h3>
            <p className="text-gray-600">
              Planejamento de cardápios, controle nutricional e gestão da merenda escolar.
            </p>
          </div>
          
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="text-yellow-600 text-4xl mb-4">🚌</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Transporte</h3>
            <p className="text-gray-600">
              Controle de rotas, veículos e transporte escolar para os estudantes.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
