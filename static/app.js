let timer = 59;
let score = 0;
let words = [];
const $count = $("#count");
const form = $("form");

$("form").on("submit", handleSubmit);

// handles form submits, sends an ajax request to the server to check the status of the submitted word
// then it displays that status in the html and updates and displays the score
async function handleSubmit(evt) {
  evt.preventDefault();
  let $field = $("#word_check");
  let word = $("#word").val();

  res = await axios.get("/check-word", { params: { word: word } });
// checks validity
  if (words.includes(word)) {
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
  if ((res.data.result === "ok") & !words.includes(word)) {
    words.push(word);
    score += word.length;
    $("#postscore").text(score);
  }

  $("#word").val("");
}
// this is the timer function
countdown = setInterval(async function () {
  $count.html(timer);
  timer--;
  if (timer === -1) {
    clearInterval(countdown);
    form.hide();
    await postscore();
  }
}, 1000);

// when the timer expires it triggers this endgame function which sends a post request to the server 
// with the score and recieves back a json response that tells us if the score was a new highscore  
async function postscore() {
  score = score;
  const res = await axios.post("/post-score", { score: score });
  if (res.data.brokeRecord) {
    alert(`Congrats, you set a new high score of ${score}`);
  } else {
    alert(`Time is up, you scored ${score}`);
  }
}
