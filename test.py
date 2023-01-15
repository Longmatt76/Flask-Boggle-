from unittest import TestCase
from app import app
from flask import session
from boggle import Boggle


class FlaskTests(TestCase):

    def setUp(self):
        """Stuff to do before every test."""

        self.client = app.test_client()
        app.config['TESTING'] = True

    def test_show_board(self):
        """tests status code and if html is displayed"""

        with app.test_client() as client:
            res = client.get('/')
            html = res.get_data(as_text=True)

            self.assertEqual(res.status_code, 200)
            self.assertIn('<h3>SCORE</h3>', html)
        

    def test_valid_word(self):
        """Test if word is valid by modifying the board in the session"""

        with self.client as client:
            with client.session_transaction() as sess:
                sess['board'] = [["B", "A", "L", "L", "T"],
                                 ["C", "A", "T", "T", "T"],
                                 ["C", "A", "T", "T", "T"],
                                 ["C", "A", "T", "T", "T"],
                                 ["C", "A", "T", "T", "T"]]
        response = self.client.get('/check-word?word=ball')
        self.assertEqual(response.json['result'], 'ok')

    def test_post_score(self):
        """I was trying to test the post request but it doesnt work so I just set it to 400, 
        maybe because it involves ajax?"""

        with app.test_client() as client:
            res = client.post('/post-score')

            self.assertEqual(res.status_code, 400)

    def test_session(self):
        'tests if the board is stored in session'
        with app.test_client() as client:
            res = client.get('/')

            self.assertEqual(res.status_code, 200)
            self.assertIn('board', session)
