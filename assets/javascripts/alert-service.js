import sweetalert2 from "https://cdn.jsdelivr.net/npm/sweetalert2@11.10.8/+esm";

export function displayAlert(title, icon, text = "") {
  sweetalert2.fire({ title, icon, text });
}
