from flask import request, jsonify
from app.api import crud_bp
from app.models import Reclamation, Client, Organisation
from app.extensions import db

# CRUD OPERATIONS BLUEPRINT
@crud_bp.route('/reclamations', methods=['GET'])
def get_reclamations():
    try:
        reclamations = Reclamation.query.all()
        reclamation_list = []
        for reclamation in reclamations:
            reclamation_data = {
                'id': reclamation.id,
                'date': reclamation.date,
                'client_id': reclamation.client_id,
                'object': reclamation.object,
                'desc': reclamation.desc,
                'deadline': reclamation.deadline,
                'status': reclamation.status,
                'organisation_id': reclamation.organisation_id
            }
            reclamation_list.append(reclamation_data)
        return jsonify(reclamation_list)
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@crud_bp.route('/reclamations', methods=['POST'])
def create_reclamation():
    data = request.get_json()

    client_name = data.get('client_name')
    organization_name = data.get('organization_name')
    object = data.get('object')
    desc = data.get('desc')
    date = data.get('date')
    deadline = data.get('deadline')
    status = 'Pending'  # You can set the initial status here

    client = Client.query.filter_by(name=client_name).first()

    organisation = Organisation.query.filter_by(name=organization_name).first()

    if client and organisation:
        reclamation = Reclamation(client_id=client.id, object=object, desc=desc,
                                  date=date, deadline=deadline, status=status, organization_id=organisation.id)

        db.session.add(reclamation)
        db.session.commit()

        return jsonify({'message': 'Reclamation created successfully'}), 201
    else:
        return jsonify({'message': 'Client or Organization not found'}), 404

