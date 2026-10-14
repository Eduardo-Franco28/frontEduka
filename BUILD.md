# Build do app (APK)

O APK é gerado na nuvem pelo **EAS**, o serviço de build da Expo. Ele usa o
`app.json` e o `eas.json` deste projeto.

## 1. Uma vez só

```bash
npm install -g eas-cli
eas login
```

## 2. Variáveis de ambiente

O app lê o endereço do backend em `EXPO_PUBLIC_API_URL`. No build, esse valor
vem do EAS, não do `.env`:

```bash
# ver o que está cadastrado
eas env:list --environment preview

# cadastrar (só na primeira vez)
eas env:create --environment preview --name EXPO_PUBLIC_API_URL --value https://backendtcc-797b.onrender.com --visibility plaintext
```

> O valor é gravado dentro do APK na hora do build. Mudou a URL? Precisa de um
> build novo.

## 3. Antes de cada build

- [ ] O `app.json` é um JSON válido: `npx expo config` não pode dar erro.
- [ ] O backend que o app usa já está na `main` e publicado no Render. Se o
      front chama uma rota nova, ela precisa existir lá antes.

## 4. Gerar

```bash
eas build --platform android --profile preview
```

O build leva alguns minutos. No fim, o terminal mostra um **link e um QR code**:
abra no celular, baixe e instale o APK.

## Perfis (`eas.json`)

| Perfil        | Para quê                                  | Ambiente das variáveis |
|---------------|-------------------------------------------|------------------------|
| `preview`     | APK pra instalar e testar no celular      | `preview`              |
| `production`  | Versão de loja (Play Store)               | `production`           |
| `development` | Build de desenvolvimento (dev client)     | `development`          |

## Bom saber

- **Expo Go ≠ APK.** O Expo Go ignora parte do `app.json`, como as barras do
  sistema e o ícone. Coisas nativas só dá pra conferir de verdade num build.
- **Primeira abertura lenta.** O Render grátis dorme depois de 15 minutos sem
  uso; a primeira chamada pode levar ~50 segundos.
- **Não instala por cima?** Desinstale a versão antiga do celular e instale de
  novo.
