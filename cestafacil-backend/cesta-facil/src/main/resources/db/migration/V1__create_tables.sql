-- ============================================================
-- Cesta Fácil – Migração V1: Criação das tabelas
-- ============================================================

CREATE TABLE IF NOT EXISTS usuarios (
    id           BIGINT         NOT NULL AUTO_INCREMENT,
    nome         VARCHAR(100)   NOT NULL,
    email        VARCHAR(150)   NOT NULL UNIQUE,
    senha_hash   VARCHAR(255)   NOT NULL,
    telefone     VARCHAR(20),
    cep          VARCHAR(9),
    logradouro   VARCHAR(200),
    numero       VARCHAR(10),
    complemento  VARCHAR(100),
    bairro       VARCHAR(100),
    cidade       VARCHAR(100),
    uf           CHAR(2),
    perfil       ENUM('CLIENTE','ADMIN') NOT NULL DEFAULT 'CLIENTE',
    ativo        TINYINT(1)     NOT NULL DEFAULT 1,
    created_at   DATETIME       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at   DATETIME       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS categorias (
    id          BIGINT       NOT NULL AUTO_INCREMENT,
    nome        VARCHAR(80)  NOT NULL,
    descricao   VARCHAR(255),
    ativo       TINYINT(1)   NOT NULL DEFAULT 1,
    PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS produtos (
    id                  BIGINT          NOT NULL AUTO_INCREMENT,
    nome                VARCHAR(150)    NOT NULL,
    descricao           TEXT,
    composicao          TEXT,
    preco               DECIMAL(10,2)   NOT NULL,
    preco_promocional   DECIMAL(10,2),
    imagem_url          VARCHAR(500),
    estoque             INT             NOT NULL DEFAULT 0,
    categoria_id        BIGINT,
    ativo               TINYINT(1)      NOT NULL DEFAULT 1,
    created_at          DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at          DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    FOREIGN KEY (categoria_id) REFERENCES categorias(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS pedidos (
    id                  BIGINT          NOT NULL AUTO_INCREMENT,
    usuario_id          BIGINT          NOT NULL,
    status              ENUM('AGUARDANDO_PAGAMENTO','PAGAMENTO_APROVADO','EM_PREPARACAO','EM_TRANSITO','ENTREGUE','CANCELADO') NOT NULL DEFAULT 'AGUARDANDO_PAGAMENTO',
    valor_subtotal      DECIMAL(10,2)   NOT NULL,
    valor_frete         DECIMAL(10,2)   NOT NULL DEFAULT 0.00,
    valor_total         DECIMAL(10,2)   NOT NULL,
    cep_entrega         VARCHAR(9)      NOT NULL,
    logradouro_entrega  VARCHAR(200)    NOT NULL,
    numero_entrega      VARCHAR(10)     NOT NULL,
    complemento_entrega VARCHAR(100),
    bairro_entrega      VARCHAR(100)    NOT NULL,
    cidade_entrega      VARCHAR(100)    NOT NULL,
    uf_entrega          CHAR(2)         NOT NULL,
    observacao          TEXT,
    created_at          DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at          DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS itens_pedido (
    id              BIGINT          NOT NULL AUTO_INCREMENT,
    pedido_id       BIGINT          NOT NULL,
    produto_id      BIGINT          NOT NULL,
    quantidade      INT             NOT NULL,
    preco_unitario  DECIMAL(10,2)   NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (pedido_id) REFERENCES pedidos(id) ON DELETE CASCADE,
    FOREIGN KEY (produto_id) REFERENCES produtos(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS pagamentos (
    id              BIGINT          NOT NULL AUTO_INCREMENT,
    pedido_id       BIGINT          NOT NULL UNIQUE,
    forma           ENUM('CARTAO_CREDITO','BOLETO','PIX') NOT NULL,
    status          ENUM('PENDENTE','APROVADO','RECUSADO','REEMBOLSADO') NOT NULL DEFAULT 'PENDENTE',
    valor           DECIMAL(10,2)   NOT NULL,
    transacao_id    VARCHAR(255),
    data_pagamento  DATETIME,
    PRIMARY KEY (id),
    FOREIGN KEY (pedido_id) REFERENCES pedidos(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS entregas (
    id              BIGINT       NOT NULL AUTO_INCREMENT,
    pedido_id       BIGINT       NOT NULL UNIQUE,
    status          ENUM('AGUARDANDO','EM_SEPARACAO','SAIU_PARA_ENTREGA','ENTREGUE','TENTATIVA_FALHOU') NOT NULL DEFAULT 'AGUARDANDO',
    codigo_rastreio VARCHAR(100),
    entregador_nome VARCHAR(100),
    data_previsao   DATE,
    data_efetiva    DATETIME,
    observacao      TEXT,
    PRIMARY KEY (id),
    FOREIGN KEY (pedido_id) REFERENCES pedidos(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS avaliacoes (
    id          BIGINT  NOT NULL AUTO_INCREMENT,
    usuario_id  BIGINT  NOT NULL,
    produto_id  BIGINT  NOT NULL,
    nota        TINYINT NOT NULL CHECK (nota BETWEEN 1 AND 5),
    comentario  TEXT,
    created_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY uk_avaliacao (usuario_id, produto_id),
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
    FOREIGN KEY (produto_id) REFERENCES produtos(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
