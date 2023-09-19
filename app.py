from app import create_app
from app.extensions import db
from app.models import Organisation,Client,User

app = create_app()
app.app_context().push()

db.create_all()
organization_names = [
    "main_office",
    "Direction Régionale Tanger-Tétouan-Al Hoceima",
    "Direction Régionale Rabat-Salé-Kénitra",
    "Direction Régionale Centre-Ouest",
    "Direction Régionale Centre-Est",
    "Direction Régionale Oriental",
    "Direction Régionale Marrakech-Safi",
    "Direction Régionale Sud",
    "Direction Régionale Laâyoune-Oued Eddahab"
]

# Insert each organization name into the Organisation table
for name in organization_names:
    organization = Organisation(name=name)
    db.session.add(organization)
db.session.commit()
client_names = [
    "Fondation Mohammed VI de Promotion des Oeuvres Sociales de l'Education et de Formation",
    "federation royale marocaine de football",
    "office national des aéroports",
    "ministère de la santé et de la protection sociale",
    "Ministère des Habous et des Affaires Islamiques",
    "Ministère de la Justice",
    "Ministère de l'Education Nationale, de la Formation professionnelle, de l'Enseignement Supérieur et de la Recherche Scientifique"
]

# Insert each client name into the Client table
for name in client_names:
    client = Client(nom=name)
    db.session.add(client)

# Commit the changes to the database
db.session.commit()

main_office = Organisation.query.filter_by(name='main_office').first()
if not main_office:
    main_office = Organisation(name='main_office')
    db.session.add(main_office)
    db.session.commit()
    
    
new_user = User(
    name='Ammar',
    family_name='Doe',  # You can customize the family name
    organisation_id=main_office.id,  # Set the organization to 'main_office'
    email='m.azbakh@anep.ma',
    password='admin'  # You can customize the password
)

# Add the new user to the database session and commit
db.session.add(new_user)
db.session.commit()
if __name__ == '__main__':
    app.run()