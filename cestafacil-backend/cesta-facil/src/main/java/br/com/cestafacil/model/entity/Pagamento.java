package br.com.cestafacil.model.entity;

import br.com.cestafacil.model.enums.FormaPagamento;
import br.com.cestafacil.model.enums.StatusPagamento;
import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "pagamentos")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Pagamento {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "pedido_id", nullable = false, unique = true)
    private Pedido pedido;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private FormaPagamento forma;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private StatusPagamento status = StatusPagamento.PENDENTE;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal valor;

    @Column(name = "transacao_id", length = 255)
    private String transacaoId;

    @Column(name = "data_pagamento")
    private LocalDateTime dataPagamento;
}
