DELETE FROM usuarios WHERE email = 'admin@cestafacil.com.br';

INSERT INTO usuarios (nome, email, senha_hash, telefone, perfil, ativo) VALUES
('Administrador', 'admin@cestafacil.com.br',
 '$2a$10$slYQmyNdgTY18LGdwh2Lei1F3hbNlh/bM3kWPTVEBrGa5ZNfFRG2S',
 '(13) 99999-0000', 'ADMIN', true);