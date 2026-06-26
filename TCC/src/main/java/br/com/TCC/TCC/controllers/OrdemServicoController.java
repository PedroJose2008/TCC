package br.com.TCC.TCC.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import br.com.TCC.TCC.repository.OrdemServicoRepository;

@RestController
@RequestMapping("/ordemServico")
@CrossOrigin("*")
public class OrdemServicoController {

	@Autowired
	private OrdemServicoRepository  ordemServicoRepository; 
	
}
