package br.com.TCC.TCC.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import br.com.TCC.TCC.entity.PecaEntity;

public interface PecaRepository extends JpaRepository<PecaEntity, Integer>{

	List<PecaEntity> findByNomeContaining(String nome);
}
