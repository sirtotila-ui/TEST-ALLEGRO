# Deploy su GitHub e Vercel

## 1. Crea il repository su GitHub

1. Vai su **https://github.com/new**
2. **Repository name:** `TEST-ALLEGRO` (o un nome a tua scelta)
3. Scegli **Public** o **Private**
4. **Non** spuntare "Add a README" (il progetto è già committato in locale)
5. Clicca **Create repository**

## 2. Collega e pusha il progetto

Nella cartella del progetto (dove hai il codice), esegui nel terminale sostituendo **TUO_USERNAME** con il tuo username GitHub:

```bash
git remote add origin https://github.com/TUO_USERNAME/TEST-ALLEGRO.git
git push -u origin main
```

Se GitHub ti chiede credenziali, usa un **Personal Access Token** (Settings → Developer settings → Personal access tokens) al posto della password.

## 3. Deploy su Vercel

1. Vai su **https://vercel.com** e accedi (anche con GitHub)
2. Clicca **Add New** → **Project**
3. **Import** il repository `TEST-ALLEGRO` dalla lista (se non lo vedi, connetti il tuo account GitHub)
4. Vercel rileva automaticamente **Vite**: lascia **Build Command** = `npm run build` e **Output Directory** = `dist`
5. Clicca **Deploy**

Al termine avrai un link tipo: `https://test-allegro-xxx.vercel.app`

Ogni push su `main` farà un nuovo deploy automatico.
