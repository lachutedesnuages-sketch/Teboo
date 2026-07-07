# Tebou — Guide de mise en ligne et d'édition

Ce dossier contient le site (`index.html`, `en.html`, `style.css`) et un
tableau de bord d'édition (`admin/`) qui te permet de changer les textes et
les photos depuis ton navigateur, sans toucher au code.

Ça demande **une mise en place unique** (15–20 minutes), ensuite tout se fait
depuis une page web.

---

## Étape 1 — Créer un compte GitHub (gratuit)

GitHub est l'endroit où le code du site va vivre. C'est ce qui permet au
tableau de bord d'enregistrer tes modifications.

1. Va sur https://github.com et crée un compte gratuit.
2. Une fois connecté, clique sur le **+** en haut à droite → **New repository**.
3. Nomme-le par exemple `tebou-site`, laisse-le en **Public** ou **Private**
   (les deux fonctionnent), ne coche aucune case d'initialisation, clique
   **Create repository**.
4. Sur la page qui s'affiche, clique **uploading an existing file**.
5. Glisse-dépose **tout le contenu de ce dossier** (tous les fichiers et
   sous-dossiers : `index.html`, `en.html`, `style.css`, `content/`,
   `admin/`, `images/`) dans la zone de dépôt, puis clique **Commit changes**.

Tu n'as pas besoin d'installer Git ni d'utiliser le terminal : tout se fait
en glisser-déposer dans le navigateur.

---

## Étape 2 — Connecter le site à Netlify

1. Va sur https://app.netlify.com et crée un compte gratuit (tu peux te
   connecter directement avec ton compte GitHub, c'est plus simple).
2. Clique **Add new site** → **Import an existing project** → **GitHub**.
3. Choisis le dépôt `tebou-site` que tu viens de créer.
4. Netlify te propose des réglages de build : laisse tout vide (pas de
   commande de build, dossier de publication = `/`), clique **Deploy site**.
5. Après une minute, ton site est en ligne sur une adresse du type
   `tebou-site.netlify.app`. Tu pourras plus tard y attacher ton propre nom
   de domaine (menu **Domain settings**).

---

## Étape 3 — Activer le tableau de bord d'édition

1. Dans Netlify, va dans **Site configuration** → **Identity** → clique
   **Enable Identity**.
2. Toujours dans Identity, section **Registration** : mets-la sur
   **Invite only** (pour que seul toi puisse te connecter).
3. Section **Services** → active **Git Gateway** (bouton **Enable Git Gateway**).
4. Retourne dans l'onglet **Identity**, clique **Invite users**, entre ton
   propre email, et valide.
5. Tu vas recevoir un email d'invitation : clique sur le lien, choisis un
   mot de passe.

---

## Étape 4 — Utiliser le tableau de bord

Va sur `https://TON-SITE.netlify.app/admin/` (remplace par ton adresse),
connecte-toi avec l'email et le mot de passe choisis à l'étape précédente.

Tu verras une interface avec deux fiches, **🇪🇸 Español** et **🇬🇧 English**,
et à l'intérieur, une section par bloc du site (Portada, El estudio,
Trayectoria, Proyectos, Talleres...). Chaque champ de texte du site est
éditable, et chaque photo a un bouton pour en téléverser une nouvelle
directement depuis ton ordinateur ou ton téléphone.

Quand tu cliques **Publish**, le changement est envoyé, et le site se
republie automatiquement en une trentaine de secondes — pas besoin de me
redemander du code, pas besoin de repasser par Netlify Drop.

---

## Bon à savoir

- **Coût réel : 0 €.** GitHub, Netlify et ce tableau de bord (Decap CMS)
  sont gratuits pour ce niveau d'usage.
- Les photos que tu ajoutes via le tableau de bord sont stockées dans
  `images/uploads/` du dépôt GitHub — automatiquement.
- Si un champ est laissé vide, le site affiche le placeholder noir avec
  l'étiquette (« Foto — ... ») à la place, donc tu peux publier au fur et à
  mesure que tu obtiens tes vraies photos, sans rien casser.
- Un nom de domaine personnalisé (`tebou.studio` par exemple) coûte environ
  10–15 €/an et se configure dans **Domain settings** sur Netlify.
