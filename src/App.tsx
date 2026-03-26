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
            {/* Futuras páginas podem ser adicionadas aqui */}
            {/* <Route path="/agenda" element={<AgendaPage />} /> */}
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}
