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

import br.com.TCC.TCC.entity.TipoPagamentoEntity;
import br.com.TCC.TCC.repository.TipoPagamentoRepository;

@RestController
@RequestMapping("/tipoPagamento")
@CrossOrigin("*")
public class TipoPagamentoController {

	@Autowired
	private TipoPagamentoRepository tipoPagamentoRepository;
	
	
	// listar todods 
	@GetMapping("/listartodos")
	@ResponseStatus(value = HttpStatus.OK)

	public List<TipoPagamentoEntity> listar(){
		
		return tipoPagamentoRepository.findAll();
		
	}// fim do listar todos
	
	//listar por ID
	@GetMapping("/listarporid/{id}")
	@ResponseStatus(value = HttpStatus.OK)
	
	public Optional<TipoPagamentoEntity> lisarPorId(@PathVariable Integer id){
		
		return tipoPagamentoRepository.findById(id);
		
	}// fim do listar por ID
	
	//salndo por json
	@PostMapping("/salvar")
	@ResponseStatus(value = HttpStatus.CREATED)
	
	public TipoPagamentoEntity salvar(@RequestBody TipoPagamentoEntity tipopagamento) {
		
		return tipoPagamentoRepository.save(tipopagamento);
	}//fim do salvar
	
	// deletando por id
	@DeleteMapping("/deletar/{id}")
	@ResponseStatus(value = HttpStatus.NO_CONTENT)
	
	public void  deletar(@PathVariable Integer id) {
		
		if(tipoPagamentoRepository.existsById(id)) {
			
			tipoPagamentoRepository.deleteById(id);
			System.out.println("deletado com sucesso");
			
		}
		
		System.out.println("não encontrado");
		
	}//fim do deletar
	
	
	//atualizando por ID
	@PutMapping("/atualizar/{id}")
	@ResponseStatus(value = HttpStatus.OK)
	
public ResponseEntity<TipoPagamentoEntity> atualizar(@RequestBody TipoPagamentoEntity tipoPagamento,@PathVariable Integer id) {
		
		
		if(tipoPagamentoRepository.existsById(id)) {
			
			tipoPagamento.setId(id);
	
			TipoPagamentoEntity TipoPagamentoAtualizado= tipoPagamentoRepository.save(tipoPagamento);
	return ResponseEntity.ok(TipoPagamentoAtualizado);
	
	
		}
		
		return ResponseEntity.notFound().build();

		
	}//fim do atualizar
	
	
	
}
