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
let currentlyPlaying = null;

radioLinks.forEach((link) => {
  link.addEventListener("click", (e) => {
    e.preventDefault();

    const audioContainer = link.querySelector('.audio-container');
    const audio = link.querySelector('audio');

    console.log('Audio element:', audio); // Проверяем элемент
    console.log('Audio source:', audio?.currentSrc || audio?.src); // Проверяем путь к файлу
    console.log('Audio ready state:', audio?.readyState); // Проверяем состояние загрузки

    // Обработка active класса для ссылки
    if (link.classList.contains("active")) {
      link.classList.remove("active");
      // Останавливаем аудио при деактивации
      if (audio) {
        audio.pause();
        audio.currentTime = 0;
        audioContainer.classList.remove('playing');
        currentlyPlaying = null;
      }
      return;
    }

    // Удаляем active класс у всех ссылок и останавливаем все аудио
    radioLinks.forEach((otherLink) => {
      otherLink.classList.remove("active");
      const otherAudio = otherLink.querySelector('audio');
      if (otherAudio) {
        otherAudio.pause();
        otherAudio.currentTime = 0;
        otherLink.querySelector('.audio-container')?.classList.remove('playing');
      }
    });

    link.classList.add("active");

    // Воспроизводим аудио
    if (audio) {
      try {
        // Принудительно устанавливаем громкость и размьючиваем
        audio.volume = 1;
        audio.muted = false;
        
        // Пробуем воспроизвести
        const playPromise = audio.play();
        
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              console.log('Successfully playing audio');
              audioContainer.classList.add('playing');
              currentlyPlaying = audio;
            })
            .catch(error => {
              console.error('Error playing audio:', error);
              audioContainer.classList.remove('playing');
              currentlyPlaying = null;
            });
        } else {
          console.log('Play promise is undefined, trying direct play');
          audio.play();
          audioContainer.classList.add('playing');
          currentlyPlaying = audio;
        }
      } catch (error) {
        console.error('Error in audio playback:', error);
      }
    } else {
      console.error('Audio element not found in link:', link);
    }
  });
});
// Добавляем обработчики событий для аудио при загрузке страницы
// document.addEventListener('DOMContentLoaded', () => {
//   const audioElements = document.querySelectorAll('audio');
  
//   audioElements.forEach(audio => {
//     // Проверяем все аудио элементы при загрузке
//     console.log('Found audio element:', audio);
//     console.log('Audio source:', audio.currentSrc || audio.src);
    
//     audio.addEventListener('error', (e) => {
//       console.error('Audio loading error:', e);
//       console.error('Error code:', e.target.error.code);
//     });

//     audio.addEventListener('loadeddata', () => {
//       console.log('Audio loaded successfully');
//     });

//     audio.addEventListener('playing', () => {
//       console.log('Audio started playing');
//     });

//     // Добавляем обработчик для отслеживания возможности воспроизведения
//     audio.addEventListener('canplay', () => {
//       console.log('Audio can be played');
//     });
//   });
// });

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


function setLoading(isLoading) {
  const button = document.querySelector('.sendFormBtn');
  const buttonText = button.querySelector('span');
  
  if (isLoading) {
    buttonText.textContent = 'Отправка...';
    button.disabled = true;
  } else {
    buttonText.textContent = 'Отправить';
    button.disabled = false;
  }
}

const proxyUrl = 'https://cors-anywhere.herokuapp.com/';
const apiUrl = 'https://soundservice.me/api/v1/leads';
// Form
document.querySelectorAll(".sendFormBtn").forEach((btn) => {
  btn.addEventListener("click", async (e) => {
    e.preventDefault();
    console.log('Кнопка отправки нажата');

    const form = btn.closest("form");
    const inputs = form.querySelectorAll("input");
    let isFormValid = validateInputs(inputs);

    if (!isFormValid) {
      console.error('Форма не прошла валидацию!');
      return;
    }

      // Находим поля в текущей форме
      const nameInput = form.querySelector('.input-name');
      const companyInput = form.querySelector('.input-company');
      const phoneInput = form.querySelector('.phoneMask');
    // Проверяем наличие полей и выводим отладочную информацию
    console.log('Найденные поля:', {
      nameInput: nameInput?.value,
      companyInput: companyInput?.value,
      phoneInput: phoneInput?.value
    });
          // Проверяем, что все поля найдены
    if (!nameInput || !companyInput || !phoneInput) {
      console.error('Не найдены все необходимые поля формы');
      return;
    }

    const formData = {
      name: nameInput.value,
      company_name: companyInput.value,
      phone: phoneInput.value,
      from: 'asia'
    };

    console.log('Отправляемые данные:', formData);

    try {
      console.log('Начинаем отправку на сервер...');
      
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          "Access-Control-Allow-Methods": "OPTIONS,POST,GET,PATCH"
        },
        mode: 'cors', // добавляем явное указание режима CORS
        credentials: 'include', // добавляем передачу куки, если нужно
        body: JSON.stringify(formData)
      });

      console.log('Ответ получен:', response);
      
      const responseData = await response.json();
      console.log('Данные ответа:', responseData);

      if (!response.ok) {
        throw new Error(`Ошибка сервера: ${response.status}`);
      }

      // Успешная отправка
      Notify.success(
        "Спасибо за заявку! <br/> Мы свяжемся с вами в течение рабочего дня.",
      );
      clearInputs(form);

    } catch (error) {
      console.error('Ошибка:', error);
      console.error('Произошла ошибка при отправке формы. Пожалуйста, попробуйте еще раз.');
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