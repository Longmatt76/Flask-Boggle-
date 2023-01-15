let timer = 59;
let score = 0;
let words = [];
const $count = $("#count");
const form = $("form");

$("form").on("submit", handleSubmit);

async function handleSubmit(evt) {
  evt.preventDefault();
  let $field = $("#word_check");
  let word = $("#word").val();

  res = await axios.get("/check-word", { params: { word: word } });

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

  if ((res.data.result === "ok") & !words.includes(word)) {
    words.push(word);
    score += word.length;
    $("#postscore").text(score);
  }

  $("#word").val("");
}

countdown = setInterval(async function () {
  $count.html(timer);
  timer--;
  if (timer === -1) {
    clearInterval(countdown);
    form.hide();
    await postscore();
  }
}, 1000);

async function postscore() {
  score = score;
  const res = await axios.post("/post-score", { score: score });
  if (res.data.brokeRecord) {
    alert(`Congrats, you set a new high score of ${score}`);
  } else {
    alert(`Time is up, you scored ${score}`);
  }
}
