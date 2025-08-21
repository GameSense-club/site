from flask import Blueprint, render_template

landing_bp = Blueprint(
    'landing',
    __name__,
    template_folder='landing_page',
    static_folder='landing_static',
    static_url_path='/landing'
)

@landing_bp.route('/')
def index():
    return render_template("landing.html")

@landing_bp.route('/promotions')
def promotions():
    return render_template("promotions.html")