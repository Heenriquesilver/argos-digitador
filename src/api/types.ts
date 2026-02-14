export interface LoginCredentials {
  email: string;
  senha: string;
}

export interface Usuario {
  id: string;
  pessoaFisica: {
    id: number;
    entidade: {
      id: string;
      nomeSocial: string;
      generoSocial: number;
      tipo: string;
      linkLogo: string;
    };
    nome: string;
    dtNascto: string;
    cpf: string;
    telefone: string;
  };
  email: string;
  permissoes: {
    id: number;
    titulo: string;
    chave: string;
  }[];
  ativo: number;
  chaveAtivacao: string;
}

export interface LoginResponse {
  usuario: Usuario;
  authenticated: boolean;
  created: string;
  expiration: string;
  accessToken: string;
  refreshToken: string;
}

//tipagem conexão social

export interface EntidadeSocial {
  id: number;
  nomeSocial: string;
  generoSocial: number;
  tipo: string;
  linkLogo: string;
}

// Tipagem para o tipo de conexão social
export interface TipoConexaoSocial {
  id: number;
  titulo: string;
  criacao: string;
  atualizacao: string;
}

// Tipagem para cada elemento da lista
export interface Element {
  id: number;
  entidadePai: EntidadeSocial;
  entidadeFilha: EntidadeSocial;
  tipoConexaoSocial: TipoConexaoSocial;
  criacao: string;
  atualizacao: string;
  ativo: number;
}

// Tipagem da página completa
export interface ConexaoSocialOutput {
  totalElements: number;
  pageSize: number;
  totalPages: number;
  elements: Element[];
}

// type TEntidadeEspecialidade = {
//   id: number;
//   nomeSocial: string;
//   generoSocial: number;
//   tipo: string;
//   linklogo: string;
// };

export type TEspecialidade = {
  id: number;
  titulo: string;
  descricao: string;
  cbo: string;
  criacao: string;
  atualizacao: string;
};
