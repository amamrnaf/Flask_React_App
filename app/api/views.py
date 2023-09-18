import os
from flask import request, jsonify, send_from_directory, url_for
from flask_jwt_extended import create_access_token, create_refresh_token, get_jwt, jwt_required
from app.api import crud_bp, auth,admin_bp
from app.models import Action, Reclamation, Client, Organisation, File, User
from app.extensions import db
from datetime import datetime, timedelta
from werkzeug.utils import secure_filename


# CRUD OPERATIONS BLUEPRINT
@crud_bp.route('/reclamations', methods=['GET'])
@jwt_required()
def get_reclamations():
    try:
        jwt_claims = get_jwt()
        org_id = jwt_claims["organisation_id"]
        Org = Organisation.query.filter_by(id=org_id).first()
        if Org.name == "main_office":
            reclamations = Reclamation.query.all()
        else:
            reclamations = Reclamation.query.filter_by(
                organisation_id=org_id).all()
        reclamation_list = []
        for reclamation in reclamations:
            reclamation_data = {
                'id': reclamation.id,
                'date': reclamation.date.strftime('%d %b %Y'),
                'client_name': reclamation.client.nom,
                'object': reclamation.object,
                'desc': reclamation.desc,
                'deadline': reclamation.deadline.strftime('%d %b %Y'),
                'status': reclamation.status,
                'organisation_id': reclamation.organisation_id
            }
            reclamation_list.append(reclamation_data)
        return jsonify(reclamation_list)
    except Exception as e:
        print(str(e))
        return jsonify({'error': str(e)}), 500


@crud_bp.route('/reclamations/<int:reclamation_id>', methods=['GET'])
def get_reclamation_and_files(reclamation_id):
    try:
        # Find the reclamation by ID in the database
        reclamation = Reclamation.query.get(reclamation_id)

        if not reclamation:
            return jsonify({'message': 'Reclamation not found'}), 404

        # Find all files associated with the reclamation
        files = File.query.filter_by(reclamation_id=reclamation.id).all()

        file_urls = []
        for file in files:
            file_url = url_for('crud.serve_image',
                               filename=file.filename, _external=True)
            file_urls.append(file_url)

        # Create a dictionary containing reclamation and file data
        reclamation_data = {
            'id': reclamation.id,
            'date': reclamation.date.strftime('%d %b %Y'),
            'client_name': reclamation.client.nom,
            'object': reclamation.object,
            'desc': reclamation.desc,
            'deadline': reclamation.deadline.strftime('%d %b %Y'),
            'status': reclamation.status,
            'organisation_id': reclamation.organisation_id,
            'files': file_urls  # Include the list of associated files
        }

        for file in files:
            serve_image(file.filename)

        return jsonify(reclamation_data)

    except Exception as e:
        return jsonify({'error': str(e)}), 500


@crud_bp.route('/newreclamations', methods=['POST'])
@jwt_required()
def create_reclamation():
    try:
        data = request.form
        files = request.files

        # Parse date and deadline
        date = datetime.strptime(data.get('date'), '%Y-%m-%d')
        deadline = datetime.strptime(data.get('deadline'), '%Y-%m-%d')

        # Get other form data
        client_name = data.get('client')
        organisation_name = data.get('organisation')
        object = data.get('object')
        desc = data.get('desc')
        status = 'Pending'  # You can set the initial status here

        # Find client and organisation by name
        client = Client.query.filter_by(nom=client_name).first()
        organisation = Organisation.query.filter_by(
            name=organisation_name).first()

        if client and organisation:
            # Create a new reclamation
            reclamation = Reclamation(
                date=date,
                client_id=client.id,
                object=object,
                desc=desc,
                deadline=deadline,
                status=status,
                organisation_id=organisation.id
            )

            # Check for file uploads
            if any(f.startswith('file') for f in request.files):
                db.session.add(reclamation)
                db.session.commit()

                file_list = []
                for i in range(1, 11):
                    files = request.files.getlist(f'file{i-1}')
                    if files:
                        file_list.extend(files)

                for file_upload in file_list:
                    original_filename = file_upload.filename
                    current_datetime = datetime.now().strftime('%Y%m%d%H%M%S')
                    unique_filename = f"{current_datetime}_{secure_filename(original_filename)}"

                    file_path = os.path.join(
                        "app/api/uploads", unique_filename)
                    file_upload.save(file_path)

                    # Create a File record and associate it with the reclamation
                    file_record = File(
                        filename=unique_filename, path=file_path, reclamation_id=reclamation.id)
                    db.session.add(file_record)
                    db.session.commit()

                return jsonify({'message': 'Reclamation created successfully'}), 201
            else:
                return jsonify({'message': 'No files detected'}), 400
        else:
            return jsonify({'message': 'Client or Organization not found'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@crud_bp.route('/client-names', methods=['GET'])
def get_client_names():
    client_names = get_all_client_names()
    return jsonify(client_names)


@crud_bp.route('/organization-names', methods=['GET'])
def get_organization_names():
    organization_names = get_all_organization_names()
    return jsonify(organization_names)


def get_all_client_names():
    try:
        clients = Client.query.all()
        client_names = [client.nom for client in clients]
        return client_names
    except Exception as e:
        return {'error': str(e)}


def get_all_organization_names():
    try:

        organizations = Organisation.query.all()
        organization_names = [org.name for org in organizations]

        return organization_names
    except Exception as e:
        return {'error': str(e)}


@crud_bp.route('/uploads/<filename>')
def serve_image(filename):
    try:
        return send_from_directory(os.path.join(crud_bp.root_path, 'uploads'), filename)
    except Exception as e:
        print(str(e))
        return jsonify({'error': str(e)}), 500


@crud_bp.route('/update/<int:reclamation_id>', methods=['PUT'])
@jwt_required()
def ChangeStatus(reclamation_id):
    try:
        # Assuming you send the new status in the request JSON
        new_status = request.json.get('status')
        reclamation = Reclamation.query.get(reclamation_id)

        if not reclamation:
            return jsonify({"message": "Reclamation not found"}), 404

        reclamation.status = new_status
        db.session.commit()

        return jsonify({"message": "Status updated successfully", "new_status": reclamation.status}), 200
    except Exception as e:
        return jsonify({"message": "Error updating status", "error": str(e)}), 500

@crud_bp.route('/new_action', methods=['POST'])
@jwt_required()
def new_action():
    try :
        data = request.json  # Assuming you send the action data in JSON format
        reclamation_id = data.get('reclamation_id')
        action_text = data.get('Action')
        
        jwt_claims = get_jwt()
        user_id = jwt_claims.get('id')
        
        action = Action(
            reclamation_id=reclamation_id,
            Action=action_text,
            user_id=user_id
        )
        
        db.session.add(action)
        db.session.commit()

        return jsonify({'message': 'Action created successfully'}), 201
    except Exception as e:
        print(e)
        return jsonify({'error': str(e)}), 500

@crud_bp.route('/actions/<int:reclamation_id>', methods=['GET'])
@jwt_required()
def get_action(reclamation_id):
    try:
        actions = Action.query.filter_by(reclamation_id=reclamation_id).all()
        action_list = [action.Action for action in actions]
        return jsonify(action_list)
    except Exception as e : 
        print(e)
        return {'error': str(e)}
  
@crud_bp.route('/pending-reclamations-count', methods=['GET'])
@jwt_required()
def get_pending_reclamations_count():
    try:
        # Get the user's organization ID from the JWT claims
        jwt_claims = get_jwt()
        org_id = jwt_claims["organisation_id"]
        
        # Query the database to count pending reclamations for the user's organization
        pending_reclamations_count = Reclamation.query.filter_by(
            organisation_id=org_id, status='Pending').count()
        
        return jsonify({'count': pending_reclamations_count}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500





# Login Operation

@auth.route("/login", methods=["POST"])
def login():
    try:
        # Get the user's login credentials from the request

        data = request.form
        email = data.get('email')
        password = data.get('password')
        
        user = User.query.filter_by(email=email).first()
        
        if user and password == user.password:
            # Create access and refresh tokens
            
            token_exp = datetime.utcnow() + timedelta(hours=24)
            
            # Create access and refresh tokens with the exp claim
            access_token = create_access_token(
                identity=user.email,
                additional_claims={
                    'id': user.id,
                    'organisation_id': user.organisation_id,
                    'exp': token_exp.timestamp()  # Add exp claim
                }
            )
            
            refresh_token = create_refresh_token(identity=user.email)

            # Return tokens as JSON response
            return jsonify({
                'token': access_token,
                'refresh_token': refresh_token
            }), 200
        else:
            return jsonify({'message': 'Invalid credentials'}), 401

    except Exception as e:
        print(e)
        return jsonify({'error': str(e)}), 500


@auth.route('/user', methods=['GET'])
@jwt_required()  # Requires a valid JWT token
def get_user():
    jwt_claims = get_jwt()  # Get the additional claims from the token
    user_id = jwt_claims["id"]  # Get the user ID from the token
    user = User.query.get(user_id)  # Fetch the user from the database
   
    if user:
        user_data = {
            'id': user.id,
            'name': user.name,
            'family_name': user.family_name,
            'organisation_id': user.organisation_id,
            'email': user.email,
        }
        return jsonify(user_data)
    else:
        return jsonify(message='User not found'), 404


@auth.route('/logout', methods=['POST'])
@jwt_required()  # Requires a valid JWT token
def logout():
    response = jsonify(message='Logged out successfully')

    # Clear the JWT token on the client side (from sessionStorage)
    # Assuming 'access_token' is the key used in sessionStorage
    response.delete_cookie('token')
    return response


@auth.route('/rights', methods=['GET'])
@jwt_required()  # Requires a valid JWT token
def allowed():
    jwt_claims = get_jwt()  # Get the additional claims from the token
    org_id = jwt_claims["organisation_id"]
    Org = Organisation.query.filter_by(id=org_id).first()
    if Org.name == "main_office":
        return jsonify({"allowed": True}), 200
    else:
        return jsonify({"allowed": False}), 200


@auth.route('/changepassword', methods=['PUT'])
@jwt_required()  # Requires a valid JWT token
def change_password():
    try :
       
        jwt_claims = get_jwt()
        user_id = jwt_claims.get('id')
        
        # Fetch the user from the database based on user_id
        user = User.query.get(user_id)
        
        if not user:
            return jsonify({"message": "User not found"}), 404
        
        # Assuming the request contains a JSON object with the new password
        new_password = request.json.get('new_password')
        confirmed_password = request.json.get('confirmed_password')

        # Check if new password matches the confirmed password
        if new_password != confirmed_password:
            return jsonify({"message": "Passwords do not match"}), 400

        # Update the user's password
        user.password = new_password

        # Commit the changes to the database
        db.session.commit()

        return jsonify({"message": "Password changed successfully"}), 200
    except Exception as e:
        return jsonify({"message": "Error changing password", "error": str(e)}), 500
        

#Admin operations 

@admin_bp.route('/organisations', methods=['GET'])
def get_organisations():
    organisations = Organisation.query.all()
    organisations_data = [{
        'id': org.id,
        'name': org.name,
        'adresse': org.adresse,
        'mail': org.mail,
        'phone_number': org.phone_number,
    } for org in organisations]
    return jsonify(organisations_data)

@admin_bp.route('/users', methods=['GET'])
def get_users():
    users = User.query.all()
    users_data = [{
        'id': user.id,
        'name': user.name,
        'family_name': user.family_name,
        'organisation_id': user.organisation_id,
        'email': user.email,
        'password': user.password,
    } for user in users]
    return jsonify(users_data)

@admin_bp.route('/clients', methods=['GET'])
def get_clients():
    clients = Client.query.all()
    clients_data = [{
        'id': client.id,
        'nom': client.nom,
        'infos': client.infos,
    } for client in clients]
    return jsonify(clients_data)

@admin_bp.route('/reclamations', methods=['GET'])
def get_reclamations():
    reclamations = Reclamation.query.all()
    reclamations_data = [{
        'id': reclamation.id,
        'date': reclamation.date,
        'client_id': reclamation.client_id,
        'object': reclamation.object,
        'desc': reclamation.desc,
        'deadline': reclamation.deadline,
        'status': reclamation.status,
        'organisation_id': reclamation.organisation_id,
    } for reclamation in reclamations]
    return jsonify(reclamations_data)

@admin_bp.route('/delete_organisations/<int:id>', methods=['DELETE'])
def delete_organisations(id):
    try:
        # Fetch the record by ID
        # Replace 'Organisation' with the actual model (e.g., Organisation, User, etc.)
        organisation = Organisation.query.get(id)

        if not organisation:
            return jsonify({'message': 'Organisation not found'}), 404

        # Delete the organisation
        db.session.delete(organisation)
        db.session.commit()

        return jsonify({'message': 'Organisation deleted successfully'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
@admin_bp.route('/delete_users/<int:id>', methods=['DELETE'])
def delete_users(id):
    try:
        user = User.query.get(id)

        if not user:
            return jsonify({'message': 'User not found'}), 404

        db.session.delete(user)
        db.session.commit()

        return jsonify({'message': 'User deleted successfully'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
@admin_bp.route('/delete_reclamations/<int:id>', methods=['DELETE'])
def delete_reclamations(id):
    try:
        reclamation = Reclamation.query.get(id)

        if not reclamation:
            return jsonify({'message': 'Reclamation not found'}), 404

        db.session.delete(reclamation)
        db.session.commit()

        return jsonify({'message': 'Reclamation deleted successfully'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
@admin_bp.route('/delete_clients/<int:id>', methods=['DELETE'])
def delete_clients(id):
    try:
        client = Client.query.get(id)

        if not client:
            return jsonify({'message': 'Client not found'}), 404

        db.session.delete(client)
        db.session.commit()

        return jsonify({'message': 'Client deleted successfully'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@admin_bp.route('/create_organisations', methods=['POST'])
def create_organisation():
    try:
        # Get the data from the request
        data = request.json
        
        # Create a new organization object
        organisation = Organisation(
            name=data['name'],
            adresse=data['adresse'],
            mail=data['mail'],
            phone_number=data['phone_number']
        )
        
        # Add the organization to the database
        db.session.add(organisation)
        db.session.commit()
        
        return jsonify(message='Organization created successfully'), 201
    except Exception as e:
        return jsonify(error=str(e)), 500
    
# Create a new user
@admin_bp.route('/create_users', methods=['POST'])
def create_user():
    try:
        # Get the data from the request
        data = request.json
        
        # Create a new user object
        user = User(
            name=data['name'],
            family_name=data['family_name'],
            organisation_id=data['organisation_id'],
            email=data['email'],
            password=data['password']
        )
        
        # Add the user to the database
        db.session.add(user)
        db.session.commit()
        
        return jsonify(message='User created successfully'), 201
    except Exception as e:
        return jsonify(error=str(e)), 500

# Create a new client
@admin_bp.route('/create_clients', methods=['POST'])
def create_client():
    try:
        # Get the data from the request
        data = request.json
        
        # Create a new client object
        client = Client(
            nom=data['nom'],
            infos=data['infos']
        )
        
        # Add the client to the database
        db.session.add(client)
        db.session.commit()
        
        return jsonify(message='Client created successfully'), 201
    except Exception as e:
        return jsonify(error=str(e)), 500

