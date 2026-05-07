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


import br.com.TCC.TCC.entity.KitEntity;
import br.com.TCC.TCC.repository.KitRepository;

@RestController
@RequestMapping("/kits")
@CrossOrigin("*")
public class KitController {

	@Autowired
	private KitRepository KitRepository;

	// listar todods 
	@GetMapping("/listartodos")
	@ResponseStatus(HttpStatus.OK)
	public List<KitEntity> listar(){
		
		return KitRepository.findAll();
		
	}// fim do listar todos
	
	//listar por ID
	@GetMapping("/listarporid/{id}")
	@ResponseStatus(value = HttpStatus.OK)
	public Optional<KitEntity> lisarPorId(@PathVariable Integer id){	

		return KitRepository.findById(id);

	}// fim do listar por ID
	
	//salvando por json
	@PostMapping("/salvar")
	@ResponseStatus(value = HttpStatus.CREATED)
	public KitEntity salvar(@RequestBody KitEntity kit) {

		return KitRepository.save(kit);

	}//fim do salvar
	
	// deletando por id

	@DeleteMapping("/deletar/{id}")
	@ResponseStatus(value = HttpStatus.NO_CONTENT)
	public void  deletar(@PathVariable Integer id) {
		if(KitRepository.existsById(id)) {
			KitRepository.deleteById(id);

			System.out.println("deletado com sucesso");
	}

			System.out.println("não encontrado");
	}//fim do deletar
	
	
	
	@PutMapping("/atualizar/{id}")
	public ResponseEntity<KitEntity> atualizar(@RequestBody KitEntity kit, @PathVariable Integer id) {

	    // 1. Verifica se o usuário realmente existe no banco
	    if (KitRepository.existsById(id)) {
	        // 2. Garante que o ID do objeto seja o mesmo da URL
	    	kit.setId(id);
	        
	    	KitEntity kitAtualizado = KitRepository.save(kit);
	        return ResponseEntity.ok(kitAtualizado);
	        
	    } 
	    
	    return ResponseEntity.notFound().build();

	} //fim do atualizar
	
	
	
	
}
