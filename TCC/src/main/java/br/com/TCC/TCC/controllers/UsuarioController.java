package br.com.TCC.TCC.controllers;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import br.com.TCC.TCC.entity.UsuarioEntity;
import br.com.TCC.TCC.repository.UsuarioRepository;


@RestController
@RequestMapping("/usuarios")
@CrossOrigin("*")
public class UsuarioController {

	
	@Autowired
	private UsuarioRepository usuarioRepository;
	@Autowired
	private BCryptPasswordEncoder encoder;
	private BCryptPasswordEncoder passwordEncoder;
	
	
	// listar todods 
	@GetMapping("/listartodos")
	@ResponseStatus(value = HttpStatus.OK)

	public List<UsuarioEntity> listar(){
		
		return usuarioRepository.findAll();
		
	}// fim do listar todos
	
	//listar por ID
	@GetMapping("/listarporid/{id}")
	@ResponseStatus(value = HttpStatus.OK)
	
	public Optional<UsuarioEntity> lisarPorId(@PathVariable Integer id){
		
		return usuarioRepository.findById(id);
		
	}// fim do listar por ID
	
	//salndo por json
	@PostMapping("/salvar")
	@ResponseStatus(value = HttpStatus.CREATED)
	
	public UsuarioEntity salvar(@RequestBody UsuarioEntity usuario) {
		
		Optional<UsuarioEntity>emailExiste=usuarioRepository.findByEmail(usuario.getEmail());
		Optional<UsuarioEntity>telefoneExiste=usuarioRepository.findByTelefone(usuario.getTelefone());
		Optional<UsuarioEntity>cpfExiste=usuarioRepository.findByCpf(usuario.getCpf());

		
		if (emailExiste.isPresent()) {
			return null;
		}
		
		else if(telefoneExiste.isPresent()) {
			return null;
		}
		
		else if(cpfExiste.isPresent()) {
			return null;
		}
		
		usuario.setSenha(encoder.encode(usuario.getSenha()));
		return usuarioRepository.save(usuario);
	}//fim do salvar
	
	
	@GetMapping("/cpf")
	public ResponseEntity<Boolean> CpfValido(@RequestParam("cpf") String cpf){
		
		Optional<UsuarioEntity> cpfExiste= usuarioRepository.findByCpf(cpf);
		
		if(cpfExiste.isPresent()) {
			return ResponseEntity.ok(true);
		}
		
			return ResponseEntity.ok(false);
 
	}// fim do verificar CPF
	
	
	@GetMapping("/email")
	
	
	// deletando por id
	@DeleteMapping("/deletar/{id}")
	@ResponseStatus(value = HttpStatus.NO_CONTENT)
	
	public void  deletar(@PathVariable Integer id) {
		
		if(usuarioRepository.existsById(id)) {
			
			usuarioRepository.deleteById(id);
			System.out.println("deletado com sucesso");
			
		}
		
		System.out.println("não encontrado");
		
	}//fim do deletar
	
	
	//atualizando por ID
	@PutMapping("/atualizar/{id}")
	@ResponseStatus(value = HttpStatus.OK)
	
public ResponseEntity<UsuarioEntity> atualizar(@RequestBody UsuarioEntity usuario,@PathVariable Integer id) {
		
		
		if(usuarioRepository.existsById(id)) {
			
			usuario.setId(id);
	
			UsuarioEntity usuarioAtualizado= usuarioRepository.save(usuario);
	return ResponseEntity.ok(usuarioAtualizado);
	
	
		}
		
		return ResponseEntity.notFound().build();

		
	}//fim do atualizar
	
	
	@PostMapping("/login")
	public ResponseEntity<UsuarioEntity> login(
	        @RequestBody UsuarioEntity usuarioLogin) {
	    
	    // busca usuário por cpf
	    Optional<UsuarioEntity> usuario = 
	            usuarioRepository.findByEmail(usuarioLogin.getEmail());
	            
	    // se encontrou usuário, verifica senha
	    if (usuario.isPresent()) {
	        
	        UsuarioEntity usuarioEncontrado = usuario.get();
	        
	        
			// compara senha enviada com senha armazenada (hash)
	        if (passwordEncoder.matches(
	                usuarioLogin.getSenha(),
	                usuarioEncontrado.getSenha())) {
	            
	            return ResponseEntity.ok(usuarioEncontrado);
	        }
	    }
	    
	    // se não encontrou usuário ou senha não bate, retorna 401
	    return ResponseEntity.status(401).build();
	}
	
	
	
	
	
	
}
