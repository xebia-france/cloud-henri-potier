# Henri Potier's server

````bash
# Lancer l'API
node app.js

# Récupérer les livres

# Ajouter une promotion
curl -i -XPOST -H "Content-Type: application/json" -d '{"type": "percentage", "value": 35}' http://localhost:5010/promotions
````