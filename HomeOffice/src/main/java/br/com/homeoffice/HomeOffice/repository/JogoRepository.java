package br.com.homeoffice.HomeOffice.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import br.com.homeoffice.HomeOffice.entity.JogoEntity;

@Repository
public interface JogoRepository extends JpaRepository<JogoEntity, Integer> {

}
