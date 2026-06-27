document.addEventListener('DOMContentLoaded', () => {
  const avatarBtn = document.getElementById('user-menu-btn');
  const userModal = document.getElementById('user-modal');

  // Alterna a exibição do modal ao clicar no avatar AL
  avatarBtn.addEventListener('click', (e) => {
    e.stopPropagation(); // Evita que o clique feche o modal imediatamente
    const isVisible = userModal.style.display === 'block';
    userModal.style.display = isVisible ? 'none' : 'block';
  });

  // Fecha o modal se o usuário clicar em qualquer outro lugar da tela
  document.addEventListener('click', (e) => {
    if (!userModal.contains(e.target) && e.target !== avatarBtn) {
      userModal.style.display = 'none';
    }
  });
});

// Funções de clique dos botões do Modal
function logout() {
  if (confirm("Deseja realmente sair?")) {
    window.location.href = "login.html"; // manda o usuario  para o login
  }
}

// dashboard.js - Atualize apenas esta função

function excluirConta(event) {
  // SEGREDO AQUI: Impede que o clique no botão "suba" para o document e feche o modal
  if (event) {
    event.stopPropagation();
    event.preventDefault();
  }

  const modalContent = document.querySelector('.user-modal-content');
  const htmlAntigo = modalContent.innerHTML;

  // Renderiza a tela de senha
  modalContent.innerHTML = `
    <div id="modal-transicao-segura" style="font-family: 'DM Sans', sans-serif; padding: 10px 5px; min-width: 250px;">
      <label style="font-size: 13px; font-weight: 600; color: #1a2340; display: block; margin-bottom: 10px;">
        Digite sua senha para confirmar:
      </label>
      <input type="password" id="senhaExcluir" placeholder="Sua senha atual" 
        style="width: 100%; padding: 12px 10px; border: 1.5px solid #d6dff0; border-radius: 8px; font-size: 14px; margin-bottom: 15px; outline: none;"
      >
      <div style="display: flex; gap: 8px;">
        <button id="btnConfirmarExclusao" style="flex: 1; background: #ef4444; color: white; border: none; padding: 12px; border-radius: 8px; font-weight: 600; font-size: 13.5px; cursor: pointer;">
          Confirmar
        </button>
        <button id="btnCancelarExclusao" style="flex: 1; background: #e1e8f5; color: #4a6080; border: none; padding: 12px; border-radius: 8px; font-weight: 600; font-size: 13.5px; cursor: pointer;">
          Cancelar
        </button>
      </div>
    </div>
  `;

  // Garante que cliques dentro da caixinha de senha também não fechem o modal
  document.getElementById('modal-transicao-segura').addEventListener('click', (e) => {
    e.stopPropagation();
  });

  // Lógica do botão Confirmar
  document.getElementById('btnConfirmarExclusao').addEventListener('click', (e) => {
    e.stopPropagation();
    const senhaDigitada = document.getElementById('senhaExcluir').value;
    const senhaCorreta = "1234"; // Defina sua senha aqui

    if (senhaDigitada === senhaCorreta) {
      alert("Conta deletada com sucesso!");
      window.location.href = "login.html";
    } else {
      alert("Senha incorreta! Operação cancelada.");
      modalContent.innerHTML = htmlAntigo;
    }
  });

  // Lógica do botão Cancelar
  document.getElementById('btnCancelarExclusao').addEventListener('click', (e) => {
    e.stopPropagation();
    modalContent.innerHTML = htmlAntigo;
  });
}