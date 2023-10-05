import pandas as pd
from app import create_app
from app.extensions import db
from app.models import Organisation, Client, User

app = create_app()
app.app_context().push()

db.create_all()

def insert_organizations(organization_names):
    for name in organization_names:
        organization = Organisation.query.filter_by(name=name).first()
        if not organization:
            organization = Organisation(name=name)
            db.session.add(organization)
    db.session.commit()

# Function to insert clients while checking for duplicates

def insert_clients(client_names):
    for name in client_names:
        client = Client.query.filter_by(nom=name).first()
        if not client:
            client = Client(nom=name)
            db.session.add(client)
    db.session.commit()

excel_file1 = "entite.csv"
excel_file2 = "clients.csv"
data1 = pd.read_excel(excel_file1)
data2 = pd.read_excel(excel_file2)
organization_names = data1.Organization
client_names = data2.Client
insert_organizations(organization_names)
insert_clients(client_names)

main_office = Organisation.query.filter_by(name='main_office').first()
if not main_office:
    main_office = Organisation(name='main_office')
    db.session.add(main_office)
    db.session.commit()


def insert_first_user():
    email = 'm.azbakh@anep.ma' # You can customize the mail 
    
    existing_user = User.query.filter_by(email=email).first()
    if not existing_user:
        main_office = Organisation.query.filter_by(name='main_office').first()
        new_user = User(
            name='Ammar',      # You can cuztomize the name 
            family_name='Doe',  # You can customize the family name
            organisation_id=main_office.id,  # Set the organization to 'main_office'
            email=email,
            password='admin'  # You can customize the password
        )
        db.session.add(new_user)
        db.session.commit()


insert_first_user()


if __name__ == '__main__':
    app.run()
