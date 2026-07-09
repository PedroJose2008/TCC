package br.com.TCC.TCC.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import br.com.TCC.TCC.entity.ClienteEntity;



@Repository
public interface ClienteRepository extends JpaRepository<ClienteEntity, Integer> {

	List<ClienteEntity> findByrazaoSocialContaining(String razaoSocial);
	
	Optional<ClienteEntity> findByCpfCnpj(String cpfCnpj);
	
	Optional<ClienteEntity> findByTelefone(String telefone);
	
	Optional<ClienteEntity> findByEmail(String email);
	
}
