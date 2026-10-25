# Como rodar o IntegraMente + Teo no computador

Para testar no celular, tudo roda no seu computador e o celular acessa pelo IP dele na rede Wi-Fi. São 5 peças:

| Peça | Porta | Onde fica |
|---|---|---|
| Banco do Teo (Docker) | 5434 | container `teo_db` |
| API Spring (IntegraMente) | 8080 | `app-mobile-tcc` (IntelliJ) |
| API do Teo (Python) | 8000 | `TCC\teo-ai` |
| Teo Web (site) | 5173 | `TCC\teo-web` |
| App (Expo) | 8081 | `TCC\Eduka` |

O banco do app (PostgreSQL na porta 5433) é instalado no Windows e já liga sozinho.

---

## 1. Descobrir o IP do computador

No PowerShell:

```bash
ipconfig
```

Procure o **Endereço IPv4** do Wi-Fi, que começa com `192.168.0.`. Os exemplos abaixo usam `192.168.0.10`; troque pelo seu.

### Se o IP mudou, atualize em 4 lugares

| Arquivo | Linhas |
|---|---|
| `TCC\Eduka\.env` | `EXPO_PUBLIC_API_URL=http://192.168.0.10:8080` e `EXPO_PUBLIC_TEO_WEB_URL=http://192.168.0.10:5173` |
| `TCC\teo-web\.env` | `VITE_INTEGRAMENTE_API_URL=http://192.168.0.10:8080` e `VITE_TEO_API_URL=http://192.168.0.10:8000` |
| `TCC\teo-ai\.env` | `TEO_WEB_ORIGINS=http://localhost:5173,http://192.168.0.10:5173` |
| IntelliJ, configuração de execução do Spring | variável `TEO_WEB_ORIGINS=http://localhost:5173,http://192.168.0.10:5173` |

Se esquecer do IntelliJ ou do teo-ai, o Teo abre e cai em "Sua sessão acabou", porque o servidor recusa o site.

Dica: reserve o IP do computador nas configurações do roteador para ele parar de mudar.

---

## 2. Ligar tudo (nesta ordem)

Cada comando roda em um terminal próprio e fica aberto.

**1) Docker.** Abra o **Docker Desktop** e espere ele ficar verde. Depois:

```bash
docker start teo_db
```

**2) API Spring.** No IntelliJ, rode a configuração de execução do projeto `app-mobile-tcc`. Espere aparecer `Started AppMobileTccApplication`.

**3) API do Teo:**

```bash
cd "D:\Users\ricof\Área de Trabalho\TCC\teo-ai"
```

```bash
uv run teo-ai
```

**4) Teo Web:**

```bash
cd "D:\Users\ricof\Área de Trabalho\TCC\teo-web"
```

```bash
npx vite --host --port 5173
```

O `--host` deixa o celular acessar o site; sem ele, só o computador consegue.

**5) App:**

```bash
cd "D:\Users\ricof\Área de Trabalho\TCC\Eduka"
```

```bash
npx expo start --clear
```

Leia o QR code com o celular. Use `--clear` sempre que mudar o `.env`, senão o Expo continua com o IP antigo.

---

## 3. Conferir se está tudo no ar

No navegador do celular (mesmo Wi-Fi):

- `http://192.168.0.10:8000/health` deve mostrar `{"status":"ok"}`;
- `http://192.168.0.10:5173` deve mostrar "Abra o Teo pelo app".

No app: **Perfil → Converse com o Teo → PIN**. O Teo abre no navegador.

---

## 4. Quando algo dá errado

| Sintoma | Causa provável | O que fazer |
|---|---|---|
| Teo abre e mostra "Sua sessão acabou" | IP diferente em algum `.env` ou no IntelliJ | Conferir os 4 lugares da seção 1 e reiniciar o que mudou |
| App não carrega nada / fica girando | Spring parado ou IP errado no `Eduka\.env` | Ver se o Spring está rodando; rodar o Expo com `--clear` |
| Depois de várias ações no Teo, **tudo trava** (app e Teo) | Problema conhecido do Spring: as conexões com o banco ficam presas | Reiniciar o Spring no IntelliJ. A correção definitiva é o "ponto 0" que ainda vamos aplicar |
| `uv run teo-ai` fica parado ou dá erro de conexão | Docker fechado ou `teo_db` parado | Abrir o Docker Desktop e rodar `docker start teo_db` |
| Teo responde "Não consegui falar com o Teo agora" ou a criação falha | O modelo de IA gratuito saiu do ar | Trocar `TEO_MODEL` no `teo-ai\.env` (hoje: `nvidia/nemotron-3-ultra-550b-a55b:free`) e reiniciar o teo-ai |
| Porta já em uso (8080, 8000, 5173) | Ficou uma cópia rodando | Fechar o terminal antigo ou reiniciar o computador |

Para desligar tudo: `Ctrl + C` em cada terminal e parar o Spring no IntelliJ.
