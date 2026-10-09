package br.com.cestafacil.repository;

import br.com.cestafacil.model.entity.Produto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ProdutoRepository extends JpaRepository<Produto, Long> {

    Page<Produto> findByAtivoTrue(Pageable pageable);

    Page<Produto> findByAtivoTrueAndCategoria_Id(Long categoriaId, Pageable pageable);

    @Query("SELECT p FROM Produto p WHERE p.ativo = true AND " +
           "(LOWER(p.nome) LIKE LOWER(CONCAT('%', :termo, '%')) OR " +
           " LOWER(p.descricao) LIKE LOWER(CONCAT('%', :termo, '%')))")
    Page<Produto> buscarPorTermo(@Param("termo") String termo, Pageable pageable);

    List<Produto> findByAtivoTrueAndEstoqueLessThan(int limite);
}
