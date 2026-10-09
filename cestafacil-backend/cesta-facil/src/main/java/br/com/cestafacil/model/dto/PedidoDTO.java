package br.com.cestafacil.model.dto;

import br.com.cestafacil.model.enums.*;
import jakarta.validation.constraints.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public class PedidoDTO {

    public record ItemRequest(
        @NotNull Long produtoId,
        @NotNull @Min(1) Integer quantidade
    ) {}

    public record EnderecoRequest(
        @NotBlank String cep,
        @NotBlank String logradouro,
        @NotBlank String numero,
        String complemento,
        @NotBlank String bairro,
        @NotBlank String cidade,
        @NotBlank @Size(min=2, max=2) String uf
    ) {}

    public record PedidoRequest(
        @NotEmpty List<ItemRequest> itens,
        @NotNull EnderecoRequest endereco,
        @NotNull FormaPagamento formaPagamento,
        String observacao
    ) {}

    public record ItemResponse(
        Long id,
        Long produtoId,
        String produtoNome,
        String produtoImagem,
        Integer quantidade,
        BigDecimal precoUnitario,
        BigDecimal subtotal
    ) {}

    public record PagamentoResponse(
        FormaPagamento forma,
        StatusPagamento status,
        BigDecimal valor,
        LocalDateTime dataPagamento
    ) {}

    public record EntregaResponse(
        StatusEntrega status,
        String codigoRastreio,
        String entregadorNome,
        String dataPrevisao,
        LocalDateTime dataEfetiva
    ) {}

    public record PedidoResponse(
        Long id,
        StatusPedido status,
        BigDecimal valorSubtotal,
        BigDecimal valorFrete,
        BigDecimal valorTotal,
        String cepEntrega,
        String logradouroEntrega,
        String numeroEntrega,
        String complementoEntrega,
        String bairroEntrega,
        String cidadeEntrega,
        String ufEntrega,
        String observacao,
        List<ItemResponse> itens,
        PagamentoResponse pagamento,
        EntregaResponse entrega,
        LocalDateTime createdAt
    ) {}

    public record DashboardResponse(
        BigDecimal vendasHoje,
        BigDecimal vendasSemana,
        BigDecimal vendasMes,
        Long pedidosHoje,
        Long pedidosSemana,
        Long produtosEstoqueBaixo,
        Long totalClientes
    ) {}
}
