package br.com.cestafacil.service;

import br.com.cestafacil.exception.BusinessException;
import br.com.cestafacil.model.dto.AuthDTO.*;
import br.com.cestafacil.model.entity.Usuario;
import br.com.cestafacil.model.enums.PerfilUsuario;
import br.com.cestafacil.repository.UsuarioRepository;
import br.com.cestafacil.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuthService {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authenticationManager;

    public AuthResponse login(LoginRequest request) {
        try {
            authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(request.email(), request.senha()));
        } catch (Exception e) {
            log.error("Erro na autenticacao: {} - {}", e.getClass().getName(), e.getMessage());
            throw e;
        }
        Usuario usuario = usuarioRepository.findByEmail(request.email()).orElseThrow();
        String token = jwtUtil.generateToken(usuario);
        return new AuthResponse(token, "Bearer", usuario.getId(), usuario.getNome(), usuario.getEmail(), usuario.getPerfil());
    }

    public AuthResponse register(RegisterRequest request) {
        if (usuarioRepository.existsByEmail(request.email()))
            throw new BusinessException("E-mail já cadastrado: " + request.email());

        try {
            Usuario usuario = Usuario.builder()
                    .nome(request.nome())
                    .email(request.email())
                    .senhaHash(passwordEncoder.encode(request.senha()))
                    .telefone(request.telefone())
                    .cep(request.cep())
                    .logradouro(request.logradouro())
                    .numero(request.numero())
                    .complemento(request.complemento())
                    .bairro(request.bairro())
                    .cidade(request.cidade())
                    .uf(request.uf())
                    .perfil(PerfilUsuario.CLIENTE)
                    .ativo(true)
                    .build();

            usuarioRepository.save(usuario);
            String token = jwtUtil.generateToken(usuario);
            return new AuthResponse(token, "Bearer", usuario.getId(), usuario.getNome(), usuario.getEmail(), usuario.getPerfil());
        } catch (Exception e) {
            log.error("Erro ao registrar usuario: {}", e.getMessage(), e);
            throw e;
        }
    }

    public UsuarioResponse getMe(String email) {
        Usuario u = usuarioRepository.findByEmail(email).orElseThrow();
        return toResponse(u);
    }

    public UsuarioResponse updateProfile(String email, RegisterRequest req) {
        Usuario u = usuarioRepository.findByEmail(email).orElseThrow();
        u.setNome(req.nome());
        u.setTelefone(req.telefone());
        u.setCep(req.cep());
        u.setLogradouro(req.logradouro());
        u.setNumero(req.numero());
        u.setComplemento(req.complemento());
        u.setBairro(req.bairro());
        u.setCidade(req.cidade());
        u.setUf(req.uf());
        usuarioRepository.save(u);
        return toResponse(u);
    }

    private UsuarioResponse toResponse(Usuario u) {
        return new UsuarioResponse(u.getId(), u.getNome(), u.getEmail(), u.getTelefone(),
            u.getCep(), u.getLogradouro(), u.getNumero(), u.getComplemento(),
            u.getBairro(), u.getCidade(), u.getUf(), u.getPerfil());
    }
}
