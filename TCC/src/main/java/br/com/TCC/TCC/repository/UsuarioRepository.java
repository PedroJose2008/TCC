package br.com.TCC.TCC.repository;



import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import br.com.TCC.TCC.entity.UsuarioEntity;

@Repository
public interface UsuarioRepository extends JpaRepository<UsuarioEntity, Integer> {

	
	Optional<UsuarioEntity> findByCpf (String cpf);
	
	Optional<UsuarioEntity>findByTelefone(String telefone);
	
	Optional<UsuarioEntity> findByEmail(String email);
	
	
}
