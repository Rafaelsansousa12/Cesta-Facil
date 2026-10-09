package br.com.cestafacil.repository;

import br.com.cestafacil.model.entity.Pedido;
import br.com.cestafacil.model.enums.StatusPedido;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public interface PedidoRepository extends JpaRepository<Pedido, Long> {
    Page<Pedido> findByUsuario_IdOrderByCreatedAtDesc(Long usuarioId, Pageable pageable);
    Page<Pedido> findAllByOrderByCreatedAtDesc(Pageable pageable);
    List<Pedido> findByStatus(StatusPedido status);

    @Query("SELECT COALESCE(SUM(p.valorTotal),0) FROM Pedido p WHERE p.createdAt >= :inicio AND p.status != 'CANCELADO'")
    BigDecimal totalVendasPeriodo(LocalDateTime inicio);

    long countByCreatedAtAfter(LocalDateTime inicio);
}
