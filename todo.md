# Assistente TDM (Test Data Manager) - TODO

## Banco de Dados
- [x] Criar tabela `leads` com campos de e-mail e informações de contato
- [x] Criar tabela `diagnoses` com campos de respostas, análise e status
- [x] Executar migrações no banco de dados

## Landing Page
- [x] Implementar seção hero com título e subtítulo (TDM)
- [x] Adaptar textos para TDM (Gestão de Dados de Teste)
- [x] Criar seção de diagnóstico TDM
- [x] Adicionar seção "Como funciona" com 4 passos
- [x] Criar seção de benefícios/por que usar TDM
- [x] Implementar FAQ com 8-10 perguntas
- [x] Adicionar CTA (Call-to-Action) principal
- [x] Implementar footer com links e informações

## Captura de Leads
- [x] Criar formulário de e-mail na landing page
- [x] Validar e-mail no frontend e backend
- [x] Armazenar lead no banco de dados
- [x] Gerar token único para diagnóstico
- [x] Implementar envio de e-mail com link do diagnóstico

## Sistema de Diagnóstico TDM Express
- [x] Criar interface de diagnóstico com 10 perguntas TDM
- [x] Implementar navegação entre perguntas (anterior/próxima)
- [x] Adicionar indicador de progresso
- [x] Criar componente de resposta (múltipla escolha)
- [x] Validar respostas antes de enviar
- [x] Atualizar perguntas para TDM (gestão de dados de teste)
- [x] Adaptar pilares para TDM (8 pilares de dados)

## Análise TDM
- [x] Criar análise especializada em TDM
- [x] Implementar função de análise de respostas
- [x] Gerar nível de maturidade (1-5)
- [x] Calcular pontuação por pilar TDM (8 pilares)
- [x] Identificar 3 principais gaps
- [x] Gerar recomendações prioritárias TDM
- [x] Implementar benchmarking com dados de mercado

## Geração de Relatórios
- [x] Criar template de relatório em PDF
- [x] Implementar geração de PDF com dados da análise
- [x] Adicionar gráficos e visualizações no relatório
- [ ] Fazer upload do PDF para S3
- [ ] Gerar URL permanente do PDF

## Sistema de E-mails
- [x] Configurar SendGrid ou Manus Notification API
- [x] Criar template de e-mail com link do diagnóstico
- [x] Criar template de e-mail com relatório final
- [x] Implementar envio automático de e-mails
- [x] Adicionar tratamento de erros de envio

## Página de Resultado
- [x] Criar página de exibição do resultado
- [x] Implementar visualização do nível TDM
- [x] Criar gráficos de pontuação por pilar
- [x] Exibir gaps e recomendações
- [x] Adicionar botão de download do PDF
- [x] Implementar compartilhamento de resultado

## Página de Exemplo
- [x] Criar página de exemplo de relatório
- [x] Implementar dados fictícios de exemplo
- [x] Adicionar visualizações e gráficos
- [x] Criar CTA para iniciar diagnóstico real

## Dashboard de Leads (Admin)
- [ ] Criar página de dashboard para visualizar leads
- [ ] Implementar listagem de diagnósticos
- [ ] Adicionar filtros e busca
- [ ] Criar visualizações de estatísticas

## Testes
- [ ] Escrever testes unitários para funções de análise TDM
- [ ] Testar fluxo completo de diagnóstico
- [ ] Validar integração com e-mails
- [ ] Testar geração de PDFs

## Deploy
- [ ] Configurar variáveis de ambiente
- [ ] Testar em ambiente de produção
- [ ] Criar checkpoint final
- [ ] Publicar projeto
