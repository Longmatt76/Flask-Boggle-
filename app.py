from boggle import Boggle
from flask import Flask, render_template, session, jsonify

app = Flask(__name__)
app.config["SECRET_KEY"] = "buster"

boggle_game = Boggle()


@app.route('/')
def show_board():
    board = boggle_game.make_board()
    session['board'] = board

    return render_template('board.html', board = board)



