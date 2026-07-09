package br.com.TCC.TCC.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import br.com.TCC.TCC.entity.FornecedorEntity;


public interface FornecedorRepository extends JpaRepository<FornecedorEntity, Integer>{

	List<FornecedorEntity> findByrazaoSocialContaining(String razaoSocial);
	
	Optional<FornecedorEntity> findByCnpj (String cnpj);
	
	Optional<FornecedorEntity> findByTelefone(String telefone);
	
	Optional<FornecedorEntity> findByEmail(String email);
	
}
