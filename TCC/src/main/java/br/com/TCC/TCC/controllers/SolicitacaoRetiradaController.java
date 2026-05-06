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

import br.com.TCC.TCC.entity.SolicitacaoRetiradaEntity;
import br.com.TCC.TCC.repository.SolicitacaoRetiradaRepository;

@RestController
@RequestMapping("/solicitacaoRetirada")
@CrossOrigin("*")

public class SolicitacaoRetiradaController {

	@Autowired
	private SolicitacaoRetiradaRepository solicitacaoRetiradaRepository;
	
	
	// listar todods 
	@GetMapping("/listartodos")
	@ResponseStatus(value = HttpStatus.OK)

	public List<SolicitacaoRetiradaEntity> listar(){
		
		return solicitacaoRetiradaRepository.findAll();
		
	}// fim do listar todos
	
	//listar por ID
	@GetMapping("/listarporid/{id}")
	@ResponseStatus(value = HttpStatus.OK)
	
	public Optional<SolicitacaoRetiradaEntity> lisarPorId(@PathVariable Integer id){
		
		return solicitacaoRetiradaRepository.findById(id);
		
	}// fim do listar por ID
	
	//salndo por json
	@PostMapping("/salvar")
	@ResponseStatus(value = HttpStatus.CREATED)
	
	public SolicitacaoRetiradaEntity salvar(@RequestBody SolicitacaoRetiradaEntity solicitacaoretirada) {
		
		return solicitacaoRetiradaRepository.save(solicitacaoretirada);
	}//fim do salvar
	
	// deletando por id
	@DeleteMapping("/deletar/{id}")
	@ResponseStatus(value = HttpStatus.NO_CONTENT)

	public void  deletar(@PathVariable Integer id) {
		
		if(solicitacaoRetiradaRepository.existsById(id)) {
			
			solicitacaoRetiradaRepository.deleteById(id);
			System.out.println("deletado com sucesso");
			
		}
		
		System.out.println("não encontrado");
		
	}//fim do deletar
	
	
	//atualizando por ID
	@PutMapping("/atualizar/{id}")
	@ResponseStatus(value = HttpStatus.OK)

public ResponseEntity<SolicitacaoRetiradaEntity> atualizar(@RequestBody SolicitacaoRetiradaEntity solicitacaoretirada,@PathVariable Integer id) {
		
		
		if(solicitacaoRetiradaRepository.existsById(id)) {
			
			solicitacaoretirada.setId(id);
	
			SolicitacaoRetiradaEntity solicitacaoRetiradaAtualizado= solicitacaoRetiradaRepository.save(solicitacaoretirada);
	return ResponseEntity.ok(solicitacaoRetiradaAtualizado);
	
	
		}
		
		return ResponseEntity.notFound().build();

		
	}//fim do atualizar
	
	
	
}
