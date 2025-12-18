## Escopo do projeto até o momento

Registro e login de usuarios(in memory)

Quero que vc implemente uma entidade de dominio User, User deve ter
name
email
createdAt
password
role(student, admin, teacher).

Quero que vc crie uma interface de repositorio(seguindo aquela padrão que falamos anteriormente). e sua implementação deve ser feita em memoria(usando um array mesmo).

Os casos de uso que serão implementados : signUpUser e signInUser.

Além disso, deve fazer as configurações de eslint, typescript. O projeto deve se chamar Jornal-API no package.json.

Por fim, cito que vc deve usar o JWT que já coloquei no package json como dependencia para gerenciar a sessão.

Donts:
Não expanda o escopo do que está aqui.
Não fuja da arquitetura que está sendo usada.

Dos:
Faça uma versão do projeto que seja capaz de ser buildada e rodada(usando express)

faça uma versão do projeto que seja capaz de executar com sucesso os 2 casos de uso em memoria
