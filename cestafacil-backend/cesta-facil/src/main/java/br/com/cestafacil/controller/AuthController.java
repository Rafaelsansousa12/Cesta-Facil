package br.com.cestafacil.controller;

import br.com.cestafacil.model.dto.AuthDTO.*;
import br.com.cestafacil.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
@Tag(name = "Autenticação", description = "Login, cadastro e perfil do usuário")
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    @Operation(summary = "Login do usuário")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }

    @PostMapping("/register")
    @Operation(summary = "Cadastro de novo usuário")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(authService.register(request));
    }

    @GetMapping("/me")
    @Operation(summary = "Retorna dados do usuário autenticado")
    public ResponseEntity<UsuarioResponse> me(@AuthenticationPrincipal UserDetails user) {
        return ResponseEntity.ok(authService.getMe(user.getUsername()));
    }

    @PutMapping("/profile")
    @Operation(summary = "Atualiza perfil do usuário")
    public ResponseEntity<UsuarioResponse> updateProfile(
            @AuthenticationPrincipal UserDetails user,
            @Valid @RequestBody RegisterRequest request) {
        return ResponseEntity.ok(authService.updateProfile(user.getUsername(), request));
    }
}
