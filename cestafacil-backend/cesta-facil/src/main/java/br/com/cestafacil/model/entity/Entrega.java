package br.com.cestafacil.model.entity;

import br.com.cestafacil.model.enums.StatusEntrega;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "entregas")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Entrega {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "pedido_id", nullable = false, unique = true)
    private Pedido pedido;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private StatusEntrega status = StatusEntrega.AGUARDANDO;

    @Column(name = "codigo_rastreio", length = 100)
    private String codigoRastreio;

    @Column(name = "entregador_nome", length = 100)
    private String entregadorNome;

    @Column(name = "data_previsao")
    private LocalDate dataPrevisao;

    @Column(name = "data_efetiva")
    private LocalDateTime dataEfetiva;

    @Column(columnDefinition = "TEXT")
    private String observacao;
}
