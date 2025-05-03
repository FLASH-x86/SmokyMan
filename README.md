# Fumer Tue - Site de Sensibilisation au Tabagisme

Un site web éducatif et interactif visant à sensibiliser les jeunes aux dangers du tabagisme.

## Fonctionnalités

- Interface moderne et responsive
- Mode sombre/clair
- Mini-jeu interactif
- Quiz sur la dépendance
- Statistiques et infographies
- Galerie d'images
- Formulaire de contact
- Animations et transitions fluides

## Installation

1. Clonez le dépôt :
```bash
git clone [URL_DU_REPO]
cd [NOM_DU_REPO]
```

2. Créez un environnement virtuel Python :
```bash
python -m venv venv
source venv/bin/activate  # Sur Linux/Mac
# ou
venv\Scripts\activate  # Sur Windows
```

3. Installez les dépendances :
```bash
pip install -r requirements.txt
```

## Utilisation

1. Lancez l'application Flask :
```bash
python app.py
```

2. Ouvrez votre navigateur et accédez à :
```
http://localhost:5000
```

## Structure du Projet

```
.
├── app.py              # Application Flask principale
├── requirements.txt    # Dépendances Python
├── static/            # Fichiers statiques
│   ├── css/          # Feuilles de style
│   ├── js/           # Scripts JavaScript
│   └── images/       # Images et médias
└── templates/         # Templates HTML
    └── index.html    # Page principale
```

## Technologies Utilisées

- Flask (Backend)
- HTML5/CSS3 (Frontend)
- JavaScript
- Chart.js (Graphiques)
- Howler.js (Audio)
- Font Awesome (Icônes)

## Licence

Ce projet est sous licence MIT. Voir le fichier LICENSE pour plus de détails. 