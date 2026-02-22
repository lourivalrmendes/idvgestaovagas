import { User, Vaga, Candidato, EnvioCandidato, VagaStatus } from '@/types';

export const CLIENTES = ['Itaú Digital', 'Ambev Tech', 'Magazine Luiza', 'Nubank', 'Stone Pagamentos'];
export const UNIDADES_NEGOCIO = ['Enterprise', 'Mid-Market', 'Startups'];
export const CATEGORIAS = ['Tecnologia', 'Engenharia de Dados', 'Produto', 'Design', 'DevOps'];

export const USERS: User[] = [
  { id: 'USR-001', nome: 'Ana Silva', area: 'RH', perfil: 'Coordenador RH', email: 'ana.silva@idvlabs.com', telefone: '(11) 99001-0001', ativo: true },
  { id: 'USR-002', nome: 'Carlos Santos', area: 'RH', perfil: 'Recrutador', email: 'carlos.santos@idvlabs.com', telefone: '(11) 99002-0002', ativo: true },
  { id: 'USR-003', nome: 'Mariana Costa', area: 'RH', perfil: 'Recrutador', email: 'mariana.costa@idvlabs.com', telefone: '(11) 99003-0003', ativo: true },
  { id: 'USR-004', nome: 'Felipe Oliveira', area: 'Comercial', perfil: 'Comercial', email: 'felipe.oliveira@idvlabs.com', telefone: '(11) 99004-0004', ativo: true },
  { id: 'USR-005', nome: 'Roberto Lima', area: 'Administrativo', perfil: 'Administrador', email: 'roberto.lima@idvlabs.com', telefone: '(11) 99005-0005', ativo: true },
  { id: 'USR-006', nome: 'Julia Mendes', area: 'Comercial', perfil: 'Comercial', email: 'julia.mendes@idvlabs.com', telefone: '(11) 99006-0006', ativo: true },
];

const vagaDefaults = {
  data_solicitacao: '2026-01-10',
  nome_solicitante: 'Felipe Oliveira',
  area_solicitante: 'Comercial',
  motivo_abertura_vaga: 'Expansão do time',
  faixa_salarial: 'R$ 10.000 - R$ 15.000',
  tipo_contratacao: { pj: false, clt: true, alocacao: false },
  tempo_de_contrato: '',
  horario_trabalho: '09:00 - 18:00',
  quantidade_horas_mes: 168,
  modalidade_contratacao: { presencial: false, hibrido: true, remoto: false },
  endereco_local_trabalho: 'São Paulo, SP',
  hibrido_dias_presencial: 3,
  data_prevista_inicio: '2026-04-01',
  principais_responsabilidades: 'Desenvolvimento e manutenção de aplicações',
  requisitos_tecnicos: 'React, Node.js, TypeScript',
  nivel_senioridade: 'Pleno',
  formacao: 'Graduação em Ciência da Computação ou áreas correlatas',
  certificacoes: '',
  linguagens_e_frameworks_necessarios: 'JavaScript, TypeScript, React',
  soft_skills: 'Comunicação, trabalho em equipe, proatividade',
  necessario_equipamento: false,
  idioma_ingles: 'Intermediário',
  idioma_espanhol: '',
  observacoes: '',
  tags: [] as string[],
};

function v(
  id: string, status: VagaStatus, cliente: string, funcao: string,
  unidade: string, categoria: string, proprietario: string,
  recrutador: string | null, dataCriacao: string, dataValidacao: string | null,
  overrides?: Partial<Vaga>
): Vaga {
  return {
    id, status, proprietario_user_id: proprietario, recrutador_user_id: recrutador,
    data_criacao: dataCriacao, data_validacao_rh: dataValidacao,
    data_ultima_alteracao: dataCriacao,
    historico_status: [{ status, alterado_por: proprietario, data: dataCriacao }],
    nome_cliente: cliente, funcao, quantidade_de_vagas: 1,
    unidade_negocio: unidade, categoria,
    ...vagaDefaults,
    ...overrides,
  };
}

export const VAGAS: Vaga[] = [
  v('VAG-0001', 'EM_VALIDACAO_RH', 'Itaú Digital', 'Desenvolvedor Full Stack', 'Enterprise', 'Tecnologia', 'USR-004', null, '2026-02-20', null),
  v('VAG-0002', 'EM_VALIDACAO_RH', 'Ambev Tech', 'UX Designer Senior', 'Enterprise', 'Design', 'USR-006', null, '2026-02-19', null),
  v('VAG-0003', 'EM_VALIDACAO_RH', 'Stone Pagamentos', 'Product Manager', 'Startups', 'Produto', 'USR-004', null, '2026-02-21', null, { reprovada_rh_motivo: 'Faixa salarial abaixo do mercado' }),
  v('VAG-0004', 'SEM_CVS_DENTRO_SLA', 'Nubank', 'Engenheiro de Dados', 'Enterprise', 'Engenharia de Dados', 'USR-004', 'USR-002', '2026-02-10', '2026-02-18'),
  v('VAG-0005', 'SEM_CVS_DENTRO_SLA', 'Magazine Luiza', 'DevOps Engineer', 'Mid-Market', 'DevOps', 'USR-006', 'USR-003', '2026-02-12', '2026-02-19'),
  v('VAG-0006', 'SEM_CVS_DENTRO_SLA', 'Itaú Digital', 'Analista de QA', 'Enterprise', 'Tecnologia', 'USR-004', 'USR-002', '2026-02-15', '2026-02-20'),
  v('VAG-0007', 'SEM_CVS_FORA_SLA', 'Ambev Tech', 'Tech Lead Backend', 'Enterprise', 'Tecnologia', 'USR-004', 'USR-002', '2026-01-20', '2026-01-25'),
  v('VAG-0008', 'SEM_CVS_FORA_SLA', 'Magazine Luiza', 'Arquiteto Cloud', 'Mid-Market', 'DevOps', 'USR-006', 'USR-003', '2026-01-15', '2026-01-20'),
  v('VAG-0009', 'COM_CVS_ENVIADOS', 'Itaú Digital', 'Desenvolvedor React Senior', 'Enterprise', 'Tecnologia', 'USR-004', 'USR-002', '2026-01-10', '2026-01-15'),
  v('VAG-0010', 'COM_CVS_ENVIADOS', 'Nubank', 'Data Scientist', 'Enterprise', 'Engenharia de Dados', 'USR-006', 'USR-003', '2026-01-08', '2026-01-12'),
  v('VAG-0011', 'COM_CVS_ENVIADOS', 'Ambev Tech', 'Product Designer', 'Enterprise', 'Design', 'USR-004', 'USR-002', '2026-01-05', '2026-01-10'),
  v('VAG-0012', 'COM_CVS_ENVIADOS', 'Stone Pagamentos', 'Desenvolvedor Mobile', 'Startups', 'Tecnologia', 'USR-006', 'USR-003', '2026-01-12', '2026-01-18'),
  v('VAG-0013', 'COM_CVS_MAIS_15_DIAS_SEM_RETORNO', 'Magazine Luiza', 'Engenheiro ML', 'Mid-Market', 'Engenharia de Dados', 'USR-004', 'USR-002', '2025-12-20', '2025-12-26'),
  v('VAG-0014', 'COM_CVS_MAIS_15_DIAS_SEM_RETORNO', 'Itaú Digital', 'Scrum Master', 'Enterprise', 'Produto', 'USR-006', 'USR-003', '2025-12-15', '2025-12-20'),
  v('VAG-0015', 'EM_FECHAMENTO', 'Nubank', 'Staff Engineer', 'Enterprise', 'Tecnologia', 'USR-004', 'USR-002', '2025-12-01', '2025-12-05'),
  v('VAG-0016', 'EM_FECHAMENTO', 'Ambev Tech', 'Head de Design', 'Enterprise', 'Design', 'USR-006', 'USR-003', '2025-11-20', '2025-11-25'),
  v('VAG-0017', 'VAGA_APROVADA', 'Itaú Digital', 'Desenvolvedor Backend', 'Enterprise', 'Tecnologia', 'USR-004', 'USR-002', '2025-11-01', '2025-11-05', { data_prevista_inicio: '2026-01-15' }),
  v('VAG-0018', 'VAGA_APROVADA', 'Magazine Luiza', 'Analista de Dados', 'Mid-Market', 'Engenharia de Dados', 'USR-006', 'USR-003', '2025-10-20', '2025-10-25', { data_prevista_inicio: '2026-02-01' }),
  v('VAG-0019', 'VAGA_APROVADA', 'Nubank', 'SRE Engineer', 'Enterprise', 'DevOps', 'USR-004', 'USR-002', '2025-10-15', '2025-10-20', { data_prevista_inicio: '2026-01-20' }),
  v('VAG-0020', 'VAGA_REPROVADA', 'Stone Pagamentos', 'CTO Interino', 'Startups', 'Tecnologia', 'USR-006', 'USR-003', '2025-11-10', '2025-11-15'),
];

export const CANDIDATOS: Candidato[] = [
  { id: 'CAN-001', nome: 'Lucas Pereira', cidade: 'São Paulo', estado: 'SP', telefone_celular: '(11) 98001-1001', telefone_outro: '', email: 'lucas.pereira@email.com', linkedin: 'linkedin.com/in/lucaspereira', ultimo_cv: { nome: 'lucas_pereira_cv.pdf', tipo: 'PDF' } },
  { id: 'CAN-002', nome: 'Fernanda Souza', cidade: 'Rio de Janeiro', estado: 'RJ', telefone_celular: '(21) 98002-1002', telefone_outro: '', email: 'fernanda.souza@email.com', linkedin: 'linkedin.com/in/fernandasouza', ultimo_cv: { nome: 'fernanda_cv.docx', tipo: 'DOCX' } },
  { id: 'CAN-003', nome: 'Rafael Almeida', cidade: 'Belo Horizonte', estado: 'MG', telefone_celular: '(31) 98003-1003', telefone_outro: '(31) 3333-0003', email: 'rafael.almeida@email.com', linkedin: 'linkedin.com/in/rafaelalmeida', ultimo_cv: { nome: 'rafael_almeida.pdf', tipo: 'PDF' } },
  { id: 'CAN-004', nome: 'Camila Rocha', cidade: 'Curitiba', estado: 'PR', telefone_celular: '(41) 98004-1004', telefone_outro: '', email: 'camila.rocha@email.com', linkedin: 'linkedin.com/in/camilarocha', ultimo_cv: { nome: 'camila_rocha_cv.pdf', tipo: 'PDF' } },
  { id: 'CAN-005', nome: 'Thiago Barbosa', cidade: 'Porto Alegre', estado: 'RS', telefone_celular: '(51) 98005-1005', telefone_outro: '', email: 'thiago.barbosa@email.com', linkedin: 'linkedin.com/in/thiagobarbosa', ultimo_cv: null },
  { id: 'CAN-006', nome: 'Isabela Martins', cidade: 'São Paulo', estado: 'SP', telefone_celular: '(11) 98006-1006', telefone_outro: '', email: 'isabela.martins@email.com', linkedin: 'linkedin.com/in/isabelamartins', ultimo_cv: { nome: 'isabela_cv.pdf', tipo: 'PDF' } },
  { id: 'CAN-007', nome: 'Gabriel Nascimento', cidade: 'Florianópolis', estado: 'SC', telefone_celular: '(48) 98007-1007', telefone_outro: '', email: 'gabriel.nasc@email.com', linkedin: 'linkedin.com/in/gabrielnasc', ultimo_cv: { nome: 'gabriel_nascimento.docx', tipo: 'DOCX' } },
  { id: 'CAN-008', nome: 'Amanda Ferreira', cidade: 'Campinas', estado: 'SP', telefone_celular: '(19) 98008-1008', telefone_outro: '', email: 'amanda.ferreira@email.com', linkedin: 'linkedin.com/in/amandaferreira', ultimo_cv: { nome: 'amanda_cv.pdf', tipo: 'PDF' } },
  { id: 'CAN-009', nome: 'Pedro Henrique Lima', cidade: 'Brasília', estado: 'DF', telefone_celular: '(61) 98009-1009', telefone_outro: '', email: 'pedro.lima@email.com', linkedin: 'linkedin.com/in/pedrolima', ultimo_cv: { nome: 'pedro_lima_cv.pdf', tipo: 'PDF' } },
  { id: 'CAN-010', nome: 'Juliana Cardoso', cidade: 'Recife', estado: 'PE', telefone_celular: '(81) 98010-1010', telefone_outro: '', email: 'juliana.cardoso@email.com', linkedin: 'linkedin.com/in/julianacardoso', ultimo_cv: { nome: 'juliana_cv.docx', tipo: 'DOCX' } },
  { id: 'CAN-011', nome: 'Diego Moreira', cidade: 'São Paulo', estado: 'SP', telefone_celular: '(11) 98011-1011', telefone_outro: '', email: 'diego.moreira@email.com', linkedin: 'linkedin.com/in/diegomoreira', ultimo_cv: { nome: 'diego_cv.pdf', tipo: 'PDF' } },
  { id: 'CAN-012', nome: 'Larissa Gomes', cidade: 'Goiânia', estado: 'GO', telefone_celular: '(62) 98012-1012', telefone_outro: '', email: 'larissa.gomes@email.com', linkedin: 'linkedin.com/in/larissagomes', ultimo_cv: { nome: 'larissa_gomes.pdf', tipo: 'PDF' } },
  { id: 'CAN-013', nome: 'Mateus Ribeiro', cidade: 'Salvador', estado: 'BA', telefone_celular: '(71) 98013-1013', telefone_outro: '', email: 'mateus.ribeiro@email.com', linkedin: 'linkedin.com/in/mateusribeiro', ultimo_cv: null },
  { id: 'CAN-014', nome: 'Carolina Pinto', cidade: 'São Paulo', estado: 'SP', telefone_celular: '(11) 98014-1014', telefone_outro: '', email: 'carolina.pinto@email.com', linkedin: 'linkedin.com/in/carolinapinto', ultimo_cv: { nome: 'carolina_cv.pdf', tipo: 'PDF' } },
  { id: 'CAN-015', nome: 'Bruno Teixeira', cidade: 'Vitória', estado: 'ES', telefone_celular: '(27) 98015-1015', telefone_outro: '', email: 'bruno.teixeira@email.com', linkedin: 'linkedin.com/in/brunoteixeira', ultimo_cv: { nome: 'bruno_teixeira.docx', tipo: 'DOCX' } },
  { id: 'CAN-016', nome: 'Patricia Mendes', cidade: 'Manaus', estado: 'AM', telefone_celular: '(92) 98016-1016', telefone_outro: '', email: 'patricia.mendes@email.com', linkedin: 'linkedin.com/in/patriciamendes', ultimo_cv: { nome: 'patricia_cv.pdf', tipo: 'PDF' } },
  { id: 'CAN-017', nome: 'Vinícius Castro', cidade: 'São Paulo', estado: 'SP', telefone_celular: '(11) 98017-1017', telefone_outro: '', email: 'vinicius.castro@email.com', linkedin: 'linkedin.com/in/viniciuscastro', ultimo_cv: { nome: 'vinicius_cv.pdf', tipo: 'PDF' } },
  { id: 'CAN-018', nome: 'Aline Araujo', cidade: 'Curitiba', estado: 'PR', telefone_celular: '(41) 98018-1018', telefone_outro: '', email: 'aline.araujo@email.com', linkedin: 'linkedin.com/in/alinearaujo', ultimo_cv: { nome: 'aline_araujo.pdf', tipo: 'PDF' } },
  { id: 'CAN-019', nome: 'Ricardo Fonseca', cidade: 'Porto Alegre', estado: 'RS', telefone_celular: '(51) 98019-1019', telefone_outro: '', email: 'ricardo.fonseca@email.com', linkedin: 'linkedin.com/in/ricardofonseca', ultimo_cv: null },
  { id: 'CAN-020', nome: 'Tatiane Lopes', cidade: 'Rio de Janeiro', estado: 'RJ', telefone_celular: '(21) 98020-1020', telefone_outro: '', email: 'tatiane.lopes@email.com', linkedin: 'linkedin.com/in/tatianelopes', ultimo_cv: { nome: 'tatiane_cv.pdf', tipo: 'PDF' } },
  { id: 'CAN-021', nome: 'Marcelo Dias', cidade: 'São Paulo', estado: 'SP', telefone_celular: '(11) 98021-1021', telefone_outro: '', email: 'marcelo.dias@email.com', linkedin: 'linkedin.com/in/marcelodias', ultimo_cv: { nome: 'marcelo_dias.pdf', tipo: 'PDF' } },
  { id: 'CAN-022', nome: 'Renata Campos', cidade: 'Belo Horizonte', estado: 'MG', telefone_celular: '(31) 98022-1022', telefone_outro: '', email: 'renata.campos@email.com', linkedin: 'linkedin.com/in/renatacampos', ultimo_cv: { nome: 'renata_cv.docx', tipo: 'DOCX' } },
  { id: 'CAN-023', nome: 'André Nogueira', cidade: 'Florianópolis', estado: 'SC', telefone_celular: '(48) 98023-1023', telefone_outro: '', email: 'andre.nogueira@email.com', linkedin: 'linkedin.com/in/andrenogueira', ultimo_cv: { nome: 'andre_cv.pdf', tipo: 'PDF' } },
  { id: 'CAN-024', nome: 'Beatriz Carvalho', cidade: 'Brasília', estado: 'DF', telefone_celular: '(61) 98024-1024', telefone_outro: '', email: 'beatriz.carvalho@email.com', linkedin: 'linkedin.com/in/beatrizcarvalho', ultimo_cv: { nome: 'beatriz_cv.pdf', tipo: 'PDF' } },
  { id: 'CAN-025', nome: 'Gustavo Monteiro', cidade: 'Campinas', estado: 'SP', telefone_celular: '(19) 98025-1025', telefone_outro: '', email: 'gustavo.monteiro@email.com', linkedin: 'linkedin.com/in/gustavomonteiro', ultimo_cv: { nome: 'gustavo_cv.pdf', tipo: 'PDF' } },
];

export const ENVIOS: EnvioCandidato[] = [
  { id: 'ENV-001', vaga_id: 'VAG-0009', candidato_id: 'CAN-001', data_envio: '2026-01-20', status: 'EM_ENTREVISTA', observacoes: 'Perfil muito aderente' },
  { id: 'ENV-002', vaga_id: 'VAG-0009', candidato_id: 'CAN-006', data_envio: '2026-01-22', status: 'EM_ENTREVISTA', observacoes: '' },
  { id: 'ENV-003', vaga_id: 'VAG-0010', candidato_id: 'CAN-003', data_envio: '2026-01-18', status: 'APROVADO', observacoes: 'Excelente entrevista técnica' },
  { id: 'ENV-004', vaga_id: 'VAG-0010', candidato_id: 'CAN-009', data_envio: '2026-01-20', status: 'REPROVADO', observacoes: 'Não atendeu requisitos técnicos' },
  { id: 'ENV-005', vaga_id: 'VAG-0011', candidato_id: 'CAN-002', data_envio: '2026-01-15', status: 'EM_ENTREVISTA', observacoes: 'Portfolio impressionante' },
  { id: 'ENV-006', vaga_id: 'VAG-0011', candidato_id: 'CAN-007', data_envio: '2026-01-18', status: 'EM_ENTREVISTA', observacoes: '' },
  { id: 'ENV-007', vaga_id: 'VAG-0012', candidato_id: 'CAN-004', data_envio: '2026-01-25', status: 'EM_ENTREVISTA', observacoes: 'Experiência com React Native' },
  { id: 'ENV-008', vaga_id: 'VAG-0013', candidato_id: 'CAN-010', data_envio: '2026-01-05', status: 'EM_ENTREVISTA', observacoes: 'Aguardando retorno do cliente' },
  { id: 'ENV-009', vaga_id: 'VAG-0013', candidato_id: 'CAN-012', data_envio: '2026-01-08', status: 'EM_ENTREVISTA', observacoes: '' },
  { id: 'ENV-010', vaga_id: 'VAG-0014', candidato_id: 'CAN-008', data_envio: '2025-12-28', status: 'EM_ENTREVISTA', observacoes: 'Sem retorno do cliente há 20+ dias' },
  { id: 'ENV-011', vaga_id: 'VAG-0015', candidato_id: 'CAN-011', data_envio: '2025-12-15', status: 'APROVADO', observacoes: 'Aprovado — aguardando data de início' },
  { id: 'ENV-012', vaga_id: 'VAG-0015', candidato_id: 'CAN-014', data_envio: '2025-12-18', status: 'REPROVADO', observacoes: '' },
  { id: 'ENV-013', vaga_id: 'VAG-0016', candidato_id: 'CAN-017', data_envio: '2025-12-05', status: 'APROVADO', observacoes: 'Aprovado pelo comitê' },
  { id: 'ENV-014', vaga_id: 'VAG-0017', candidato_id: 'CAN-021', data_envio: '2025-11-20', status: 'APROVADO', observacoes: 'Contratado' },
  { id: 'ENV-015', vaga_id: 'VAG-0018', candidato_id: 'CAN-022', data_envio: '2025-11-10', status: 'APROVADO', observacoes: 'Contratada' },
  { id: 'ENV-016', vaga_id: 'VAG-0019', candidato_id: 'CAN-023', data_envio: '2025-11-01', status: 'APROVADO', observacoes: 'Contratado' },
];
