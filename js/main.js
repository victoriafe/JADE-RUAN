const API_SERVER = "https://jade-ruan.onrender.com";
const SENHA_NOIVA = "meuacesso123";

function makeSafeId(txt) {
  return 'nome_' + String(txt).normalize('NFD')
    .replace(/[\u0300-\u036f]/g,'')
    .replace(/[^\w\-]+/g,'_');
}

async function carregarPresentes() {
  try {
    const res = await fetch(`${API_SERVER}/presentes`);
    if (!res.ok) throw new Error('Falha ao carregar presentes');
    const data = await res.json();

    const lista = document.getElementById("lista");
    lista.innerHTML = "";
    data.filter(p => (p.status||'').toLowerCase() === "disponível").forEach(p => {
      const inputId = makeSafeId(p.item);
      const div = document.createElement("div");
      div.className = "presente";
      div.innerHTML = `
        <h3>${p.item}</h3>
        <p>Valor: R$ ${p.valor||"-"}</p>
        <a href="${p.link}" target="_blank">Ver na loja</a><br>
        <input type="text" id="${inputId}" placeholder="Seu nome">
        <button data-item="${encodeURIComponent(p.item)}" class="btnEscolher">Escolher presente</button>`;
      lista.appendChild(div);
    });

    const painel = document.getElementById("painelNoiva");
    painel.innerHTML = "";
    data.forEach(p => {
      const div = document.createElement("div");
      div.className = "presente";
      div.innerHTML = `
        <h3>${p.item}</h3>
        <p>Valor: R$ ${p.valor||"-"}</p>
        <p>Status: ${p.status||"-"}</p>
        <p>Quem escolheu: ${p.quem||"-"}</p>
        <a href="${p.link}" target="_blank">Ver na loja</a>`;
      painel.appendChild(div);
    });

    document.querySelectorAll('.btnEscolher').forEach(btn => {
      btn.addEventListener('click', async ev => {
        const itemOriginal = decodeURIComponent(ev.currentTarget.getAttribute('data-item'));
        const inputId = makeSafeId(itemOriginal);
        const nome = document.getElementById(inputId)?.value?.trim();
        if (!nome) { alert("Por favor, digite seu nome."); return; }

        const btnAtual = ev.currentTarget;
        btnAtual.disabled = true;
        btnAtual.textContent = 'Enviando...';

        try {
          const resp = await fetch(`${API_SERVER}/escolher`, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({item: itemOriginal, quem: nome})
          });
          const result = await resp.json();
          if (result.success) alert(`Obrigado, ${nome}! Você escolheu: ${itemOriginal}`);
          else alert(result.message || "Não foi possível reservar o presente.");
        } catch (err) {
          console.error(err);
          alert("Erro ao reservar. Tente novamente.");
        } finally {
          btnAtual.closest(".presente")?.remove();
          carregarPresentes();
        }
      });
    });

  } catch (err) {
    console.error(err);
    alert("Não foi possível carregar a lista agora.");
  }
}

function entrarNoiva() {
  const senha = document.getElementById("senhaNoiva").value;
  if (senha === SENHA_NOIVA) {
    document.getElementById("loginNoiva").style.display = "none";
    document.getElementById("painelNoiva").style.display = "grid";
  } else {
    alert("Senha incorreta!");
  }
}

document.getElementById('btnLogin').addEventListener('click', entrarNoiva);

carregarPresentes();
