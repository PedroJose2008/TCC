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

import br.com.TCC.TCC.entity.KitPecaEntity;
import br.com.TCC.TCC.repository.KitpecaRepository;

@RestController
@RequestMapping("/kitPecas")
@CrossOrigin("*")
public class KitPecaController {

	@Autowired
	private KitpecaRepository KitpecaRepository;

	// listar todods 
	@GetMapping("/listartodos")
	@ResponseStatus(HttpStatus.OK)
	public List<KitPecaEntity> listar(){
		
		return KitpecaRepository.findAll();
		
	}// fim do listar todos
	
	//listar por ID
	@GetMapping("/listarporid/{id}")
	@ResponseStatus(value = HttpStatus.OK)
	public Optional<KitPecaEntity> lisarPorId(@PathVariable Integer id){	

		return KitpecaRepository.findById(id);

	}// fim do listar por ID
	
	//salvando por json
	@PostMapping("/salvar")
	@ResponseStatus(value = HttpStatus.CREATED)
	public KitPecaEntity salvar(@RequestBody KitPecaEntity kitpeca) {

		return KitpecaRepository.save(kitpeca);

	}//fim do salvar
	
	// deletando por id

	@DeleteMapping("/deletar/{id}")
	@ResponseStatus(value = HttpStatus.NO_CONTENT)
	public void  deletar(@PathVariable Integer id) {
		if(KitpecaRepository.existsById(id)) {
			KitpecaRepository.deleteById(id);

			System.out.println("deletado com sucesso");
	}

			System.out.println("não encontrado");
	}//fim do deletar
	
	
	
	@PutMapping("/atualizar/{id}")
	public ResponseEntity<KitPecaEntity> atualizar(@RequestBody KitPecaEntity kitPeca, @PathVariable Integer id) {

	    // 1. Verifica se o usuário realmente existe no banco
	    if (KitpecaRepository.existsById(id)) {
	        // 2. Garante que o ID do objeto seja o mesmo da URL
	    	kitPeca.setId(id);
	        
	    	KitPecaEntity kitPecaAtualizado = KitpecaRepository.save(kitPeca);
	        return ResponseEntity.ok(kitPecaAtualizado);
	        
	    } 
	    
	    return ResponseEntity.notFound().build();

	} //fim do atualizar
	
}
