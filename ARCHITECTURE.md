# Arquitetura - Assistente TMMi Clone

## Visão Geral
Sistema de diagnóstico de maturidade TMMi com landing page, captura de leads, diagnóstico express baseado em IA, geração de relatórios em PDF e envio por e-mail.

## Estrutura de Dados

### Tabelas do Banco de Dados

#### `leads`
- `id` (int, PK)
- `email` (varchar, unique)
- `name` (varchar)
- `company` (varchar, nullable)
- `createdAt` (timestamp)
- `updatedAt` (timestamp)

#### `diagnoses`
- `id` (int, PK)
- `leadId` (int, FK → leads.id)
- `type` (enum: 'express', 'complete')
- `status` (enum: 'in_progress', 'completed', 'failed')
- `answers` (json) - Respostas do usuário
- `analysis` (json) - Análise gerada pela IA
- `maturityLevel` (int, 1-5)
- `scores` (json) - Pontuação por área
- `gaps` (json) - 3 principais gaps
- `recommendations` (json) - Recomendações prioritárias
- `benchmarking` (json) - Dados de benchmarking
- `reportUrl` (varchar, nullable) - URL do PDF no S3
- `createdAt` (timestamp)
- `completedAt` (timestamp, nullable)

### Fluxo de Dados

1. **Captura de Lead**: Usuário preenche e-mail na landing page
2. **Envio de Link**: Sistema envia e-mail com link para diagnóstico
3. **Diagnóstico**: Usuário responde 10 perguntas
4. **Processamento IA**: Sistema processa respostas com LLM
5. **Geração de Relatório**: Cria PDF com análise
6. **Envio de Relatório**: Envia e-mail com link do PDF

## Componentes Principais

### Frontend
- **Landing Page** (`/`): Hero, escolha de diagnóstico, FAQ, CTA
- **Lead Capture** (`/captura`): Formulário de e-mail
- **Diagnóstico Express** (`/diagnostico/:token`): 10 perguntas interativas
- **Resultado** (`/resultado/:diagnosisId`): Exibição do relatório
- **Exemplo** (`/exemplo`): Página de demonstração de relatório

### Backend
- **Routers tRPC**:
  - `leads.capture`: Capturar e-mail
  - `diagnoses.start`: Iniciar diagnóstico
  - `diagnoses.submit`: Submeter respostas
  - `diagnoses.getResult`: Obter resultado
  - `diagnoses.getExample`: Obter exemplo de relatório

### Integrações
- **IA (LLM)**: Análise de respostas e geração de insights
- **E-mail**: SendGrid ou Manus Notification API
- **PDF**: Geração com ReportLab ou similar
- **S3**: Armazenamento de PDFs

## Design Visual

- **Tema**: Minimalista escandinavo
- **Cores**: Cinza frio pálido (fundo), azul pastel, rosa blush
- **Tipografia**: Sans-serif preta ousada (títulos), fina delicada (subtítulos)
- **Layout**: Assimétrico, amplo espaço negativo, gradientes suaves
- **Formas**: Geométricas abstratas

## Pilares TMMi (8 para Express)

1. Planejamento e Estimativa
2. Projeto de Testes
3. Execução de Testes
4. Análise de Defeitos
5. Gestão de Configuração
6. Automação de Testes
7. Métricas e Análise
8. Melhoria Contínua

## Próximos Passos

1. Criar schema do banco de dados
2. Implementar landing page
3. Desenvolver sistema de diagnóstico
4. Integrar IA
5. Configurar e-mails
6. Gerar PDFs
7. Testar fluxo completo
