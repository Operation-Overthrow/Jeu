# Operation Overthrow

## Prérequis
- [Node.js](https://nodejs.org/en/download)
- [Docker](https://docs.docker.com/get-docker/)

## Installation

```
# 1. Cloner le projet
git clone https://github.com/Operation-Overthrow/Jeu

# 2. Créer le network docker si ce n'est pas déjà fait
docker network create operation_overthrow_network

# 3. Installer les dépendances npm

npm install

# 4. Lancer le container docker
docker compose up -d
```

## Url utile

- [Site](http://127.0.0.1:5173)
- [Démo](https://operation-overthrow.melaine-gerard.fr)

## Inscription
Comme nous n'avons pas encore de page d'inscription, vous devez vous rendre sur la documentation de l'API et utiliser la route /api/register pour vous inscrire (voir le repository de l'API pour obtenir le lien correspondant)
