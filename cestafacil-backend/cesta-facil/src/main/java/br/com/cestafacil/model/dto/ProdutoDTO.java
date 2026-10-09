package br.com.cestafacil.model.dto;

import jakarta.validation.constraints.*;
import java.math.BigDecimal;

public class ProdutoDTO {

    public record ProdutoResponse(
        Long id,
        String nome,
        String descricao,
        String composicao,
        BigDecimal preco,
        BigDecimal precoPromocional,
        BigDecimal precoEfetivo,
        String imagemUrl,
        Integer estoque,
        Long categoriaId,
        String categoriaNome,
        Boolean ativo
    ) {}

    public record ProdutoRequest(
        @NotBlank @Size(max=150) String nome,
        String descricao,
        String composicao,
        @NotNull @DecimalMin("0.01") BigDecimal preco,
        BigDecimal precoPromocional,
        String imagemUrl,
        @NotNull @Min(0) Integer estoque,
        Long categoriaId
    ) {}

    public record CategoriaResponse(
        Long id,
        String nome,
        String descricao
    ) {}
}
