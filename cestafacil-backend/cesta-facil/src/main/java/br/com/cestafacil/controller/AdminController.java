package br.com.cestafacil.controller;

import br.com.cestafacil.model.dto.PedidoDTO.*;
import br.com.cestafacil.model.dto.ProdutoDTO.*;
import br.com.cestafacil.model.enums.StatusPedido;
import br.com.cestafacil.service.*;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.*;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/admin")
@PreAuthorize("hasRole('ADMIN')")
@RequiredArgsConstructor
@Tag(name = "Admin", description = "Painel administrativo – requer perfil ADMIN")
@SecurityRequirement(name = "bearerAuth")
public class AdminController {

    private final ProdutoService produtoService;
    private final PedidoService pedidoService;

    // ── Dashboard ──────────────────────────────────────────────
    @GetMapping("/dashboard")
    @Operation(summary = "Métricas do dashboard")
    public ResponseEntity<DashboardResponse> dashboard() {
        return ResponseEntity.ok(pedidoService.getDashboard());
    }

    // ── Produtos ───────────────────────────────────────────────
    @PostMapping("/produtos")
    @Operation(summary = "Cadastrar produto")
    public ResponseEntity<ProdutoResponse> criarProduto(@Valid @RequestBody ProdutoRequest req) {
        return ResponseEntity.status(HttpStatus.CREATED).body(produtoService.criar(req));
    }

    @PutMapping("/produtos/{id}")
    @Operation(summary = "Atualizar produto")
    public ResponseEntity<ProdutoResponse> atualizarProduto(@PathVariable Long id, @Valid @RequestBody ProdutoRequest req) {
        return ResponseEntity.ok(produtoService.atualizar(id, req));
    }

    @DeleteMapping("/produtos/{id}")
    @Operation(summary = "Desativar produto (soft delete)")
    public ResponseEntity<Void> deletarProduto(@PathVariable Long id) {
        produtoService.deletar(id);
        return ResponseEntity.noContent().build();
    }

    // ── Pedidos ────────────────────────────────────────────────
    @GetMapping("/pedidos")
    @Operation(summary = "Listar todos os pedidos")
    public ResponseEntity<Page<PedidoResponse>> listarPedidos(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return ResponseEntity.ok(pedidoService.listarTodos(page, size));
    }

    @PatchMapping("/pedidos/{id}/status")
    @Operation(summary = "Atualizar status de um pedido")
    public ResponseEntity<PedidoResponse> atualizarStatus(
            @PathVariable Long id,
            @RequestParam StatusPedido status) {
        return ResponseEntity.ok(pedidoService.atualizarStatus(id, status));
    }
}
