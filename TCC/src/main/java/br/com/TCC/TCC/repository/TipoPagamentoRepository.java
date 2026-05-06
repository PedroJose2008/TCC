package br.com.TCC.TCC.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import br.com.TCC.TCC.entity.TipoPagamentoEntity;

@Repository
public interface TipoPagamentoRepository extends JpaRepository<TipoPagamentoEntity, Integer> {

}
