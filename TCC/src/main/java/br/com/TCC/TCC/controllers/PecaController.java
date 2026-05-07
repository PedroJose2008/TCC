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

import br.com.TCC.TCC.entity.PecaEntity;
import br.com.TCC.TCC.repository.PecaRepository;


@RestController
@RequestMapping("/pecas")
@CrossOrigin("*")
public class PecaController {

	
	@Autowired
	private PecaRepository PecaRepository;

	// listar todods 
	@GetMapping("/listartodos")
	@ResponseStatus(HttpStatus.OK)
	public List<PecaEntity> listar(){
		
		return PecaRepository.findAll();
		
	}// fim do listar todos
	
	//listar por ID
	@GetMapping("/listarporid/{id}")
	@ResponseStatus(value = HttpStatus.OK)
	public Optional<PecaEntity> lisarPorId(@PathVariable Integer id){	

		return PecaRepository.findById(id);

	}// fim do listar por ID
	
	//salvando por json
	@PostMapping("/salvar")
	@ResponseStatus(value = HttpStatus.CREATED)
	public PecaEntity salvar(@RequestBody PecaEntity peca) {

		return PecaRepository.save(peca);

	}//fim do salvar
	
	// deletando por id

	@DeleteMapping("/deletar/{id}")
	@ResponseStatus(value = HttpStatus.NO_CONTENT)
	public void  deletar(@PathVariable Integer id) {
		if(PecaRepository.existsById(id)) {
			PecaRepository.deleteById(id);

			System.out.println("deletado com sucesso");
	}

			System.out.println("não encontrado");
	}//fim do deletar
	
	
	//atualizando por ID
	@PutMapping("/atualizar/{id}")
	public ResponseEntity<PecaEntity> atualizar(@RequestBody PecaEntity peca, @PathVariable Integer id) {

	    // 1. Verifica se o usuário realmente existe no banco
	    if (PecaRepository.existsById(id)) {
	        // 2. Garante que o ID do objeto seja o mesmo da URL
	    	peca.setId(id);
	        
	    	PecaEntity PecaAtualizado = PecaRepository.save(peca);
	        return ResponseEntity.ok(PecaAtualizado);
	        
	    } 
	    
	    return ResponseEntity.notFound().build();

	} //fim do atualizar
	
	
}
