package br.com.TCC.TCC.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import br.com.TCC.TCC.entity.ReposicaoEntity;



@Repository
public interface ReposicaoRepository extends JpaRepository<ReposicaoEntity, Integer> {

}
