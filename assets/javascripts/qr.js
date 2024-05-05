import { EverREST } from "./everrest-service.js";
import { displayAlert } from "./alert-service.js";

const generateQrInput = document.querySelector("#generateQrInput");
const generateQrBtn = document.querySelector("#generateQrBtn");
const qrDisplay = document.querySelector("#qrDisplay");

const everREST = new EverREST();

let prevGenerate = "";

generateQrBtn.addEventListener("click", () => {
  genereateQrCode(generateQrInput.value);
});

generateQrInput.addEventListener("keyup", function (event) {
  if (event.key === "Enter") {
    genereateQrCode(this.value);
  }
});

async function genereateQrCode(text) {
  text = text.trim();

  if (text === "") {
    displayAlert("Fill input", "error", "Qr can't be empty");
    return;
  }

  if (text === prevGenerate) {
    displayAlert("Already generated", "warning", "Try other");
    return;
  }

  generateQrInput.value = "";
  prevGenerate = text;

  try {
    const response = await everREST.generateQrCode(text);
    qrDisplay.innerHTML = `
      <div class="card" style="width: 18rem;">
        <img
          class="card-img-top"
          src="${response.result}"
          alt="${response.text} qr code"
        >
        <div class="card-body">
          <h5 class="card-title">${response.text}</h5>
          <ul class="list-group list-group-flush">
            <li class="list-group-item">Type: ${response.type}</li>
            <li class="list-group-item">Error correction level:
              ${response.errorCorrectionLevel}
            </li>
            <li class="list-group-item">Format: ${response.format}</li>
          </ul>
          <a
            class="btn btn-primary"
            href="${response.result}"
            download="${response.text.split(" ").join("_")}.${response.type}"
          >
            Download
          </a>
        </div>
      </div>
    `;
  } catch (err) {
    displayAlert(err.error, "error", err.errorKeys.join(" "));
  }
}
