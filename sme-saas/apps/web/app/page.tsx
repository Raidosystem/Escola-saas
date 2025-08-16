export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-4xl mx-auto p-8 text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-6">
          Sistema de Gestão Educacional
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Plataforma completa para gerenciamento de escolas municipais
        </p>
        
        <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
          <a 
            href="/login" 
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition duration-200 block"
          >
            Fazer Login
          </a>
          <a 
            href="/register" 
            className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition duration-200 block"
          >
            Criar Conta
          </a>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mt-12">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="text-4xl mb-4">🏫</div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Gestão Escolar</h3>
            <p className="text-gray-600">Controle de escolas, turmas e matrículas</p>
          </div>
          
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="text-4xl mb-4">🍎</div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Alimentação</h3>
            <p className="text-gray-600">Gestão da merenda escolar</p>
          </div>
          
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="text-4xl mb-4">🚌</div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Transporte</h3>
            <p className="text-gray-600">Controle de rotas e veículos</p>
          </div>
        </div>
      </div>
    </div>
  );
}
