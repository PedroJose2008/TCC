const API_LOGIN_USUARIOS="http://localhost:8001/usuarios/login";

async function login(){
	
	// 1 pego os valores dos inputs 
	const emailInput=document.getElementById("email");
	const senhaInput=document.getElementById("senha");
	
	let  api=API_LOGIN_USUARIOS ;// vou fazer com que as api recebam esse const
	let dado={
		email:emailInput.value.trim(),
		senha:senhaInput.value.trim()
	}
	

	
	const response = await fetch (api,{
		
		method: "POST",
		headers:{
			"Content-Type": "application/json"
						                },
			  body: JSON.stringify(dado)
	});
	
	if(response.ok){
		const usuarioLogin= await response.json();//converte em json
		console.log(usuarioLogin);
		localStorage.setItem(
			
					"usuarioLogin",
					JSON.stringify(usuarioLogin)
		);// estou setando para armazenar o usuarioLogin
		alert("Login realizado com sucesso");
		redirecionarDashboard();
		
	}
	
	
	
	else{
		alert("Email ou senha inválidos");
	}
	
		
	
	
		}
	
function redirecionarDashboard(){
	console.log("redirecionando para o dashboard")
	window.location.href="dashboard.html";
}
