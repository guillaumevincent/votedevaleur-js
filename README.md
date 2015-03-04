# Vote de valeur

Avec le Vote de Valeur, la question posée à l'électeur n'est plus **quel est votre choix préféré ?**, mais **quelle est votre opinion sur chacun des choix ?**. Pour répondre, l'électeur donne une valeur à chaque choix, de -2 (très hostile), à +2 (très favorable).

![Vote de valeur](http://www.votedevaleur.org/res/sequenceVDV4_1.png)

version 0.0.6

## Tests

  * installer nodejs
  * installer dépendances nodejs `npm install`    
  * exécutez la commande `npm test`

### tests d'intégration

  * installer mongodb
  * démarrer mongodb dans une console : `mongod --dbpath /data/db`
  * lancer `npm run-script test-integration` ⚠ Attention, cette commande supprime la base de test décrite dans le fichier config/development.js ('mongodb://localhost/test')

### tests client

  * installer les dépendances bower: `./node_modules/bower/bin/bower install` 
  * lancer `npm run-script test-client`

### Executer tous les tests en même temps

  * lancer la commande `npm run-script tous-les-tests`

## Démarrer l'application

  * installer les dépendances npm `npm install`
  * installer les dépendances bower: `./node_modules/bower/bin/bower install` 
  * démarrer mongodb dans une console : `mongod --dbpath /data/db`
  * lancer le serveur `npm start`

## Demo

  * vous pouvez essayer vote de valeur à cette adresse: http://votedevaleur.fr/
