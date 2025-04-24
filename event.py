from flask import Flask, render_template_string, request, send_file, jsonify
from flask_cors import CORS
import requests
from flask import jsonify, request  # 👈 Add this at the top if not already there
app = Flask(__name__)
CORS(app)
@app.route('/get-leagues')
def get_leagues():
    res = requests.get("https://www.thesportsdb.com/api/v1/json/3/all_leagues.php")
    data = res.json()
    return jsonify(data.get('leagues', []))

@app.route('/get-seasons/<league_id>')
def get_seasons(league_id):
    url = f"https://www.thesportsdb.com/api/v1/json/3/search_all_seasons.php?id={league_id}"
    res = requests.get(url)
    return jsonify(res.json().get('seasons', []))

@app.route('/get-events')
def get_events():
    league_id = request.args.get("league_id")
    season = request.args.get("season")
    if not league_id or not season:
        return jsonify({"events": []})

    url = f"https://www.thesportsdb.com/api/v1/json/3/eventsseason.php?id={league_id}&s={season}"
    res = requests.get(url)
    return jsonify(res.json().get("events", []))
if __name__ == "__main__":
    app.run(port=5005, debug=True)
