from flask import Flask, render_template, send_from_directory, request, redirect, url_for

app = Flask(__name__)

PUBLIC_ROUTES = {
    'login',
    'static' 
}

@app.before_request
def require_login():
    if request.endpoint in PUBLIC_ROUTES:
        return 

    token = request.cookies.get('jwt_token')
    if not token:
        return redirect(url_for('login'))

@app.route('/')
def index():
    return render_template("shop.html")


@app.route('/profile')
def profile():
    return render_template("profile.html")

@app.route('/computers')
def computers():
    return render_template("computers.html")

@app.route('/login')
def login():
    return render_template("login.html")

@app.route('/verify')
def verify():
    return render_template("verify.html")




if __name__ == '__main__':
    app.run(debug=True, host="0.0.0.0", port=5001)