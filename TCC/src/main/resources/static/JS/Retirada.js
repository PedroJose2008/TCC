const API_OS_LISTAR = "http://192.168.10.22:8013/ordens/listartodos";
const API_OS_ATUALIZAR = "http://192.168.10.22:8013/ordens/atualizar";

document.addEventListener("DOMContentLoaded", () => {
    listarCadastro();
});


async function listarCadastro() {
    const response = await fetch(API_OS_LISTAR);
    const dados = await response.json();

    const tbody = document.getElementById("listaRetiradas");
    tbody.innerHTML = "-";

    // Filtra paar pegar somente o q esta em retirada
    const ordensParaRetirada = dados.filter(os => os.status === "AGUARDANDO_RETIRADA");

    ordensParaRetirada.forEach(Cadastro => {
        const tr = document.createElement("tr");

       // usa o split para deixar a data no padrao brasileiro
        const dataFormatada = Cadastro.dataCadastro.split('-').reverse().join('/');
        const nomeCliente = Cadastro.cliente.razaoSocial;
        const nomeMecanico = Cadastro.usuario.nome;
        const nomeKit = Cadastro.kit.nome;
        const formaPagamento = Cadastro.pagamento;
        
        const valorCalculado = parseFloat(Cadastro.valor);
        const valorFormatado = valorCalculado.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

        // css do status
        const classesStatus = {
            "AGUARDANDO_RETIRADA": "badge-yellow"
        };
        const classeAplicada = classesStatus[Cadastro.status];

        tr.innerHTML = `
            <td><strong>#OS-${Cadastro.id}</strong></td>
            <td>${nomeCliente}</td>
            <td>${nomeMecanico}</td>
            <td>${nomeKit}</td>
            <td>${formaPagamento}</td>
            <td><strong style="color: var(--success);">${valorFormatado}</strong></td>
            <td><span class="${classeAplicada}">${Cadastro.status}</span></td>        
            <td>
                <button class="btn btn-success btn-sm" onclick="concluirRetirada(${Cadastro.id})">Concluir Retirada</button>
            </td>
        `;

        tbody.appendChild(tr);
    });
}

async function concluirRetirada(idOS) {
    if (!confirm("Confirmar que o cliente efetuou o pagamento e retirou o equipamento?")) return;

    // Gera a data ao clica em retirada
    const dataDeHojeFormatada = new Date().toISOString().split('T')[0];

    const os = {
        status: "FINALIZADA",
        dataFinalizacao: dataDeHojeFormatada
    };

    await fetch(`${API_OS_ATUALIZAR}/${idOS}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(os)
    });

    listarCadastro(); 
}