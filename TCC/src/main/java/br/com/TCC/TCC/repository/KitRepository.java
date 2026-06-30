package br.com.TCC.TCC.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import br.com.TCC.TCC.entity.KitEntity;

public interface KitRepository extends JpaRepository<KitEntity, Integer>{

	List<KitEntity> findByNomeContainingIgnoreCase(String nome);

}
