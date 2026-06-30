package br.com.TCC.TCC.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import br.com.TCC.TCC.entity.ClienteEntity;



@Repository
public interface ClienteRepository extends JpaRepository<ClienteEntity, Integer> {

	List<ClienteEntity> findByrazaoSocialContaining(String razaoSocial);
}
