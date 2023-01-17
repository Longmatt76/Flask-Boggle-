class BoggleGame {
  constructor(timer = 59) {
    this.timer = timer;
    this.score = 0;
    this.words = [];

    $("form").on("submit", this.handleSubmit.bind(this));

    // this is the timer function
    this.countdown = setInterval(async () => {
      const $count = $("#count");
      $count.html(this.timer);
      this.timer--;
      if (this.timer === -1) {
        clearInterval(this.countdown);
        $("form").hide();
        await this.postscore();
      }
    }, 1000);
  }

  // when the timer expires it triggers this endgame function which sends a post request to the server
  // with the score and recieves back a json response that tells us if the score was a new highscore
  async postscore() {
    const res = await axios.post("/post-score", { score: this.score });
    if (res.data.brokeRecord) {
      alert(`Congrats, you set a new high score of ${this.score}`);
    } else {
      alert(`Time is up, you scored ${this.score}`);
    }
  }

  // handles form submits, sends an ajax request to the server to check the status of the submitted word
  // then it displays that status in the html and updates and displays the score
  async handleSubmit(evt) {
    evt.preventDefault();
    let $field = $("#word_check");
    let word = $("#word").val();

    const res = await axios.get("/check-word", { params: { word: word } });
    // checks validity
    if (this.words.includes(word)) {
      $field.text("word already found");
      setTimeout(function () {
        $field.text("");
      }, 1000);
    } else {
      $field.text(res.data.result);
      setTimeout(function () {
        $field.text("");
      }, 1000);
    }
    // if word is valid and hasn't already been used it updates and displays the score
    if ((res.data.result === "ok") & !this.words.includes(word)) {
      this.words.push(word);
      this.score += word.length;
      $("#postscore").text(this.score);
    }

    $("#word").val("");
  }
}
