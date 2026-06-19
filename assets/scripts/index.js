// === 1. EASTER EGG: SENTIDO ARANHA ===
let konamiCode = "";
window.addEventListener("keydown", (e) => {
  konamiCode += e.key.toLowerCase();
  if (konamiCode.includes("spider")) {
    alert("🕸️ Você ativou o Sentido Aranha! 🕸️");
    konamiCode = ""; // Reseta o código
  }
  if (konamiCode.length > 10) konamiCode = "";
});

// === 2. EFEITOS DE HOVER NOS CARDS (HOME) ===
function handleMouseEnter() {
  this.classList.add('s-card--hovered');
  document.body.id = `${this.id}-hovered`;
}

// Quando o mouse sai, remove o efeito de fundo
function handleMouseLeave() {
  this.classList.remove('s-card--hovered');
  document.body.id = '';
}

function addEventListenersToCards() {
  const cardElements = document.getElementsByClassName('s-card');
  for (let index = 0; index < cardElements.length; index++) {
    const card = cardElements[index];
    card.addEventListener('mouseenter', handleMouseEnter);
    card.addEventListener('mouseleave', handleMouseLeave);
  }
}

document.addEventListener("DOMContentLoaded", addEventListenersToCards, false);

// === 3. CONTROLE DO CARROSSEL 3D (HOME) ===
function selectCarouselItem(selectedButtonElement) {
  const selectedItem = selectedButtonElement.id;
  const carousel = document.querySelector('.s-cards-carousel');
  
  let currentTransform = carousel.style.transform || "translateZ(-35vw) rotateY(0deg)";
  
  const degreesMap = {
    "1": 0,
    "2": -120,
    "3": -240
  };
  
  const rotateYDeg = degreesMap[selectedItem] ?? 0;
  const rotateYMatch = currentTransform.match(/rotateY\((-?\d+deg)\)/i);

  if (rotateYMatch) {
    carousel.style.transform = currentTransform.replace(rotateYMatch[0], `rotateY(${rotateYDeg}deg)`);
  } else {
    carousel.style.transform = `translateZ(-35vw) rotateY(${rotateYDeg}deg)`;
  }

  const activeButtonElement = document.querySelector('.s-controller__button--active');
  if (activeButtonElement) {
    activeButtonElement.classList.remove('s-controller__button--active');
  }
  selectedButtonElement.classList.add('s-controller__button--active');
}

// === 4. NAVEGAÇÃO INTERNA, SOM E TRANSIÇÕES (PÁGINAS INTERNAS) ===
document.addEventListener("DOMContentLoaded", () => {
  const currentPath = window.location.pathname;
  const currentPage = currentPath.substring(currentPath.lastIndexOf('/') + 1);
  const navLinks = document.querySelectorAll(".navigator ul li a");
  const loader = document.getElementById("loading-screen");

  // Remove o loading de entrada inicial de forma suave
  if (loader) {
    loader.style.opacity = "0";
    setTimeout(() => {
      if (loader.parentNode) loader.remove();
    }, 450);
  }

  if (navLinks.length > 0) {
    navLinks.forEach(link => {
      link.classList.remove("active");
      const linkHref = link.getAttribute("href");

      if (currentPage === linkHref) {
        link.classList.add("active");
      }

      link.addEventListener('click', (e) => {
        e.preventDefault(); 
        
        const targetUrl = link.getAttribute('href');
        if (currentPage === targetUrl) return;

        // AJUSTE INTELIGENTE: Detecta se o script está rodando na raiz ou em subpastas
        const isInternalPage = window.location.pathname.includes('/pages/');
        const pathToAssets = isInternalPage ? '../../assets/' : './assets/';

        // Cria a tela de carregamento dinâmica com as correções aplicadas
        const NewLoader = document.createElement("div");
        NewLoader.innerHTML = `
          <div style="position:fixed; top:0; left:0; width:100%; height:100%; background:#0b0b10; z-index:9999; display:flex; flex-direction:column; justify-content:center; align-items:center; opacity:0; transition: opacity 0.4s ease;">
            <img src="${pathToAssets}images/icons/spider.svg" class="spider-glow" style="width:70px; height:auto; margin-bottom:15px;" alt="Carregando...">
            <span style="color:#fff; font-family:'Poppins', sans-serif; font-size:14px; letter-spacing:2px; text-transform: uppercase; animation: pulseText 1.5s infinite;">Carregando Multiverso...</span>
          </div>
          <style>
            @keyframes glow {
              0% { transform: scale(0.95); filter: drop-shadow(0 0 5px rgba(255,0,0,0.3)); }
              50% { transform: scale(1.05); filter: drop-shadow(0 0 20px rgba(255,0,0,0.8)); }
              100% { transform: scale(0.95); filter: drop-shadow(0 0 5px rgba(255,0,0,0.3)); }
            }
            @keyframes pulseText {
              0%, 100% { opacity: 0.5; }
              50% { opacity: 1; }
            }
            .spider-glow { animation: glow 1.5s infinite ease-in-out; }
          </style>
        `;
        document.body.appendChild(NewLoader);

        setTimeout(() => {
          NewLoader.firstElementChild.style.opacity = "1";
        }, 10);

        navLinks.forEach(l => l.classList.remove("active"));
        
        // Dispara o áudio thwip usando o caminho dinâmico correto
        const webSound = new Audio(`${pathToAssets}audio/thwip.mp3`);
        webSound.volume = 0.5;
        
        webSound.play().catch(error => {
          console.log("Erro ou bloqueio de áudio:", error);
          window.location.href = targetUrl;
        });
        
        webSound.onended = () => {
          window.location.href = targetUrl;
        };
      });
    });
  }
});