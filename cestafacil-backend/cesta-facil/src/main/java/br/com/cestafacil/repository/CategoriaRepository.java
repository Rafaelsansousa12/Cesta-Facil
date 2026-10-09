package br.com.cestafacil.repository;

import br.com.cestafacil.model.entity.Categoria;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface CategoriaRepository extends JpaRepository<Categoria, Long> {
    List<Categoria> findByAtivoTrue();
}
