package br.com.cestafacil.model.dto;

import br.com.cestafacil.model.enums.PerfilUsuario;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class AuthDTO {

    public record LoginRequest(
        @NotBlank @Email String email,
        @NotBlank String senha
    ) {}

    public record RegisterRequest(
        @NotBlank @Size(min=2, max=100) String nome,
        @NotBlank @Email String email,
        @NotBlank @Size(min=6, max=50) String senha,
        String telefone,
        String cep,
        String logradouro,
        String numero,
        String complemento,
        String bairro,
        String cidade,
        String uf
    ) {}

    public record AuthResponse(
        String token,
        String tipo,
        Long id,
        String nome,
        String email,
        PerfilUsuario perfil
    ) {}

    public record UsuarioResponse(
        Long id,
        String nome,
        String email,
        String telefone,
        String cep,
        String logradouro,
        String numero,
        String complemento,
        String bairro,
        String cidade,
        String uf,
        PerfilUsuario perfil
    ) {}
}
