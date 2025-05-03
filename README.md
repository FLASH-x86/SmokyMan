# Fumer Tue - Site de Sensibilisation au Tabagisme

Un site web interactif pour sensibiliser aux dangers du tabagisme, avec des statistiques, un mini-jeu, et des ressources pour arrêter de fumer.

## Fonctionnalités

- Interface interactive avec mode sombre
- Statistiques sur le tabagisme en France
- Mini-jeu "Snip la Cigarette"
- Quiz d'évaluation de la dépendance
- Galerie d'images comparatives
- Formulaire de contact

## Installation

1. Clonez le dépôt :
```bash
git clone [URL_DU_REPO]
cd [NOM_DU_REPO]
```

2. Créez un environnement virtuel et activez-le :
```bash
python3 -m venv venv
source venv/bin/activate  # Sur Linux/Mac
# ou
.\venv\Scripts\activate  # Sur Windows
```

3. Installez les dépendances :
```bash
pip install -r requirements.txt
```

## Déploiement

### En local

```bash
python app.py
```

Le site sera accessible à l'adresse : http://localhost:5000

### En production

Pour déployer en production, il est recommandé d'utiliser un serveur WSGI comme Gunicorn avec Nginx :

1. Installez Gunicorn :
```bash
pip install gunicorn
```

2. Créez un fichier `wsgi.py` :
```python
from app import app

if __name__ == "__main__":
    app.run()
```

3. Lancez Gunicorn :
```bash
gunicorn --bind 0.0.0.0:5000 wsgi:app
```

4. Configurez Nginx pour servir l'application (exemple de configuration) :
```nginx
server {
    listen 80;
    server_name votre_domaine.com;

    location / {
        proxy_pass http://localhost:5000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    location /static {
        alias /chemin/vers/votre/app/static;
    }
}
```

## Structure du Projet

```
.
├── app.py              # Application Flask
├── requirements.txt    # Dépendances Python
├── static/            # Fichiers statiques
│   ├── css/
│   ├── js/
│   ├── images/
│   ├── sounds/
│   └── uploads/
└── templates/         # Templates HTML
    └── index.html
```

## Sécurité

- Le site utilise HTTPS en production
- Les fichiers uploadés sont validés
- Protection contre les attaques CSRF
- Limitation de la taille des fichiers uploadés

## Licence

Ce projet est sous licence MIT. Voir le fichier LICENSE pour plus de détails. 