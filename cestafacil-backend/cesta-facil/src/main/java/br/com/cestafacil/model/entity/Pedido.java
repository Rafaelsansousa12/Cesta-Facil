package br.com.cestafacil.model.entity;

import br.com.cestafacil.model.enums.StatusPedido;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "pedidos")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Pedido {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "usuario_id", nullable = false)
    private Usuario usuario;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private StatusPedido status = StatusPedido.AGUARDANDO_PAGAMENTO;

    @Column(name = "valor_subtotal", nullable = false, precision = 10, scale = 2)
    private BigDecimal valorSubtotal;

    @Column(name = "valor_frete", nullable = false, precision = 10, scale = 2)
    private BigDecimal valorFrete = BigDecimal.ZERO;

    @Column(name = "valor_total", nullable = false, precision = 10, scale = 2)
    private BigDecimal valorTotal;

    @Column(name = "cep_entrega", nullable = false, length = 9)
    private String cepEntrega;

    @Column(name = "logradouro_entrega", nullable = false, length = 200)
    private String logradouroEntrega;

    @Column(name = "numero_entrega", nullable = false, length = 10)
    private String numeroEntrega;

    @Column(name = "complemento_entrega", length = 100)
    private String complementoEntrega;

    @Column(name = "bairro_entrega", nullable = false, length = 100)
    private String bairroEntrega;

    @Column(name = "cidade_entrega", nullable = false, length = 100)
    private String cidadeEntrega;

    @Column(name = "uf_entrega", columnDefinition = "CHAR(2)")
    private String ufEntrega;

    @Column(columnDefinition = "TEXT")
    private String observacao;

    @OneToMany(mappedBy = "pedido", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<ItemPedido> itens = new ArrayList<>();

    @OneToOne(mappedBy = "pedido", cascade = CascadeType.ALL)
    private Pagamento pagamento;

    @OneToOne(mappedBy = "pedido", cascade = CascadeType.ALL)
    private Entrega entrega;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
