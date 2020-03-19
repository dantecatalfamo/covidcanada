#!/usr/bin/env python3

from flask import Flask

app = Flask(__name__, static_folder="live", static_url_path="")

if __name__ == "__main__":
    app.run()
