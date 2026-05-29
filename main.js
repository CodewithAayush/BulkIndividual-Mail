const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const nodemailer = require("nodemailer");
const fs = require("fs");
const csv = require("csv-parser");

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1000,
    height: 700,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true
    }
  });

  mainWindow.loadFile("index.html");
}

app.whenReady().then(createWindow);

// SMTP SEND FUNCTION
async function sendEmails(data) {
  const { email, password, subject, body, resumePath, csvPath } = data;

  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: email,
      pass: password
    }
  });

  let results = [];

  fs.createReadStream(csvPath)
    .pipe(csv())
    .on("data", async (row) => {
      const company = row.company;
      const recipient = row.email;

      try {
        await transporter.sendMail({
          from: email,
          to: recipient,
          subject: subject,
          text: body.replace("{company}", company),
          attachments: [
            {
              filename: "resume.pdf",
              path: resumePath
            }
          ]
        });

        mainWindow.webContents.send("log", `✅ Sent to ${company}`);
      } catch (err) {
        mainWindow.webContents.send("log", `❌ Failed ${recipient}`);
      }
    });
}

ipcMain.on("send-emails", (event, data) => {
  sendEmails(data);
});