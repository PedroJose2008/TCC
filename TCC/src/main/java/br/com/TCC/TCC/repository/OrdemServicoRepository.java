package br.com.TCC.TCC.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import br.com.TCC.TCC.entity.OrdemServicoEntity;
@Repository
public interface OrdemServicoRepository extends JpaRepository<OrdemServicoEntity, Integer> {

	
	
}
