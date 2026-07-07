const API_OS_LISTAR = 'http://localhost:8001/ordens/listartodos';
const API_OS_ATUALIZAR = 'http://localhost:8001/ordens/atualizar';

document.addEventListener("DOMContentLoaded", () => {
    listarCadastro();
});

async function listarCadastro() {
    const response = await fetch(API_OS_LISTAR);
    const dados = await response.json();

    const tbody = document.getElementById("listaRetiradas");
    if (!tbody) return;
    tbody.innerHTML = "";

    dados.forEach(Cadastro => {
        if (Cadastro.status && Cadastro.status === "AGUARDANDO_RETIRADA") {
            const tr = document.createElement("tr");

            const dataFormatada = Cadastro.dataCadastro ? Cadastro.dataCadastro.split('-').reverse().join('/') : "-";
            const nomeCliente = Cadastro.cliente ? (Cadastro.cliente.razaoSocial || Cadastro.cliente.nome) : "-";
            const nomeMecanico = Cadastro.usuario ? Cadastro.usuario.nome : "-";
            const nomeKit = Cadastro.kit ? Cadastro.kit.nome : "-";
            const formaPagamento = Cadastro.pagamento || "A combinar";
            
            const valorCalculado = Cadastro.valor ? parseFloat(Cadastro.valor) : 0;
            const valorFormatado = valorCalculado.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

            tr.innerHTML = `
                <td><strong>#OS-${Cadastro.id}</strong></td>
                <td>${nomeCliente}</td>
                <td>${nomeMecanico}</td>
                <td>${nomeKit}</td>
                <td>${formaPagamento}</td>
                <td><strong style="color: var(--success);">${valorFormatado}</strong></td>
                <td><span class="badge-yellow">Aguardando Retirada</span></td>        
                <td>
                    <button class="btn btn-success btn-sm" onclick="concluirRetirada(${Cadastro.id})">Concluir Retirada</button>
                </td>
            `;

            tbody.appendChild(tr);
        }
    });

    // Se após passar por todas as ordens o tbody continuar vazio, exibe a mensagem de lista vazia
    if (tbody.innerHTML === "") {
        tbody.innerHTML = `<tr><td colspan="8" style="text-align:center; color:var(--text3); padding:20px;">Nenhuma ordem pendente de retirada.</td></tr>`;
    }
}

async function concluirRetirada(idOS) {
    if (!confirm("Confirmar que o cliente efetuou o pagamento e retirou o equipamento?")) return;

    const os = {
        status: "FINALIZADA"
    };

    await fetch(`${API_OS_ATUALIZAR}/${idOS}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(os)
    });

    // Recarrega a lista da retirada
    listarCadastro(); 
}