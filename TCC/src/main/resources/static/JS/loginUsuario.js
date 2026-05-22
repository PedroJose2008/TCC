async function logar() {
    // Captura os valores dos campos do formulário
    const email = document.getElementById("email").value;
    const senha = document.getElementById("senha").value;

    // Cria o objeto de login para enviar ao backend
    const usuario = {
        email: email,
        senha: senha
    };
        // Envia a requisição POST para o seu endpoint de login
        const response = await fetch("http://localhost:8000/usuarios/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(usuario)
        });

        // Verifica se a resposta foi bem-sucedida (Status 200-299)
        if (response.ok) {
            const data = await response.json();

            // Armazena os dados do usuário no LocalStorage para persistir o login no navegador
            localStorage.setItem(
                "usuarioLogado",
                JSON.stringify(data)
            );

            // Redireciona o usuário para a página principal após o login
            window.location.href = "tela.html";
        } else {
            // Caso o status não seja 'ok' (ex: 401 ou 403)
            alert("Email ou senha inválidos!");
        }
  
}