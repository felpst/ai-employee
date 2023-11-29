import logging
from flask import Flask
from routes import tools_blueprint

# Setting logging
logging.basicConfig(level=logging.INFO)

app = Flask(__name__)
app.register_blueprint(tools_blueprint)

if __name__ == "__main__":
    app.run(debug=True)
