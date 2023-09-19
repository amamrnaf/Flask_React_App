from app.extensions import db


class Organisation(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    adresse = db.Column(db.String(200))
    mail = db.Column(db.String(120))
    phone_number = db.Column(db.String(20))


class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False)
    family_name = db.Column(db.String(50), nullable=False)
    organisation_id = db.Column(db.Integer, db.ForeignKey('organisation.id'))
    email = db.Column(db.String(120), nullable=False)
    password = db.Column(db.String(50), nullable=False)


class Client(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    nom = db.Column(db.String(200), nullable=False)
    infos = db.Column(db.String(200))
    
class Reclamation(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    date = db.Column(db.Date, nullable=False)
    client_id = db.Column(db.String(50), db.ForeignKey('client.id'))
    object = db.Column(db.String(100), nullable=False)
    desc = db.Column(db.String(200))
    deadline = db.Column(db.Date, nullable=False)
    status = db.Column(db.String(50), nullable=False)
    organisation_id = db.Column(db.Integer, db.ForeignKey('organisation.id'))

    client = db.relationship('Client', backref='reclamations')





class File(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    filename = db.Column(db.String(255), nullable=False)  # Name of the uploaded file
    path = db.Column(db.String(255), nullable=False)      # Path to the stored file on the server
    reclamation_id = db.Column(db.Integer, db.ForeignKey('reclamation.id')) 

    reclamation = db.relationship('Reclamation', backref='files') 
    
class Action(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer,db.ForeignKey('user.id'))
    Action =  db.Column(db.String(1000),nullable=False)
    reclamation_id = db.Column(db.Integer, db.ForeignKey('reclamation.id'))
    
    
    reclamation = db.relationship('Reclamation', backref='actions')
    user = db.relationship('User', backref='actions')
    

