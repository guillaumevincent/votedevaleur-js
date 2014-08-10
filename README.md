# Vote de valeur


Avec le Vote de Valeur, la question posée à l'électeur n'est plus **quel est votre choix préféré ?**, mais **quelle est votre opinion sur chacun des choix ?**. Pour répondre, l'électeur donne une valeur à chaque choix, de -2 (très hostile), à +2 (très favorable).

![Vote de valeur](http://www.votedevaleur.org/res/sequenceVDV4_1.png)


## Tests


  * Installer nodejs
  * installer dépendances node `npm install`    

  
### tests unitaires

Pour lancer les tests, exécutez la commande suivante:

    npm test


### tests d'intégration

  * installer mongodb
  * démarrer mongodb dans une console : `mongod --dbpath /data/db`
  * lancer `npm run-script test-integration` ⚠ Attention, cette commande supprime la base de test décrite dans le fichier config/development.js (cad 'mongodb://localhost/test')

### tests client

  * Run `npm run-script test-client`

### Executer tous les tests en même temps

  * installer mongodb
  * démarrer mongodb dans une console : `mongod --dbpath /data/db`
  * lancer `npm run-script tests`
  

## Démarrer l'application

  * installer les dépendances npm `npm install --production`
  * lancer le serveur `npm start`
      