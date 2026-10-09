-- ============================================================
-- Cesta Fácil – Migração V2: Dados iniciais
-- ============================================================

-- Admin padrão (senha: Admin@123)
INSERT INTO usuarios (nome, email, senha_hash, telefone, perfil) VALUES
('Administrador', 'admin@cestafacil.com.br',
 '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lh/y',
 '(13) 99999-0000', 'ADMIN');

-- Categorias
INSERT INTO categorias (nome, descricao) VALUES
('Econômica',  'Cestas com itens essenciais de qualidade a preço acessível'),
('Familiar',   'Cestas completas para famílias de 4 a 5 pessoas'),
('Gourmet',    'Cestas premium com produtos selecionados e especiais'),
('Bebê',       'Kits com produtos específicos para bebês e crianças'),
('Especial',   'Cestas temáticas para datas comemorativas');

-- Produtos
INSERT INTO produtos (nome, descricao, composicao, preco, preco_promocional, estoque, categoria_id, imagem_url) VALUES
('Cesta Básica Econômica',
 'Cesta com os itens essenciais para o mês. Ideal para solteiros ou casais.',
 '5kg Arroz, 2kg Feijão, 1L Óleo de Soja, 1kg Açúcar, 500g Sal, 1kg Farinha de Trigo, 1kg Macarrão, 2 latas Sardinha, 1kg Flocão de Milho',
 89.90, 79.90, 50, 1, 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=400'),

('Cesta Básica Familiar',
 'Cesta completa para famílias de 4 a 5 pessoas. Dura o mês inteiro!',
 '10kg Arroz, 5kg Feijão, 2L Óleo de Soja, 2kg Açúcar, 1kg Sal, 2kg Farinha de Trigo, 2kg Macarrão, 4 latas Sardinha, 2kg Flocão de Milho, 1kg Achocolatado, 200g Café, 12 ovos',
 149.90, NULL, 40, 2, 'https://images.unsplash.com/photo-1607349913338-fca6f7fc42d0?w=400'),

('Cesta Gourmet Premium',
 'Cesta com produtos selecionados, importados e orgânicos. Presença garantida.',
 '5kg Arroz Broto Legal, 2kg Feijão Orgânico, Azeite Extra Virgem 500ml, Mel 500g, Granola 400g, Café Especial 250g, Massas Barilla 2kg, Leite Condensado 2un, Creme de Leite 4un, Biscoito Importado, Geleia Especial',
 249.90, 219.90, 20, 3, 'https://images.unsplash.com/photo-1608686207856-001b95cf60ca?w=400'),

('Kit Bebê Essencial',
 'Tudo o que bebê e mamãe precisam para o mês. Produtos de qualidade!',
 '4 Fórmula Infantil, 2 Leite Integral, 3 Fralda Pampers M, 1 Shampoo Johnson, 1 Sabonete Dove Baby, 2 Pomada Bepantol, Algodão, Lenços Umedecidos 3 pacotes',
 179.90, NULL, 30, 4, 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=400'),

('Cesta Econômica Plus',
 'A cesta econômica com um incremento especial. Mais itens, mesmo preço imbatível!',
 '5kg Arroz, 2kg Feijão, 1L Óleo, 1kg Açúcar, 500g Sal, 1kg Macarrão, 2 latas Atum, 1kg Flocão, 200g Café, 400g Biscoito Recheado',
 99.90, 89.90, 45, 1, 'https://images.unsplash.com/photo-1579113800032-c38bd7635818?w=400'),

('Cesta Familiar Grande',
 'Para famílias numerosas! A maior e mais completa de todas as cestas familiares.',
 '15kg Arroz, 8kg Feijão, 3L Óleo, 3kg Açúcar, 1kg Sal, 3kg Farinha, 3kg Macarrão, 6 latas Sardinha, 3kg Flocão, 2kg Achocolatado, 400g Café, 24 ovos, 1kg Leite em Pó',
 219.90, NULL, 25, 2, 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400'),

('Cesta Especial Natal',
 'Celebre o Natal com sua família! Cesta especial com produtos temáticos e presentes.',
 '5kg Arroz, 2kg Feijão, Panetone 750g, Chocotone 750g, Frango inteiro 1.5kg, Vinho Suave 750ml, Passas 200g, Nozes 200g, Castanha de Caju 150g, Chocolate Garoto 400g, Refrigerante 2L',
 189.90, 169.90, 15, 5, 'https://images.unsplash.com/photo-1512389142860-9c449e58a543?w=400'),

('Kit Bebê Completo',
 'O kit mais completo para mamães de primeira viagem! Inclui todos os essenciais.',
 '6 Fórmula Infantil NAN, 4 Leite Integral, 5 Fralda Pampers M, 2 Shampoo Johnson, 2 Sabonete Baby, 3 Pomada Bepantol, Algodão, 5 pacotes Lenços, Talco Johnson, Termômetro',
 229.90, 199.90, 18, 4, 'https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=400');
