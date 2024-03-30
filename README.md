# Encurtador de URL

Este projeto implementa um encurtador de URL. Com ele, caso o usuário envie uma URL qualquer, uma versão encurtada da mesma será gerada.

## Como Rodar

Para instalar o projeto em sua máquina local e testá-lo, basta rodar o comando `docker compose up` e esperar os serviços serem buildados e iniciarem corretamente.
Para ver se tudo está funcionando basta acessar o Docker Desktop na aba `Containers`.

Obs: Pode acontecer dos serviços `iam` e `shortener` não funcionarem imediatamente, pois ambos dependem tanto do banco de dados (Postgres) e do broker (RabbitMQ) terem sido completamente inicializados. Mesmo usando a flag `depends-on` no arquivo `compose.yaml`, a mesma garante apenas a inicialização do container, não a inicialização completa da aplicação que está dentro. Para resolver esse problema, basta esperar alguns segundos que os serviços reinicializarão até conseguirem realizar a conexão.

### Dependências

É necessário ter o Docker instalado na máquina e rodando.

Em um terminal digite `docker info`, caso as informações do Docker sejam retornadas, o mesmo está funcionando corretamente.

Para melhor visualização da aplicação, é recomendado ter o Docker Desktop também instaldo.

## Arquitetura

O projeto foi arquitetado contendo duas aplicações: `iam` e `shortener`. Iam é responsável pelo cadastro de usuários, login, alteração de senha e exclusão da conta. Já o Shortener é responsável por encurtar as URLs enviadas ao sistema.

Para garantir uma API uniforme, foi configurada uma instância `nginx` a frente dos dois serviços funcionando como um `reverse proxy`. Desta forma, não é necessário selecionar portas diferentes para acessar cada serviço.

Como existem dois serviços na aplicação, é necessário que ambos possam se comunicar para reagir a eventos que os interessem. Para resolver este problema, foi utilizado um broker AMQP (RabbitMQ) para enviar mensagens do `iam` para o `shortener`. As mensagens enviadas e como são consumidas são descritas a seguir:

- `userCreated`: Quando este evento é disparado pelo `iam`, o `shortener` cria em seu banco de dados um registro simplificado de usuário, o qual ele usará para linkar as URLs que forem criadas por este usuário.
- `userDeleted`: Quando um evento de deleção de usuário é disparado pelo `iam`, o `shortener` exclui logicamente do banco o registro do usuário e todas as suas URLs. Neste caso, dois consumidores são cadastrados: aquele responsável por excluir o usuário, e outro por excluir as URLs.

O broker foi desenhado para funcionar como um `pub/sub`, ou seja, uma mensagem enviada por um publisher é replicada para todos os subscribers interessados nela. Para implementar essa funcionalidade no RabbitMQ, foram utilizadas `exchanges` do tipo `fanout`. Uma exchange para cada evento.
