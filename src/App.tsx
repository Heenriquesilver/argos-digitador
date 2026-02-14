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
            {/* futuras páginas entram aqui */}
            {/* <Route path="/agenda" element={<AgendaPage />} /> */}
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}
