import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./auth/authProvider";

// Páginas
import LoginPage from "./pages/login/login";
import HomePage from "./pages/home/home";
import ExecutionCenterPage from "./pages/executionCenter/execucionCenterPage";
import NovoProcessoPage from "./pages/novoProcesso/NovoProcessoPage";
import ProcessoPage from "./pages/processo/processoPage";
import DocumentosPage from "./pages/documentos/documentos";
import DistribuicaoCarga from "./pages/distribuicaoCarga/distribuicaoCarga";
import EmpresasPage from "./pages/empresas/empresasPage";
import NovaEmpresaPage from "./pages/empresas/nova-empresa/novaEmpresaPage";
import ColaboradoresPage from "./pages/colaboradores/ColaboradoresPage";
import CalculoPage from "./pages/calculo/CalculoPage";
import EquipePage from "./pages/equipe/equipePage";
import NovoColaboradorPage from "./pages/novo-colaborador/novoColaborador";
import NovoUsuarioPage from "./pages/novo-usuario/novoUsuario";
import EmpreitadasPage from "./pages/empreitadas/empreitadasPage";
import NovoPacotePage from "./pages/novo-pacote/novoPacote";
import CalculoDetalhesPage from "./pages/processo-detalhado/CalculoDetalhesPage";
import EditarMembroEquipePage from "./pages/editar-membro-equipe/EditarMembroEquipePage";
import NovaEquipePage from "./pages/nova-equipe/NovaEquipePage";
import ClientePage from "./pages/cliente/ClientePage";
import PerfilPage from "./pages/perfil/PerfilPage";

// Layout e Rotas Privadas
import PrivateRoute from "./routes/privateRoute";
import AppLayout from "./layouts/AppLayout";

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Rota pública de login */}
          <Route path="/" element={<LoginPage />} />

          {/* Rotas privadas */}
          <Route
            element={
              <PrivateRoute>
                <AppLayout />
              </PrivateRoute>
            }
          >
            <Route path="/home" element={<HomePage />} />
            <Route path="/execution-center" element={<ExecutionCenterPage />} />
            <Route path="/novo-processo" element={<NovoProcessoPage />} />
            <Route path="/processo" element={<ProcessoPage />} />
            <Route path="/documentos" element={<DocumentosPage />} />
            <Route path="/distribuicao-carga" element={<DistribuicaoCarga />} />
            <Route path="/empresas" element={<EmpresasPage />} />
            <Route path="/empresas/:id/editar" element={<NovaEmpresaPage />} />
            <Route path="/nova-empresa" element={<NovaEmpresaPage />} />
            <Route path="/colaboradores" element={<ColaboradoresPage />} />
            <Route path="/calculos" element={<CalculoPage />} />
            <Route path="/equipe" element={<EquipePage />} />
            <Route path="/novo-colaborador" element={<NovoColaboradorPage />} />
            <Route
              path="/novo-colaborador/:id"
              element={<NovoColaboradorPage />}
            />
            <Route path="/novo-usuario" element={<NovoUsuarioPage />} />
            <Route path="/novo-usuario/:id" element={<NovoUsuarioPage />} />
            <Route path="/empreitadas" element={<EmpreitadasPage />} />
            <Route path="/novo-pacote" element={<NovoPacotePage />} />
            <Route path="/calculo/:id" element={<CalculoDetalhesPage />} />
            <Route path="/processo/editar/:id" element={<NovoProcessoPage />} />
            <Route
              path="/membro-equipe/:id/editar"
              element={<EditarMembroEquipePage />}
            />
            <Route path="/equipe/nova" element={<NovaEquipePage />} />
            <Route path="/equipe/:id/editar" element={<NovaEquipePage />} />
            <Route path="/cliente" element={<ClientePage />} />
            <Route path="/perfil" element={<PerfilPage />} />
            {/* Futuras páginas podem ser adicionadas aqui */}
            {/* <Route path="/agenda" element={<AgendaPage />} /> */}
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}
