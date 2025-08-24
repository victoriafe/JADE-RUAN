const API_SERVER = "https://jade-ruan.onrender.com";

function makeSafeId(txt) {
  return 'nome_' + String(txt).normalize('NFD')
    .replace(/[\u0300-\u036f]/g,'')
    .replace(/[^\w\-]+/g,'_');
}

async function carregarPresentes() {
  const lista = document.getElementById("lista");
  if (!lista) return; // evita erro se elemento não existir

  try {
    const res = await fetch(`${API_SERVER}/presentes`);
    if (!res.ok) throw new Error("Erro ao carregar presentes");
    const data = await res.json();

    lista.innerHTML = "";

    data.filter(p => (p.status||'').toLowerCase() === "Disponível").forEach(p => {
      const inputId = makeSafeId(p.item);
      const div = document.createElement("div");
      div.className = "presente";
      div.innerHTML = `
        <h3>${p.item}</h3>
        <p>Valor: R$ ${p.valor||"-"}</p>
        <a href="${p.link}" target="_blank">Ver na loja</a><br>
        <input type="text" id="${inputId}" placeholder="Seu nome">
        <button data-item="${encodeURIComponent(p.item)}" class="btnEscolher">Escolher presente</button>
      `;
      lista.appendChild(div);
    });

    document.querySelectorAll('.btnEscolher').forEach(btn => {
      btn.addEventListener('click', async ev => {
        const itemOriginal = decodeURIComponent(btn.dataset.item);
        const nome = document.getElementById(makeSafeId(itemOriginal))?.value?.trim();
        if (!nome) return alert("Por favor, digite seu nome.");

        btn.disabled = true;
        btn.textContent = "Enviando...";

        try {
          const resp = await fetch(`${API_SERVER}/escolher`, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({item: itemOriginal, quem: nome})
          });
          const result = await resp.json();
          alert(result.success ? `Obrigado, ${nome}! Você escolheu: ${itemOriginal}` : result.message || "Erro ao reservar.");
        } catch {
          alert("Erro ao reservar. Tente novamente.");
        } finally {
          btn.closest(".presente")?.remove();
          carregarPresentes();
        }
      });
    });

  } catch (err) {
    console.error(err);
    alert("Não foi possível carregar a lista agora.");
  }
}

carregarPresentes();
