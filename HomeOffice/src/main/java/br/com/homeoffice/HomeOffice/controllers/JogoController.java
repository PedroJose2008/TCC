package br.com.homeoffice.HomeOffice.controllers;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
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

import br.com.homeoffice.HomeOffice.entity.JogoEntity;
import br.com.homeoffice.HomeOffice.repository.JogoRepository;

@RestController
@RequestMapping("/jogo")
@CrossOrigin("*")
public class JogoController {

	
	@Autowired
	private JogoRepository jogoRepository;

@GetMapping("/listar")
@ResponseStatus(value = HttpStatus.OK)

public List<JogoEntity> listar (){
	
	return jogoRepository.findAll();
}

@GetMapping("/listaId/{id}")
@ResponseStatus(value = HttpStatus.OK)

public Optional<JogoEntity> listarPorId(@PathVariable Integer id){
	
	
	return jogoRepository.findById(id);
	
}

@PostMapping("/salvar")
@ResponseStatus(value = HttpStatus.CREATED)

public JogoEntity salvar(@RequestBody JogoEntity jogo) {
	
	
	
	return jogoRepository.save(jogo);
	
}

@DeleteMapping("/deletar/{id}")
@ResponseStatus(value = HttpStatus.NO_CONTENT)
@CrossOrigin("*")
public void deletar(@PathVariable Integer id) {

	jogoRepository.deleteById(id);
	
}

@PutMapping("/atualizar/{id}")
@ResponseStatus(value = HttpStatus.OK)
public JogoEntity atualizar(@PathVariable Integer id, @RequestBody JogoEntity jogos) { // Correção: de 'int' para 'Integer' e correção ortográfica de 'ataulizar'
    jogos.setId(id);
    return jogoRepository.save(jogos);
}


	
	
	
	
	
	
	
	
	
}
