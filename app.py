from flask import Flask, render_template, request, flash, jsonify, session, redirect, url_for
from flask_mail import Mail, Message
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager, UserMixin, login_user, logout_user, login_required, current_user
from werkzeug.security import generate_password_hash, check_password_hash
import os

app = Flask(__name__)
app.secret_key = os.environ.get('SECRET_KEY', 'default_dev_key_perfecto_interior')

# Flask-Mail configuration (placeholders, configure these later)
app.config['MAIL_SERVER'] = 'smtp.gmail.com'
app.config['MAIL_PORT'] = 587
app.config['MAIL_USE_TLS'] = True
app.config['MAIL_USERNAME'] = os.environ.get('MAIL_USERNAME', 'your_email@gmail.com')
app.config['MAIL_PASSWORD'] = os.environ.get('MAIL_PASSWORD', 'your_app_password')
app.config['MAIL_DEFAULT_SENDER'] = os.environ.get('MAIL_USERNAME', 'your_email@gmail.com')

# SQLAlchemy configuration
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///contacts.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

mail = Mail(app)
db = SQLAlchemy(app)

login_manager = LoginManager(app)
login_manager.login_view = 'admin_login'
login_manager.login_message_category = 'info'

class Contact(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    full_name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), nullable=False)
    phone = db.Column(db.String(20))
    message = db.Column(db.Text, nullable=False)

class Admin(db.Model, UserMixin):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), unique=True, nullable=False)
    password_hash = db.Column(db.String(200), nullable=False)

@login_manager.user_loader
def load_user(user_id):
    return db.session.get(Admin, int(user_id))

# Initialize Database within app context
with app.app_context():
    db.create_all()
    # Create default admin if not exists
    if not Admin.query.filter_by(username='PerfectoInterior').first():
        hashed_password = generate_password_hash('PerfectoInterior@2026')
        default_admin = Admin(username='PerfectoInterior', password_hash=hashed_password)
        db.session.add(default_admin)
        db.session.commit()

@app.route('/')
def index():
    return render_template('pages/index.html')

@app.route('/about')
def about():
    return render_template('pages/about.html')

@app.route('/gallery')
def gallery():
    return render_template('pages/gallery.html')

@app.route('/services')
def services():
    return render_template('pages/our-service.html')

@app.route('/projects')
def projects():
    return render_template('pages/projects.html')

@app.route('/contact', methods=['GET', 'POST'])
def contact():
    if request.method == 'POST':
        # Handling the contact form submission
        is_ajax = request.headers.get('X-Requested-With') == 'XMLHttpRequest' or request.is_json
        
        # Check if form data is provided (either as json or form data)
        data = request.json if request.is_json else request.form
        
        full_name = data.get('full_name', '')
        email = data.get('email address', data.get('email', ''))
        phone = data.get('phone no', data.get('phone', ''))
        message_text = data.get('message', '')

        if not full_name or not email or not message_text:
            if is_ajax:
                return jsonify({'success': False, 'message': 'Please fill out all required fields.'}), 400
            flash('Please fill out all required fields.', 'error')
            return render_template('pages/contact.html')

        try:
            # 1. Save to Database
            new_contact = Contact( # type: ignore
                full_name=full_name,
                email=email,
                phone=phone,
                message=message_text
            )
            db.session.add(new_contact) # type: ignore
            db.session.commit() # type: ignore

            # 2. Send Email (Optional, depending on credentials)
            # msg = Message(f"New Contact from {full_name}",
            #               recipients=[app.config['MAIL_DEFAULT_SENDER']])
            # msg.body = f"Name: {full_name}\nEmail: {email}\nPhone: {phone}\n\nMessage:\n{message_text}"
            # mail.send(msg)

            if is_ajax:
                return jsonify({'success': True, 'message': 'Thank you! Your message has been sent.'}), 200
            
            flash('Thank you! Your message has been sent successfully.', 'success')
            
        except Exception as e:
            if is_ajax:
                return jsonify({'success': False, 'message': f'An error occurred: {str(e)}'}), 500
            flash(f'An error occurred: {str(e)}', 'error')

    return render_template('pages/contact.html')

@app.route('/admin/login', methods=['GET', 'POST'])
def admin_login():
    if current_user.is_authenticated:
        return redirect(url_for('admin_dashboard'))
        
    if request.method == 'POST':
        username = request.form.get('username')
        password = request.form.get('password')
        
        admin = Admin.query.filter_by(username=username).first()
        if admin and check_password_hash(admin.password_hash, password):
            login_user(admin)
            flash('Logged in successfully!', 'success')
            return redirect(url_for('admin_dashboard'))
        else:
            flash('Invalid username or password', 'error')
            
    return render_template('admin/login.html')

@app.route('/admin')
@app.route('/admin/dashboard')
@login_required
def admin_dashboard():
    # Fetch all contacts, newest first
    contacts = Contact.query.order_by(Contact.id.desc()).all()
    return render_template('admin/dashboard.html', contacts=contacts)

@app.route('/admin/logout')
@login_required
def admin_logout():
    logout_user()
    flash('You have been logged out.', 'success')
    return redirect(url_for('admin_login'))

@app.route('/admin/contact/delete/<int:id>', methods=['POST'])
@login_required
def delete_contact(id):
    contact = db.session.get(Contact, id)
    if contact:
        db.session.delete(contact)
        db.session.commit()
        flash('Contact deleted successfully.', 'success')
    else:
        flash('Contact not found.', 'error')
    return redirect(url_for('admin_dashboard'))

@app.route('/admin/contact/edit/<int:id>', methods=['POST'])
@login_required
def edit_contact(id):
    contact = db.session.get(Contact, id)
    if contact:
        contact.full_name = request.form.get('full_name', contact.full_name)
        contact.email = request.form.get('email', contact.email)
        contact.phone = request.form.get('phone', contact.phone)
        contact.message = request.form.get('message', contact.message)
        db.session.commit()
        flash('Contact updated successfully.', 'success')
    else:
        flash('Contact not found.', 'error')
    return redirect(url_for('admin_dashboard'))

@app.errorhandler(404)
def page_not_found(e):
    return render_template('404.html'), 404

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5008, debug=True)
