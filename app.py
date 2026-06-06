from flask import Flask, render_template, request, flash, jsonify, session, redirect, url_for
from flask_mail import Mail, Message
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager, UserMixin, login_user, logout_user, login_required, current_user
from werkzeug.security import generate_password_hash, check_password_hash
import os
import cloudinary
import cloudinary.uploader
import cloudinary.api
from datetime import datetime

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
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://postgres.uddbcvgslfjeylfandle:Perfecto%4003021@aws-1-ap-southeast-1.pooler.supabase.com:5432/postgres'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Cloudinary configuration
cloudinary.config(
  cloud_name = "dmeqqzshc",
  api_key = "845426421424695",
  api_secret = "o0zyWcU8hLbnWuz1KSB1nPWPdJk"
)

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

class HeroImage(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    image_url = db.Column(db.String(500), nullable=False)
    public_id = db.Column(db.String(200), nullable=False)
    title = db.Column(db.String(200))
    subtitle = db.Column(db.String(500))

class NewsItem(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    text = db.Column(db.String(500), nullable=False)
    link = db.Column(db.String(500), nullable=True)
    is_active = db.Column(db.Boolean, default=True, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class Project(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text)
    image_url = db.Column(db.String(500), nullable=False)
    public_id = db.Column(db.String(200), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class GalleryImage(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    image_url = db.Column(db.String(500), nullable=False)
    public_id = db.Column(db.String(200), nullable=False)
    category = db.Column(db.String(100))
    caption = db.Column(db.String(500))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class SiteImage(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), unique=True, nullable=False)
    image_url = db.Column(db.String(500), nullable=False)
    public_id = db.Column(db.String(200), nullable=False)

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
    images = HeroImage.query.order_by(HeroImage.id.asc()).all()
    news_items = NewsItem.query.filter_by(is_active=True).order_by(NewsItem.id.desc()).all()
    return render_template('pages/index.html', images=images, news_items=news_items)

@app.route('/about')
def about():
    return render_template('pages/about.html')

@app.route('/gallery')
def gallery():
    images = GalleryImage.query.order_by(GalleryImage.created_at.desc()).all()
    return render_template('pages/gallery.html', images=images)

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

@app.route('/admin/hero', methods=['GET', 'POST'])
@login_required
def admin_hero():
    if request.method == 'POST':
        action = request.form.get('action')
        if action == 'add_news':
            text = request.form.get('text')
            link = request.form.get('link')
            if not text:
                flash('Announcement text is required.', 'error')
            else:
                try:
                    new_news = NewsItem(text=text, link=link)
                    db.session.add(new_news)
                    db.session.commit()
                    flash('Announcement added successfully!', 'success')
                except Exception as e:
                    flash(f'Failed to add announcement: {str(e)}', 'error')
            return redirect(url_for('admin_hero'))
        
        else:
            # Handle Hero Image Upload (Default)
            if 'image' not in request.files:
                flash('No image file selected', 'error')
                return redirect(request.url)
            file = request.files['image']
            if file.filename == '':
                flash('No image file selected', 'error')
                return redirect(request.url)
            if file:
                title = request.form.get('title')
                subtitle = request.form.get('subtitle')
                try:
                    upload_result = cloudinary.uploader.upload(file, folder="perfecto_interior/hero")
                    new_image = HeroImage(
                        image_url=upload_result['secure_url'],
                        public_id=upload_result['public_id'],
                        title=title,
                        subtitle=subtitle
                    )
                    db.session.add(new_image)
                    db.session.commit()
                    flash('Hero image uploaded successfully!', 'success')
                except Exception as e:
                    flash(f'Upload failed: {str(e)}', 'error')
            return redirect(url_for('admin_hero'))
            
    images = HeroImage.query.order_by(HeroImage.id.desc()).all()
    news_items = NewsItem.query.order_by(NewsItem.id.desc()).all()
    return render_template('admin/hero.html', images=images, news_items=news_items)

@app.route('/admin/news/toggle/<int:id>', methods=['POST'])
@login_required
def toggle_news(id):
    item = db.session.get(NewsItem, id)
    if item:
        item.is_active = not item.is_active
        db.session.commit()
        flash('Announcement status updated successfully.', 'success')
    else:
        flash('Announcement not found.', 'error')
    return redirect(url_for('admin_hero'))

@app.route('/admin/news/edit/<int:id>', methods=['POST'])
@login_required
def edit_news(id):
    item = db.session.get(NewsItem, id)
    if item:
        text = request.form.get('text')
        link = request.form.get('link')
        if not text:
            flash('Announcement text is required.', 'error')
        else:
            item.text = text
            item.link = link
            db.session.commit()
            flash('Announcement updated successfully.', 'success')
    else:
        flash('Announcement not found.', 'error')
    return redirect(url_for('admin_hero'))

@app.route('/admin/news/delete/<int:id>', methods=['POST'])
@login_required
def delete_news(id):
    item = db.session.get(NewsItem, id)
    if item:
        db.session.delete(item)
        db.session.commit()
        flash('Announcement deleted successfully.', 'success')
    else:
        flash('Announcement not found.', 'error')
    return redirect(url_for('admin_hero'))

@app.route('/admin/hero/delete/<int:id>', methods=['POST'])
@login_required
def delete_hero_image(id):
    image = db.session.get(HeroImage, id)
    if image:
        try:
            cloudinary.uploader.destroy(image.public_id)
            db.session.delete(image)
            db.session.commit()
            flash('Image deleted successfully.', 'success')
        except Exception as e:
            flash(f'Deletion failed: {str(e)}', 'error')
    else:
        flash('Image not found.', 'error')
    return redirect(url_for('admin_hero'))

@app.route('/admin/hero/edit/<int:id>', methods=['POST'])
@login_required
def edit_hero_image(id):
    image = db.session.get(HeroImage, id)
    if image:
        title = request.form.get('title')
        subtitle = request.form.get('subtitle')
        image.title = title
        image.subtitle = subtitle
        
        if 'image' in request.files:
            file = request.files['image']
            if file and file.filename != '':
                try:
                    if image.public_id:
                        cloudinary.uploader.destroy(image.public_id)
                    upload_result = cloudinary.uploader.upload(file, folder="perfecto_interior/hero")
                    image.image_url = upload_result['secure_url']
                    image.public_id = upload_result['public_id']
                except Exception as e:
                    flash(f'New image upload failed: {str(e)}', 'error')
                    return redirect(url_for('admin_hero'))
        
        try:
            db.session.commit()
            flash('Hero slide updated successfully.', 'success')
        except Exception as e:
            flash(f'Failed to update hero slide: {str(e)}', 'error')
    else:
        flash('Hero image not found.', 'error')
    return redirect(url_for('admin_hero'))


@app.route('/admin/gallery', methods=['GET', 'POST'])
@login_required
def admin_gallery():
    if request.method == 'POST':
        if 'image' not in request.files:
            flash('No image file selected', 'error')
            return redirect(request.url)
        file = request.files['image']
        if file.filename == '':
            flash('No image file selected', 'error')
            return redirect(request.url)
        if file:
            category = request.form.get('category')
            caption = request.form.get('caption')
            try:
                upload_result = cloudinary.uploader.upload(file, folder="perfecto_interior/gallery")
                new_image = GalleryImage(
                    image_url=upload_result['secure_url'],
                    public_id=upload_result['public_id'],
                    category=category,
                    caption=caption
                )
                db.session.add(new_image)
                db.session.commit()
                flash('Gallery image uploaded successfully!', 'success')
            except Exception as e:
                flash(f'Upload failed: {str(e)}', 'error')
        return redirect(url_for('admin_gallery'))
    images = GalleryImage.query.order_by(GalleryImage.created_at.desc()).all()
    return render_template('admin/gallery.html', images=images)

@app.route('/admin/gallery/delete/<int:id>', methods=['POST'])
@login_required
def delete_gallery_image(id):
    image = db.session.get(GalleryImage, id)
    if image:
        try:
            cloudinary.uploader.destroy(image.public_id)
            db.session.delete(image)
            db.session.commit()
            flash('Image deleted successfully.', 'success')
        except Exception as e:
            flash(f'Deletion failed: {str(e)}', 'error')
    else:
        flash('Image not found.', 'error')
    return redirect(url_for('admin_gallery'))

@app.route('/admin/gallery/edit/<int:id>', methods=['POST'])
@login_required
def edit_gallery_image(id):
    image = db.session.get(GalleryImage, id)
    if image:
        category = request.form.get('category')
        caption = request.form.get('caption')
        image.category = category
        image.caption = caption
        
        if 'image' in request.files:
            file = request.files['image']
            if file and file.filename != '':
                try:
                    if image.public_id:
                        cloudinary.uploader.destroy(image.public_id)
                    upload_result = cloudinary.uploader.upload(file, folder="perfecto_interior/gallery")
                    image.image_url = upload_result['secure_url']
                    image.public_id = upload_result['public_id']
                except Exception as e:
                    flash(f'New image upload failed: {str(e)}', 'error')
                    return redirect(url_for('admin_gallery'))
        
        try:
            db.session.commit()
            flash('Gallery image updated successfully.', 'success')
        except Exception as e:
            flash(f'Failed to update gallery image: {str(e)}', 'error')
    else:
        flash('Image not found.', 'error')
    return redirect(url_for('admin_gallery'))

@app.errorhandler(404)
def page_not_found(e):
    return render_template('404.html'), 404

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5008, debug=True)
