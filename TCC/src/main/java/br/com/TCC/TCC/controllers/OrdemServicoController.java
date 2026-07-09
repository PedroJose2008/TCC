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

import br.com.TCC.TCC.entity.OrdemServicoEntity;
import br.com.TCC.TCC.entity.PecaEntity;
import br.com.TCC.TCC.repository.OrdemServicoRepository;
import br.com.TCC.TCC.repository.PecaRepository;

@RestController
@RequestMapping("/ordens")
@CrossOrigin("*")
public class OrdemServicoController {

	@Autowired
	private OrdemServicoRepository ordemRepository;

	@Autowired
	private PecaRepository pecaRepository;

	// listar todos 
	@GetMapping("/listartodos")
	@ResponseStatus(HttpStatus.OK)
	public List<OrdemServicoEntity> listar(){
		return ordemRepository.findAll();
	}
	
	// listar por ID
	@GetMapping("/listarporid/{id}")
	@ResponseStatus(value = HttpStatus.OK)
	public Optional<OrdemServicoEntity> lisarPorId(@PathVariable Integer id){	
		return ordemRepository.findById(id);
	}
	
	// salvando por json
	@PostMapping("/salvar")
	@ResponseStatus(value = HttpStatus.CREATED)
	public OrdemServicoEntity salvar(@RequestBody OrdemServicoEntity ordem) {
		ordem.setStatus("ABERTA");
		return ordemRepository.save(ordem);
	}
	
	
	// deletando por id
	@DeleteMapping("/deletar/{id}")
	@ResponseStatus(value = HttpStatus.NO_CONTENT)
	public void deletar(@PathVariable Integer id) {
		if(ordemRepository.existsById(id)) {
			ordemRepository.deleteById(id);
			System.out.println("deletado com sucesso");
		} else {
			System.out.println("não encontrado");
		}
	}
	
	@PutMapping("/atualizar/{id}")
	@ResponseStatus(value = HttpStatus.OK)
	public OrdemServicoEntity atualizar(@PathVariable Integer id, @RequestBody OrdemServicoEntity ordemAtualizada) {
	    // 1. Busca a ordem original do banco pelo ID
	    OrdemServicoEntity ordemOriginal = ordemRepository.findById(id).get();
	    
	    // 2. Se o JS mandar status, atualiza. Se não, mantém o que estava.
	    if (ordemAtualizada.getStatus() != null) {
	        ordemOriginal.setStatus(ordemAtualizada.getStatus());
	    }
	    
	    // 3. ATUALIZAÇÃO SEGURA DE BIGDECIMAL
	    if (ordemAtualizada.getValor() != null) {
	        ordemOriginal.setValor(ordemAtualizada.getValor());
	    }
	    
	    // 4. Se o JS mandar descrição, atualiza. Se não, mantém o que estava.
	    if (ordemAtualizada.getDescricao() != null) {
	        ordemOriginal.setDescricao(ordemAtualizada.getDescricao());
	    }
	    
	    // 5. NOVA ATUALIZAÇÃO: Se o JS mandar a data de finalização, salva no banco!
	    if (ordemAtualizada.getDataFinalizacao() != null) {
	        ordemOriginal.setDataFinalizacao(ordemAtualizada.getDataFinalizacao());
	    }
	    
	    // 6. Salva todos os dados atualizados com segurança
	    return ordemRepository.save(ordemOriginal);
	}
	
	//rotas pro modal
	
	@GetMapping("/listarpecas/{idOS}")
	@ResponseStatus(HttpStatus.OK)
	public List<PecaEntity> listarPecasDaOS(@PathVariable Integer idOS) {
		OrdemServicoEntity os = ordemRepository.findById(idOS).get();
		return os.getPecas();
	}

	@PostMapping("/vincularpeca/{idOS}/{idPeca}")
	@ResponseStatus(HttpStatus.OK)
	public void vincularPeca(@PathVariable Integer idOS, @PathVariable Integer idPeca) {
		OrdemServicoEntity os = ordemRepository.findById(idOS).get();
		PecaEntity peca = pecaRepository.findById(idPeca).get();
		os.getPecas().add(peca);
		ordemRepository.save(os);
	}

	@DeleteMapping("/desvincularpeca/{idOS}/{idPeca}")
	@ResponseStatus(HttpStatus.NO_CONTENT)
	public void desvincularPeca(@PathVariable Integer idOS, @PathVariable Integer idPeca) {
		OrdemServicoEntity os = ordemRepository.findById(idOS).get();
		PecaEntity peca = pecaRepository.findById(idPeca).get();
		os.getPecas().remove(peca);
		ordemRepository.save(os);
	}
}