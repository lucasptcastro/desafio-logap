## Tarefa 01: Criação de uma aplicação Web

O setor de vendas de uma empresa precisa de uma ferramenta para gerenciar pedidos de clientes e acompanhar as vendas de forma eficiente. Seu desafio será desenvolver uma aplicação web que atenda a essa necessidade.

#### Autenticação e Controle de Acesso

- [x] Implementação de login seguro utilizando JWT

#### Diferentes perfis de usuário com permissões específicas:

- [x] Administrador: acesso total ao sistema e gestão de usuários
- [x] Cliente: pode visualizar a lista de produtos e realizar pedidos
- [x] Vendedor: gerencia o estoque e aprova ou rejeita pedidos

#### Gestão de Pedidos:

- [x] Os pedidos devem ser acompanhados pelo sistema e conter um status atualizado (ex: "Em andamento", "Finalizado", "Cancelado").
- [x] Todas as vendas devem ser registradas e armazenadas no banco de dados.

#### Visão Gerencial:

- [x] A aplicação deve exibir relatórios e/ou gráficos dinâmicos contendo:
- [x] Resumo das vendas (total de pedidos, valor faturado, produtos vendidos).
- [x] Pedidos pendentes
- [x] Clientes mais ativos

#### Qualidade e Manutenibilidade:

- [x] O projeto deve seguir boas práticas de organização de código e estruturação do repositório.
- [ ] Deve conter testes unitários e testes de integração para garantir a confiabilidade da aplicação.

## Tarefa 2: CI/CD

Após a criação da aplicação, será necessário configurar um processo automatizado de Integração Contínua e Entrega Contínua (CI/CD) para disponibilizá-la na internet.

#### Requisitos Obrigatórios:

- [x] Criar uma pipeline de CI/CD utilizando ferramentas como GitHub Actions, GitLab CI, Jenkins ou similares.
- [x] A pipeline deve conter pelo menos três etapas principais:
- [x] Build: Compilação e empacotamento da aplicação.
- [x] Dockerização: Criação de um Dockerfile funcional e, opcionalmente, um docker-compose.
- [x] Deploy: Publicação automática da aplicação em um ambiente de nuvem (ex: AWS, Azure, Vercel, Render, Heroku).

#### Diferenciais (Extras - Não Obrigatórios, Mas Valorizados):

- [ ] Adicionar etapas para execução automatizada de testes dentro da pipeline.
- [ ] Incluir ferramentas de análise de qualidade de código
- [ ] Implementar verificação de segurança antes do deploy
- [ ] Configuração de diferentes pipelines para desenvolvimento, homologação e produção
- [ ] Configuração de logs estruturados e alertas automatizados em caso de falha na execução da pipeline
- [ ] Implementação de métricas e dashboards para monitoramento da aplicação
