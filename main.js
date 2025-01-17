import IMask from "imask";
import MicroModal from "micromodal";
import { Notify } from "notiflix/build/notiflix-notify-aio";

import "./style.css";
import "./modal.css";

const body = document.querySelector("body");
const header = document.querySelector("header");
const loginBtn = document.getElementById("loginBtn");
const menuButton = document.getElementById("menuButton");
const mobileMenu = document.getElementById("mobileMenu");
const offerButtons = document.querySelectorAll(".offer-btn");
const radioLinks = document.querySelectorAll(".radio-link");
const accordionHeaders = document.querySelectorAll(".accordion-header");

// Mobile menu
menuButton.addEventListener("click", () => {
  menuButton.classList.toggle("active");
  body.classList.toggle("overflow-hidden");
  mobileMenu.classList.toggle("hidden");
  loginBtn.classList.toggle("hidden");
  header.classList.toggle("active");
});

function removeMobileStyles() {
  menuButton.classList.remove("active");
  body.classList.remove("overflow-hidden");
  mobileMenu.classList.add("hidden");
  loginBtn.classList.remove("hidden");
  header.classList.remove("active");
}

document.querySelectorAll(".mobile-link").forEach((link) => {
  link.addEventListener("click", (e) => {
    e.preventDefault();

    const id = link.getAttribute("href").replace("#", "");
    const element = document.getElementById(id);

    if (element) {
      removeMobileStyles();
      element.scrollIntoView({ behavior: "smooth" });
    }
  });
});

// Radio links
radioLinks.forEach((link) => {
  link.addEventListener("click", (e) => {
    e.preventDefault();

    if (link.classList.contains("active")) {
      link.classList.remove("active");
      return;
    }

    radioLinks.forEach((link) => link.classList.remove("active"));

    link.classList.add("active");
  });
});

// Offer show more
offerButtons.forEach((button) => {
  button.addEventListener("click", () => {
    button.closest("li").classList.toggle("active");
  });
});

// Accordion
accordionHeaders.forEach((button) => {
  button.addEventListener("click", () => {
    const accordionContent = button.nextElementSibling;
    button.classList.toggle("active");
    accordionContent.style.maxHeight = button.classList.contains("active")
      ? `${accordionContent.scrollHeight}px`
      : "0";
  });
});

// Input mask
document.querySelectorAll(".phoneMask").forEach((phone) => {
  IMask(phone, { mask: "+{7} (000) 000 00 00" });
});

// Notify
Notify.init({
  width: "360px",
  distance: "20px",
  fontSize: "16px",
  plainText: false,
  useIcon: false,
  success: {
    background: "#FAC114",
    textColor: "#362000",
  },
});

// Form
document.querySelectorAll(".sendFormBtn").forEach((btn) => {
  btn.addEventListener("click", (e) => {
    e.preventDefault();

    const form = btn.closest("form");
    const inputs = form.querySelectorAll("input");
    let isFormValid = validateInputs(inputs);

    if (isFormValid) {
      Notify.success(
        "Спасибо за заявку! <br/> Мы свяжемся с вами в течение рабочего дня.",
      );

      clearInputs(form);
    }
  });
});

// Validate inputs
function validateInputs(inputs) {
  let isValid = true;
  inputs.forEach((input) => {
    const wrapper = input.closest(".input-wrapper");
    const isPhoneField = input.classList.contains("phoneMask");
    const phoneDigits = input.value.replace(/\D/g, "").length;

    wrapper.classList.remove("error");

    if (input.value.trim() === "" || (isPhoneField && phoneDigits < 11)) {
      isValid = false;
      wrapper.classList.add("error");
    }
  });
  return isValid;
}

// Clear inputs
function clearInputs(container) {
  container.querySelectorAll(".input-wrapper").forEach((wrapper) => {
    wrapper.classList.remove("error");
  });
  container.querySelectorAll("input").forEach((input) => {
    input.value = "";
  });
}

// Input validation on typing
document.querySelectorAll(".input-wrapper input").forEach((input) => {
  input.addEventListener("input", () => {
    const wrapper = input.closest(".input-wrapper");
    const isPhoneField = input.classList.contains("phoneMask");
    const phoneDigits = input.value.replace(/\D/g, "").length;

    wrapper.classList.remove("error");

    if (input.value.trim() === "" || (isPhoneField && phoneDigits < 11)) {
      wrapper.classList.add("error");
    }
  });
});

// Resize window
function handleResize() {
  const width = window.innerWidth;

  if (width >= 1024) {
    removeMobileStyles();
  }
}

window.addEventListener("resize", handleResize);
handleResize();

document.addEventListener("DOMContentLoaded", function () {
  const video = document.querySelector("video");
  video.play();
});
