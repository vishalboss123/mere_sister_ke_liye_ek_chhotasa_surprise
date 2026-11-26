(() => {
  const pages = [...document.querySelectorAll(".page")];
  const counter = document.getElementById("pageCounter");
  const progress = document.getElementById("progressFill");
  const bottomText = document.getElementById("bottomText");
  let current = 0;
  const messages = [
    "A LITTLE MAGIC IS WAITING ON THE NEXT PAGE",
    "A LETTER, WRITTEN JUST FOR YOU",
    "SOME WORDS FROM YOUR LITTLE BROTHER",
    "FOUR WISHES, ONE BIG HEART",
    "THE BIRTHDAY QUEEN DESERVES A FRAME",
    "LITTLE MOMENTS, FOREVER MEMORIES",
    "A SPECIAL AWARD IS WAITING",
    "CLOSE YOUR EYES AND MAKE A WISH",
    "ONE PROMISE FROM YOUR LITTLE BROTHER",
    "THIS FINAL MOMENT IS ALL YOURS"
  ];

  function showPage(index) {
    if (index < 0 || index >= pages.length) return;
    pages[current].classList.remove("active");
    current = index;
    pages[current].classList.add("active");
    counter.innerHTML = `${String(current + 1).padStart(2, "0")} <b>/</b> ${String(pages.length).padStart(2, "0")}`;
    progress.style.width = `${((current + 1) / pages.length) * 100}%`;
    bottomText.textContent = messages[current];
    window.scrollTo({top: 0, behavior: "smooth"});
  }
  document.querySelectorAll("[data-next]").forEach(button => button.addEventListener("click", () => showPage(current + 1)));
  document.getElementById("replayButton").addEventListener("click", () => showPage(0));

  // Gentle emoji rain remains active on every page.
  const canvas = document.getElementById("rainCanvas");
  const ctx = canvas.getContext("2d");
  const emojis = ["💗","🌸","✨","💜","🦋","💕","🌷","⭐","🎀","💫"];
  let drops = [];
  let width = 0, height = 0, dpr = 1;
  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = window.innerWidth; height = window.innerHeight;
    canvas.width = width * dpr; canvas.height = height * dpr;
    canvas.style.width = width + "px"; canvas.style.height = height + "px";
    ctx.setTransform(dpr,0,0,dpr,0,0);
    const count = Math.max(22, Math.min(58, Math.floor(width / 17)));
    drops = Array.from({length: count}, () => ({
      x: Math.random()*width, y: Math.random()*height,
      speed: .45 + Math.random()*1.15, size: 12 + Math.random()*12,
      emoji: emojis[Math.floor(Math.random()*emojis.length)],
      drift: (Math.random()-.5)*.35, alpha: .35 + Math.random()*.45
    }));
  }
  function drawRain() {
    ctx.clearRect(0,0,width,height);
    for (const drop of drops) {
      ctx.globalAlpha = drop.alpha;
      ctx.font = `${drop.size}px "Apple Color Emoji","Segoe UI Emoji",sans-serif`;
      ctx.fillText(drop.emoji, drop.x, drop.y);
      drop.y += drop.speed; drop.x += drop.drift;
      if (drop.y > height + 24) { drop.y = -24; drop.x = Math.random()*width; }
      if (drop.x < -20) drop.x = width + 20;
      if (drop.x > width + 20) drop.x = -20;
    }
    ctx.globalAlpha = 1;
    requestAnimationFrame(drawRain);
  }
  resize(); window.addEventListener("resize", resize); drawRain();

  // Cake candle interaction.
  document.getElementById("candleButton").addEventListener("click", () => {
    const flame = document.getElementById("flame");
    const hint = document.getElementById("candleHint");
    const message = document.getElementById("cakeMessage");
    flame.style.display = "none";
    hint.textContent = "YOUR WISH IS ON ITS WAY 💫";
    message.textContent = "May every beautiful wish of yours come true, Didi! ♡";
    burstConfetti(55);
  });

  function burstConfetti(count) {
    const layer = document.getElementById("confettiLayer");
    const colors = ["#ff9fc9","#efd395","#b99cff","#fff2f8","#f16fa9","#b6e3d5"];
    for (let i=0;i<count;i++) {
      const piece = document.createElement("i");
      piece.className = "confetti";
      piece.style.left = `${Math.random()*100}%`;
      piece.style.background = colors[Math.floor(Math.random()*colors.length)];
      piece.style.setProperty("--duration", `${2.8+Math.random()*3.5}s`);
      piece.style.setProperty("--drift", `${-120+Math.random()*240}px`);
      piece.style.animationDelay = `${Math.random()*1.1}s`;
      layer.appendChild(piece);
      setTimeout(()=>piece.remove(),7000);
    }
  }
  document.getElementById("celebrateButton").addEventListener("click", () => {
    burstConfetti(130);
    const btn = document.getElementById("celebrateButton");
    btn.textContent = "HAPPY BIRTHDAY, KAJAL DIDI! 💗";
    showToast("A whole sky of wishes, just for you! ✨");
  });

  // Optional soft synthesized chime; starts only after the visitor taps the sound button.
  let audioCtx = null, soundOn = false, chimeTimer = null;
  const soundButton = document.getElementById("soundToggle");
  const soundText = document.getElementById("soundText");
  function chime() {
    if (!soundOn || !audioCtx) return;
    const now = audioCtx.currentTime;
    [523.25,659.25,783.99].forEach((freq,i)=>{
      const osc=audioCtx.createOscillator(), gain=audioCtx.createGain();
      osc.type="sine"; osc.frequency.value=freq;
      gain.gain.setValueAtTime(.0001,now+i*.12);
      gain.gain.exponentialRampToValueAtTime(.035,now+i*.12+.03);
      gain.gain.exponentialRampToValueAtTime(.0001,now+i*.12+.48);
      osc.connect(gain);gain.connect(audioCtx.destination);
      osc.start(now+i*.12);osc.stop(now+i*.12+.5);
    });
  }
  soundButton.addEventListener("click", async () => {
    try {
      if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      if (audioCtx.state === "suspended") await audioCtx.resume();
      soundOn = !soundOn;
      soundText.textContent = soundOn ? "SOUND ON" : "SOUND OFF";
      if (chimeTimer) clearInterval(chimeTimer);
      if (soundOn) { chime(); chimeTimer = setInterval(chime, 4200); }
    } catch (_) { showToast("Sound is not available in this browser."); }
  });

  let toastTimer;
  function showToast(text) {
    const toast=document.getElementById("toast");
    toast.textContent=text;toast.classList.add("show");
    clearTimeout(toastTimer);toastTimer=setTimeout(()=>toast.classList.remove("show"),2600);
  }
})();