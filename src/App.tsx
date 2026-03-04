import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./auth/authProvider";

import LoginPage from "./pages/login/login";
import HomePage from "./pages/home/home";
import PrivateRoute from "./routes/privateRoute";
import AppLayout from "./layouts/AppLayout";
import ExecutionCenterPage from "./pages/executionCenter/execucionCenterPage";
import NovoProcessoPage from "./pages/novoProcesso/NovoProcessoPage";
import ProcessoPage from "./pages/processo/processoPage";
import DocumentosPage from "./pages/documentos/documentos";
import DistribuicaoCarga from "./pages/distribuicaoCarga/distribuicaoCarga";
import EmpresasPage from "./pages/empresas/empresasPage";
import UsuariosPage from "./pages/usuarios/usuariosPage";

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LoginPage />} />

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
            <Route path="/usuarios" element={<UsuariosPage />} />
            {/* futuras páginas entram aqui */}
            {/* <Route path="/agenda" element={<AgendaPage />} /> */}
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}
