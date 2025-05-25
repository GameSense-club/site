from flask import Flask, render_template, send_from_directory

app = Flask(__name__)

@app.route('/')
def index():
    return render_template("shop.html")

@app.route('/profile')
def profile():
    return render_template("profile.html")

@app.route('/computers')
def computers():
    return render_template("computers.html")




if __name__ == '__main__':
    app.run(debug=True, host="0.0.0.0")