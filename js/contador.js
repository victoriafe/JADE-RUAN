function atualizarContador() {
  const destino = new Date("2025-12-23 00:00:00").getTime();
  const agora = new Date().getTime();
  const diff = destino - agora;

  const contadorEl = document.getElementById("contador");

  if (diff < 0) {
    contadorEl.innerHTML = "Já chegou o grande dia! 🎉";
    return;
  }

  const dias = Math.floor(diff / (1000*60*60*24));
  const horas = Math.floor((diff % (1000*60*60*24)) / (1000*60*60));
  const minutos = Math.floor((diff % (1000*60*60)) / (1000*60));
  const segundos = Math.floor((diff % (1000*60)) / 1000);

  contadorEl.innerHTML = `
    <span>${dias}d</span> 
    <span>${horas}h</span> 
    <span>${minutos}m</span> 
    <span>${segundos}s</span>
  `;
}

setInterval(atualizarContador, 1000);
atualizarContador();
