package br.com.TCC.TCC.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import br.com.TCC.TCC.entity.SolicitacaoRetiradaEntity;

@Repository
public interface SolicitacaoRetiradaRepository extends JpaRepository<SolicitacaoRetiradaEntity, Integer> {

}
