# Henri Potier's server

````bash
# Lancer l'API
node app.js

# Récupérer les livres
curl -i -XGET http://localhost:5000/books

# Récupérer les promotions sur un libre
curl -i -XGET http://localhost:5000/books/bbcee412-be64-4a0c-bf1e-315977acd924/promotions

# Ajouter une promotion
curl -i -XPOST -H "Content-Type: application/json" -d '{"type": "percentage", "value": 35}' http://localhost:5000/promotions
````

# Cloud provider
Le code peut tourner soit sur `GCP` soit sur `AWS`. Pour ce faire la variable d'environnement `CLOUD_PROVIDER` est utilisée.
Les valeurs possibles sont `GCP`, `AWS`. Si cette dernière n'est pas remplie alors la valeur `AWS` sera utilisée.