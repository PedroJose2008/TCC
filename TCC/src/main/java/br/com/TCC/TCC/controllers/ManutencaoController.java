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

import br.com.TCC.TCC.entity.ManutencaoEntity;
import br.com.TCC.TCC.repository.ManutencaoRepository;

@RestController
@RequestMapping("/manutencao")
@CrossOrigin("*")
public class ManutencaoController {

	
	@Autowired
	private ManutencaoRepository manutencaoRepository;
	
	
	// listar todods 
	@GetMapping("/listartodos")
	@ResponseStatus(value = HttpStatus.OK)

	public List<ManutencaoEntity> listar(){
		
		return manutencaoRepository.findAll();
		
	}// fim do listar todos
	
	//listar por ID
	@GetMapping("/listarporid/{id}")
	@ResponseStatus(value = HttpStatus.OK)
	
	public Optional<ManutencaoEntity> lisarPorId(@PathVariable Integer id){
		
		return manutencaoRepository.findById(id);
		
	}// fim do listar por ID
	
	//salndo por json
	@PostMapping("/salvar")
	@ResponseStatus(value = HttpStatus.CREATED)

	public ManutencaoEntity salvar(@RequestBody ManutencaoEntity manutencao) {
		
		return manutencaoRepository.save(manutencao);
	}//fim do salvar
	
	// deletando por id
	@DeleteMapping("/deletar/{id}")
	@ResponseStatus(value = HttpStatus.NO_CONTENT)

	public void  deletar(@PathVariable Integer id) {
		
		if(manutencaoRepository.existsById(id)) {
			
			manutencaoRepository.deleteById(id);
			System.out.println("deletado com sucesso");
			
		}
		
		System.out.println("não encontrado");
		
	}//fim do deletar
	
	
	//atualizando por ID
	@PutMapping("/atualizar/{id}")
	@ResponseStatus(value = HttpStatus.OK)
	
public ResponseEntity<ManutencaoEntity> atualizar(@RequestBody ManutencaoEntity manutencao,@PathVariable Integer id) {
		
		
		if(manutencaoRepository.existsById(id)) {
			
			manutencao.setId(id);
	
			ManutencaoEntity ManutencaoAtualizado= manutencaoRepository.save(manutencao);
	return ResponseEntity.ok(ManutencaoAtualizado);
	
	
		}
		
		return ResponseEntity.notFound().build();

		
	}//fim do atualizar
	
	
	
	
	
	
	
}
