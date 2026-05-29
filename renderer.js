let resumePath = "";
let csvPath = "";

document.getElementById("resume").addEventListener("change", (e) => {
  resumePath = e.target.files[0].path;
});

document.getElementById("csv").addEventListener("change", (e) => {
  csvPath = e.target.files[0].path;
});

function send() {
  window.api.sendEmails({
    email: document.getElementById("email").value,
    password: document.getElementById("password").value,
    subject: document.getElementById("subject").value,
    body: document.getElementById("body").value,
    resumePath,
    csvPath
  });
}

window.api.onLog((msg) => {
  const log = document.getElementById("log");
  log.innerHTML += msg + "<br>";
});