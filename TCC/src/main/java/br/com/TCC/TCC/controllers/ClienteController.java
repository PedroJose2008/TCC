package br.com.TCC.TCC.controllers;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import br.com.TCC.TCC.entity.ClienteEntity;
import br.com.TCC.TCC.repository.ClienteRepository;

@RestController
@RequestMapping("/clientes")
@CrossOrigin("*")
public class ClienteController {

	@Autowired
	private ClienteRepository clienteRepository;
	
	
	// listar todods 
	@GetMapping("/listartodos")
	@ResponseStatus(value = HttpStatus.OK)
	
	public List<ClienteEntity> listar(){
		
		return clienteRepository.findAll();
		
		
	}
	
	@GetMapping("/buscarPorNome/{razaoSocial}")
	public List<ClienteEntity> buscarPorNome(@PathVariable String razaoSocial) {
	    return clienteRepository.findByrazaoSocialContaining(razaoSocial);
	}
	// fim do listar todos
	
	//listar por ID
	@GetMapping("/listarporid/{id}")
	@ResponseStatus(value = HttpStatus.CREATED)
	
	public Optional<ClienteEntity> lisarPorId(@PathVariable Integer id){
		
		return clienteRepository.findById(id);
		
	}// fim do listar por ID
	
	//salndo por json
	@PostMapping("/salvar")
	@ResponseStatus(value = HttpStatus.OK)
	public ClienteEntity salvar(@RequestBody ClienteEntity cliente) {
		
		Optional<ClienteEntity>emailExiste=clienteRepository.findByEmail(cliente.getEmail());
		Optional<ClienteEntity>telefoneExiste=clienteRepository.findByTelefone(cliente.getTelefone());
		Optional<ClienteEntity>cpfExiste=clienteRepository.findByCpfCnpj(cliente.getCpfCnpj());

		
		if (emailExiste.isPresent()) {
			return null;
		}
		
		else if(telefoneExiste.isPresent()) {
			return null;
		}
		
		else if(cpfExiste.isPresent()) {
			return null;
		}
		
		
		return clienteRepository.save(cliente);
	}//fim do salvar
	
	
	
	
	
	
	// deletando por id
	@DeleteMapping("/deletar/{id}")
	@ResponseStatus(value = HttpStatus.NO_CONTENT)

	public void  deletar(@PathVariable Integer id) {
		
		if(clienteRepository.existsById(id)) {
			
			clienteRepository.deleteById(id);
			System.out.println("deletado com sucesso");
			
		}
		
		System.out.println("não encontrado");
		
	}//fim do deletar
	
	
	//atualizando por ID
	@PutMapping("/atualizar/{id}")
	@ResponseStatus(value = HttpStatus.OK)
	
	public ResponseEntity<ClienteEntity> atualizar(@RequestBody ClienteEntity cliente,@PathVariable Integer id) {
		
		
		if(clienteRepository.existsById(id)) {
			
	cliente.setId(id);
	
	ClienteEntity clienteAtualizado= clienteRepository.save(cliente);
	return ResponseEntity.ok(clienteAtualizado);
	
	
		}
		
		return ResponseEntity.notFound().build();

		
	}//fim do atualizar
	
	
	
	// começo do validar cpf
	@GetMapping("/validaCpf/{cpf}")
	@ResponseStatus(value = HttpStatus.OK)
	public ResponseEntity<Boolean> cpfValido(@PathVariable String cpf){
		
		Optional<ClienteEntity> cpfExiste= clienteRepository.findByCpfCnpj(cpf);
		
		if(cpfExiste.isPresent()) {
			return ResponseEntity.ok(true);
		}
		
			return ResponseEntity.ok(false);
 
	}// fim do verificar CPF
	
	@GetMapping("/validaEmail/{email}")
	@ResponseStatus(value = HttpStatus.OK)

	public ResponseEntity<Boolean> emailValido(@PathVariable String email){
		
		Optional<ClienteEntity> emailExiste=clienteRepository.findByEmail(email);
		
		if (emailExiste.isPresent()) {
			return ResponseEntity.ok(true);
		}
		
		return ResponseEntity.ok(false);
		
	}// fim do verificar email
	
	
	@GetMapping("/validaTelefone/{telefone}")
	@ResponseStatus(value = HttpStatus.OK)

	public ResponseEntity<Boolean> telefoneValido(@PathVariable String telefone ){
		
		Optional<ClienteEntity> telefoneExiste=clienteRepository.findByTelefone(telefone);
		
		if (telefoneExiste.isPresent()) {
			return ResponseEntity.ok(true);
		}
		return ResponseEntity.ok(false);
	}//fim do verificar telefone
	
	
}// fim do programa
