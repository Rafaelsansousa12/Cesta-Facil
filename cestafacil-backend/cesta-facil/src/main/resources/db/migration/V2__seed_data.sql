INSERT INTO usuarios (nome, email, senha_hash, telefone, perfil) VALUES
('Administrador', 'admin@cestafacil.com.br',
 '$2a$10$slYQmyNdgTY18LGdwh2Lei1F3hbNlh/bM3kWPTVEBrGa5ZNfFRG2S',
 '(13) 99999-0000', 'ADMIN');

INSERT INTO categorias (nome, descricao) VALUES
('Economica',  'Cestas com itens essenciais a preco acessivel'),
('Familiar',   'Cestas completas para familias de 4 a 5 pessoas'),
('Gourmet',    'Cestas premium com produtos selecionados'),
('Bebe',       'Kits com produtos especificos para bebes'),
('Especial',   'Cestas tematicas para datas comemorativas');

INSERT INTO produtos (nome, descricao, composicao, preco, preco_promocional, estoque, categoria_id, imagem_url) VALUES
('Cesta Basica Economica', 'Cesta com os itens essenciais para o mes.', '5kg Arroz, 2kg Feijao, 1L Oleo, 1kg Acucar, 500g Sal, 1kg Farinha, 1kg Macarrao, 2 latas Sardinha', 89.90, 79.90, 50, 1, 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=400'),
('Cesta Basica Familiar', 'Cesta completa para familias de 4 a 5 pessoas.', '10kg Arroz, 5kg Feijao, 2L Oleo, 2kg Acucar, 1kg Sal, 2kg Farinha, 2kg Macarrao, 4 latas Sardinha, 200g Cafe, 12 ovos', 149.90, NULL, 40, 2, 'https://images.unsplash.com/photo-1607349913338-fca6f7fc42d0?w=400'),
('Cesta Gourmet Premium', 'Cesta com produtos selecionados e especiais.', '5kg Arroz Broto Legal, 2kg Feijao Organico, Azeite 500ml, Mel 500g, Cafe Especial 250g, Massas 2kg', 249.90, 219.90, 20, 3, 'https://images.unsplash.com/photo-1608686207856-001b95cf60ca?w=400'),
('Kit Bebe Essencial', 'Tudo o que bebe e mamae precisam para o mes.', '4 Formula Infantil, 2 Leite Integral, 3 Fralda Pampers M, Shampoo Johnson, Sabonete Baby, Pomada Bepantol', 179.90, NULL, 30, 4, 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=400'),
('Cesta Economica Plus', 'A cesta economica com itens extras!', '5kg Arroz, 2kg Feijao, 1L Oleo, 1kg Acucar, 1kg Macarrao, 2 latas Atum, 200g Cafe, 400g Biscoito', 99.90, 89.90, 45, 1, 'https://images.unsplash.com/photo-1579113800032-c38bd7635818?w=400'),
('Cesta Familiar Grande', 'Para familias numerosas!', '15kg Arroz, 8kg Feijao, 3L Oleo, 3kg Acucar, 3kg Macarrao, 6 latas Sardinha, 400g Cafe, 24 ovos', 219.90, NULL, 25, 2, 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400'),
('Cesta Especial Natal', 'Celebre o Natal com sua familia!', '5kg Arroz, 2kg Feijao, Panetone 750g, Chocotone 750g, Vinho Suave 750ml, Chocolate 400g', 189.90, 169.90, 15, 5, 'https://images.unsplash.com/photo-1512389142860-9c449e58a543?w=400'),
('Kit Bebe Completo', 'O kit mais completo para mamaes de primeira viagem!', '6 Formula Infantil, 5 Fralda Pampers M, 2 Shampoo Johnson, Talco Johnson, Lenccos Umedecidos 5 pacotes', 229.90, 199.90, 18, 4, 'https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=400');