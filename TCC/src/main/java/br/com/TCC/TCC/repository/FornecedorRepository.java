package br.com.TCC.TCC.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import br.com.TCC.TCC.entity.FornecedorEntity;


public interface FornecedorRepository extends JpaRepository<FornecedorEntity, Integer>{

	List<FornecedorEntity> findByrazaoSocialContaining(String razaoSocial);
	
}
