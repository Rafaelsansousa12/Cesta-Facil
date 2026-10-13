INSERT INTO usuarios (nome, email, senha_hash, telefone, perfil) VALUES
('Administrador', 'admin@cestafacil.com.br',
 '$2a$10$slYQmyNdgTY18LGdwh2Lei1F3hbNlh/bM3kWPTVEBrGa5ZNfFRG2S',
 '(13) 99999-0000', 'ADMIN');

INSERT INTO categorias (nome, descricao) VALUES
('Econômica',  'Cestas com itens essenciais a preço acessível'),
('Familiar',   'Cestas completas para famílias de 4 a 5 pessoas'),
('Gourmet',    'Cestas premium com produtos selecionados'),
('Bebê',       'Kits com produtos específicos para bebês'),
('Especial',   'Cestas temáticas para datas comemorativas');

INSERT INTO produtos (nome, descricao, composicao, preco, preco_promocional, estoque, categoria_id, imagem_url) VALUES
('Cesta Básica Econômica', 'Cesta com os itens essenciais para o mês.', '5kg Arroz, 2kg Feijão, 1L Óleo, 1kg Açúcar, 500g Sal, 1kg Farinha, 1kg Macarrão, 2 latas Sardinha', 89.90, 79.90, 50, 1, 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=400'),
('Cesta Básica Familiar', 'Cesta completa para famílias de 4 a 5 pessoas.', '10kg Arroz, 5kg Feijão, 2L Óleo, 2kg Açúcar, 1kg Sal, 2kg Farinha, 2kg Macarrão, 4 latas Sardinha, 200g Café, 12 ovos', 149.90, NULL, 40, 2, 'https://images.unsplash.com/photo-1607349913338-fca6f7fc42d0?w=400'),
('Cesta Gourmet Premium', 'Cesta com produtos selecionados e especiais.', '5kg Arroz Broto Legal, 2kg Feijão Orgânico, Azeite 500ml, Mel 500g, Café Especial 250g, Massas 2kg', 249.90, 219.90, 20, 3, 'https://images.unsplash.com/photo-1608686207856-001b95cf60ca?w=400'),
('Kit Bebê Essencial', 'Tudo o que bebê e mamãe precisam para o mês.', '4 Fórmula Infantil, 2 Leite Integral, 3 Fralda Pampers M, Shampoo Johnson, Sabonete Baby, Pomada Bepantol', 179.90, NULL, 30, 4, 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=400'),
('Cesta Econômica Plus', 'A cesta econômica com itens extras!', '5kg Arroz, 2kg Feijão, 1L Óleo, 1kg Açúcar, 1kg Macarrão, 2 latas Atum, 200g Café, 400g Biscoito', 99.90, 89.90, 45, 1, 'https://images.unsplash.com/photo-1579113800032-c38bd7635818?w=400'),
('Cesta Familiar Grande', 'Para famílias numerosas!', '15kg Arroz, 8kg Feijão, 3L Óleo, 3kg Açúcar, 3kg Macarrão, 6 latas Sardinha, 400g Café, 24 ovos', 219.90, NULL, 25, 2, 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400'),
('Cesta Especial Natal', 'Celebre o Natal com sua família!', '5kg Arroz, 2kg Feijão, Panetone 750g, Chocotone 750g, Vinho Suave 750ml, Chocolate 400g', 189.90, 169.90, 15, 5, 'https://images.unsplash.com/photo-1512389142860-9c449e58a543?w=400'),
('Kit Bebê Completo', 'O kit