from flask import request, jsonify
from app.api import crud_bp
from app.models import Reclamation, Client, Organisation, File
from app.extensions import db
from datetime import datetime

# CRUD OPERATIONS BLUEPRINT


@crud_bp.route('/reclamations', methods=['GET'])
def get_reclamations():
    try:
        reclamations = Reclamation.query.all()
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
        return jsonify({'error': str(e)}), 505

@crud_bp.route('/reclamations/<int:reclamation_id>', methods=['GET'])
def get_reclamation_and_files(reclamation_id):
    try:
        # Find the reclamation by ID in the database
        reclamation = Reclamation.query.get(reclamation_id)

        if not reclamation:
            return jsonify({'message': 'Reclamation not found'}), 404

        # Find all files associated with the reclamation
        files = File.query.filter_by(reclamation_id=reclamation.id).all()

        # Create a list of file data (you can customize this as needed)
        file_data = []
        for file in files:
            file_info = {
                'filename': file.filename,
                'path': file.path
                # Add more file attributes as needed
            }
            file_data.append(file_info)
        print(file_data)
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
            'files': file_data  # Include the list of associated files
        }

        return jsonify(reclamation_data)

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@crud_bp.route('/newreclamations', methods=['POST'])
def create_reclamation():
    try:
        data = request.form  # Assuming you're sending form data with files

        client_name = data.get('client')
        organisation_name = data.get('organisation')
        object = data.get('object')
        desc = data.get('desc')
        date = datetime.strptime(data.get('date'), '%Y-%m-%d')
        deadline = datetime.strptime(data.get('deadline'), '%Y-%m-%d')
        status = 'Pending'  # You can set the initial status here

        client = Client.query.filter_by(nom=client_name).first()
        organisation = Organisation.query.filter_by(
            name=organisation_name).first()
        print(request.files.getlist('file'))
        
        if client and organisation:
            reclamation = Reclamation(
                date=date,
                client_id=client.id,
                object=object,
                desc=desc,
                deadline=deadline,
                status=status,
                organisation_id=organisation.id
            )
            if request.files:
                db.session.add(reclamation)
                db.session.commit()
                print(request.files)
                for file_upload in request.files.getlist('file'):
                    filename = file_upload.filename

                    file_path = f"uploads/{filename}"
                    file_upload.save(file_path)
                    print(client)
                    print(organisation)
                    # Create a File record and associate it with the reclamation
                    file_record = File(
                        filename=filename, path=file_path, reclamation_id=reclamation.id)
                    db.session.add(file_record)
                    db.session.commit()

                return jsonify({'message': 'Reclamation created successfully'}), 201
            else :
                return jsonify({'message':'no files detected '})
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
