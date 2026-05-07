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

import br.com.TCC.TCC.entity.FornecedorEntity;
import br.com.TCC.TCC.repository.FornecedorRepository;

@RestController
@RequestMapping("/fornecedores")
@CrossOrigin("*")
public class FornecedorController {

	@Autowired
	private FornecedorRepository FornecedorRepository;

	// listar todods 
	@GetMapping("/listartodos")
	@ResponseStatus(HttpStatus.OK)
	public List<FornecedorEntity> listar(){
		
		return FornecedorRepository.findAll();
		
	}// fim do listar todos
	
	//listar por ID
	@GetMapping("/listarporid/{id}")
	@ResponseStatus(value = HttpStatus.OK)
	public Optional<FornecedorEntity> lisarPorId(@PathVariable Integer id){	

		return FornecedorRepository.findById(id);

	}// fim do listar por ID
	
	//salvando por json
	@PostMapping("/salvar")
	@ResponseStatus(value = HttpStatus.CREATED)
	public FornecedorEntity salvar(@RequestBody FornecedorEntity fornecedor) {

		return FornecedorRepository.save(fornecedor);

	}//fim do salvar
	
	// deletando por id

	@DeleteMapping("/deletar/{id}")
	@ResponseStatus(value = HttpStatus.NO_CONTENT)
	public void  deletar(@PathVariable Integer id) {
		if(FornecedorRepository.existsById(id)) {
			FornecedorRepository.deleteById(id);

			System.out.println("deletado com sucesso");
	}

			System.out.println("não encontrado");
	}//fim do deletar
	
	
	
	
	
	@PutMapping("/atualizar/{id}")
	public ResponseEntity<FornecedorEntity> atualizar(@RequestBody FornecedorEntity fornecedor, @PathVariable Integer id) {

	    // 1. Verifica se o usuário realmente existe no banco
	    if (FornecedorRepository.existsById(id)) {
	        // 2. Garante que o ID do objeto seja o mesmo da URL
	    	fornecedor.setId(id);
	        
	    	FornecedorEntity FornecedorAtualizado = FornecedorRepository.save(fornecedor);
	        return ResponseEntity.ok(FornecedorAtualizado);
	        
	    } 
	    
	    return ResponseEntity.notFound().build();

	} //fim do atualizar
	
	
	
	
}
