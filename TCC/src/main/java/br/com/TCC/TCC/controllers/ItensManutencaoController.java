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

import br.com.TCC.TCC.entity.ItensManutencaoEntity;
import br.com.TCC.TCC.repository.ItensManutencaoRepository;

@RestController
@RequestMapping("/itensManutencao")
@CrossOrigin("*")
public class ItensManutencaoController {

	
	@Autowired
	private ItensManutencaoRepository itensManutencaoRepository;
	
	
	// listar todods 
	@GetMapping("/listartodos")
	@ResponseStatus(value = HttpStatus.OK)
	
	public List<ItensManutencaoEntity> listar(){
		
		return itensManutencaoRepository.findAll();
		
	}// fim do listar todos
	
	//listar por ID
	@GetMapping("/listarporid/{id}")
	@ResponseStatus(value = HttpStatus.OK)

	public Optional<ItensManutencaoEntity> lisarPorId(@PathVariable Integer id){
		
		return itensManutencaoRepository.findById(id);
		
	}// fim do listar por ID
	
	//salndo por json
	@PostMapping("/salvar")
	@ResponseStatus(value = HttpStatus.CREATED)
	
	public ItensManutencaoEntity salvar(@RequestBody ItensManutencaoEntity itensmanutencao) {
		
		return itensManutencaoRepository.save(itensmanutencao);
	}//fim do salvar
	
	// deletando por id
	@DeleteMapping("/deletar/{id}")
	@ResponseStatus(value = HttpStatus.NO_CONTENT)

	public void  deletar(@PathVariable Integer id) {
		
		if(itensManutencaoRepository.existsById(id)) {
			
			itensManutencaoRepository.deleteById(id);
			System.out.println("deletado com sucesso");
			
		}
		
		System.out.println("não encontrado");
		
	}//fim do deletar
	
	
	//atualizando por ID
	@PutMapping("/atualizar/{id}")
	@ResponseStatus(value = HttpStatus.OK)

public ResponseEntity<ItensManutencaoEntity> atualizar(@RequestBody ItensManutencaoEntity ItensManutencao,@PathVariable Integer id) {
		
		
		if(itensManutencaoRepository.existsById(id)) {
			
			ItensManutencao.setId(id);
	
	ItensManutencaoEntity ItensManutencaoAtualizado= itensManutencaoRepository.save(ItensManutencao);
	return ResponseEntity.ok(ItensManutencaoAtualizado);
	
	
		}
		
		return ResponseEntity.notFound().build();

		
	}//fim do atualizar
	
	
	
	
	
	
	
}
