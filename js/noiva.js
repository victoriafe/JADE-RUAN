const SENHA_NOIVA = "meuacesso123";

function makeSafeId(txt) {
  return 'nome_' + String(txt).normalize('NFD')
    .replace(/[\u0300-\u036f]/g,'')
    .replace(/[^\w\-]+/g,'_');
}

async function carregarPresentesNoiva() {
  const painel = document.getElementById("painelNoiva");
  if (!painel) return;

  try {
    const res = await fetch("https://jade-ruan.onrender.com/presentes");
    if (!res.ok) throw new Error("Erro ao carregar presentes");
    const data = await res.json();

    painel.innerHTML = "";

    data.forEach(p => {
      const div = document.createElement("div");
      div.className = "presente";
      div.innerHTML = `
        <h3>${p.item}</h3>
        <p>Valor: R$ ${p.valor || "-"}</p>
        <p>Status: ${p.status || "-"}</p>
        <p>Quem escolheu: ${p.quem || "-"}</p>
        <a href="${p.link}" target="_blank">Ver na loja</a>
      `;
      painel.appendChild(div);
    });

  } catch (err) {
    console.error(err);
    alert("Não foi possível carregar a lista agora.");
  }
}

function entrarNoiva() {
  const senha = document.getElementById("senhaNoiva")?.value;
  if (!senha) return;

  if (senha === SENHA_NOIVA) {
    document.getElementById("loginNoiva").style.display = "none";
    document.getElementById("painelNoiva").style.display = "grid";
    carregarPresentesNoiva();
  } else {
    alert("Senha incorreta!");
  }
}

document.getElementById('btnLogin')?.addEventListener('click', entrarNoiva);
