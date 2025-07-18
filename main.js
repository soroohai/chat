
async function sendMessage() {
  const chatBox = document.getElementById("chatBox");
  const input = document.getElementById("userInput");
  const userMessage = input.value.trim();
  if (!userMessage) return;

  appendMessage("أنت", userMessage);
  input.value = "";

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer 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`
      },
      body: JSON.stringify({
        model: "gpt-4",
        messages: [
          { role: "system", content: "أنت سُروح، المساعدة الذكية الخاصة بـ سام بورفات." },
          { role: "user", content: userMessage }
        ]
      })
    });

    const data = await response.json();
    const reply = data.choices[0].message.content;
    appendMessage("سُروح", reply);

    // نطق الرد صوتيًا
    const utterance = new SpeechSynthesisUtterance(reply);
    speechSynthesis.speak(utterance);

  } catch (err) {
    appendMessage("⚠️", "حدث خطأ أثناء الاتصال بـ GPT");
    console.error(err);
  }
}

function appendMessage(sender, message) {
  const chatBox = document.getElementById("chatBox");
  const msg = document.createElement("div");
  msg.className = "message";
  msg.innerHTML = `<strong>${sender}:</strong> ${message}`;
  chatBox.appendChild(msg);
  chatBox.scrollTop = chatBox.scrollHeight;
}

function handleFileUpload(event) {
  const chatBox = document.getElementById("chatBox");
  const file = event.target.files[0];
  if (!file) return;

  const fileURL = URL.createObjectURL(file);
  let content = "";

  if (file.type.startsWith("image/")) {
    content = `<img src="${fileURL}" style="max-width: 200px;" />`;
  } else {
    content = `<a href="${fileURL}" target="_blank">${file.name}</a>`;
  }

  appendMessage("📎 ملف مرفق", content);
}
