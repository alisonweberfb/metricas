# GitLab Metrics

Este projeto coleta métricas do GitLab, como commits, issues e merge requests, e as exibe de forma organizada.

## Funcionalidades

- **Coleta de métricas**: Obtenha dados detalhados de repositórios do GitLab.
- **Exibição de dados**: Visualize informações como número de commits, issues abertas e merge requests.

## Pré-requisitos

Antes de começar, certifique-se de ter os seguintes itens instalados:

- [Node.js](https://nodejs.org/) (versão mais recente recomendada).
- Um **token de acesso do GitLab** configurado no arquivo `.env`.

## Como executar

Siga os passos abaixo para configurar e executar o projeto:

1. **Clone o repositório**:
   ```bash
   git clone https://github.com/alisonweberfb/metricas.git
   ```

2. **Navegue até o diretório do projeto**:
   ```bash
   cd metricas
   ```

3. **Instale as dependências**:
   ```bash
   npm install
   ```

4. **Configure o arquivo `.env`**:
   Crie um arquivo `.env` na raiz do projeto e adicione o seguinte conteúdo:
   ```env
   GITLAB_ACCESS_TOKEN=seu_token_aqui
   ```

5. **Execute o projeto**:
   ```bash
   node gitlab_metrics.js
   ```

## Observações

- Certifique-se de que o arquivo `.env` não seja incluído no repositório para evitar expor informações sensíveis.
- Consulte a [documentação oficial do GitLab](https://docs.gitlab.com/ee/api/) para mais detalhes sobre como gerar um token de acesso.

---

**Mantenha suas métricas organizadas e acessíveis com o GitLab Metrics!**
