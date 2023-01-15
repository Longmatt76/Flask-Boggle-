from boggle import Boggle
from flask import Flask, render_template, session, jsonify, request

app = Flask(__name__)
app.config["SECRET_KEY"] = "buster"

boggle_game = Boggle()


@app.route('/')
def show_board():
    """displays the gameboard and sets the session for the board, highscore and # of plays"""
    board = boggle_game.make_board()
    session['board'] = board
    highscore = session.get('highscore', 0)
    num_plays = session.get('num_plays', 0)

    return render_template('board.html', board=board, highscore=highscore, num_plays=num_plays)


@app.route('/check-word')
def check_word():
    """checks if the guess is valid and returns json of word status
     which is used by ajax to update the html without refresh"""
    word = request.args['word']
    board = session['board']
    result = boggle_game.check_valid_word(board, word)

    return jsonify({"result": result})


@app.route('/post-score', methods=['POST'])
def post_score():
    """at game end, recieves a post request from ajax with the score, it then updates the 
    highscore and num_plays sessions"""
    score = request.json["score"]
    highscore = session.get('highscore', 0)
    num_plays = session.get('num_plays', 0)

    session['num_plays'] = num_plays + 1
    session['highscore'] = max(score, highscore)

    return jsonify(brokeRecord= score > highscore)
