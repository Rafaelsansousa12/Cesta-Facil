package br.com.cestafacil.controller;

import br.com.cestafacil.model.dto.PedidoDTO.*;
import br.com.cestafacil.service.PedidoService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.*;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/pedidos")
@RequiredArgsConstructor
@Tag(name = "Pedidos", description = "Gerenciamento de pedidos do cliente")
@SecurityRequirement(name = "bearerAuth")
public class PedidoController {

    private final PedidoService pedidoService;

    @PostMapping
    @Operation(summary = "Cria novo pedido (transacional)")
    public ResponseEntity<PedidoResponse> criar(
            @Valid @RequestBody PedidoRequest request,
            @AuthenticationPrincipal UserDetails user) {
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(pedidoService.criarPedido(request, user.getUsername()));
    }

    @GetMapping
    @Operation(summary = "Lista pedidos do usuário autenticado")
    public ResponseEntity<Page<PedidoResponse>> listarMeus(
            @AuthenticationPrincipal UserDetails user,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(pedidoService.listarMeusPedidos(user.getUsername(), page, size));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Busca pedido por ID")
    public ResponseEntity<PedidoResponse> buscarPorId(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails user) {
        return ResponseEntity.ok(pedidoService.buscarPorId(id, user.getUsername()));
    }
}
