package br.com.cestafacil.controller;

import br.com.cestafacil.model.dto.ProdutoDTO.*;
import br.com.cestafacil.service.ProdutoService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
@Tag(name = "Produtos", description = "Catálogo de cestas básicas")
public class ProdutoController {

    private final ProdutoService produtoService;

    @GetMapping("/produtos")
    @Operation(summary = "Lista produtos com filtros e paginação")
    public ResponseEntity<Page<ProdutoResponse>> listar(
            @RequestParam(required = false) String termo,
            @RequestParam(required = false) Long categoriaId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size,
            @RequestParam(defaultValue = "nome") String sort) {
        return ResponseEntity.ok(produtoService.listar(termo, categoriaId, page, size, sort));
    }

    @GetMapping("/produtos/{id}")
    @Operation(summary = "Busca produto por ID")
    public ResponseEntity<ProdutoResponse> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(produtoService.buscarPorId(id));
    }

    @GetMapping("/categorias")
    @Operation(summary = "Lista todas as categorias ativas")
    public ResponseEntity<List<CategoriaResponse>> listarCategorias() {
        return ResponseEntity.ok(produtoService.listarCategorias());
    }
}
