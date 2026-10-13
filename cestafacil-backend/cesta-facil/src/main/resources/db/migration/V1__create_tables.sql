CREATE TABLE IF NOT EXISTS usuarios (
    id           BIGSERIAL      PRIMARY KEY,
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
    perfil       VARCHAR(10)    NOT NULL DEFAULT 'CLIENTE',
    ativo        BOOLEAN        NOT NULL DEFAULT TRUE,
    created_at   TIMESTAMP      NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at   TIMESTAMP      NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS categorias (
    id          BIGSERIAL    PRIMARY KEY,
    nome        VARCHAR(80)  NOT NULL,
    descricao   VARCHAR(255),
    ativo       BOOLEAN      NOT NULL DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS produtos (
    id                  BIGSERIAL       PRIMARY KEY,
    nome                VARCHAR(150)    NOT NULL,
    descricao           TEXT,
    composicao          TEXT,
    preco               DECIMAL(10,2)   NOT NULL,
    preco_promocional   DECIMAL(10,2),
    imagem_url          VARCHAR(500),
    estoque             INT             NOT NULL DEFAULT 0,
    categoria_id        BIGINT          REFERENCES categorias(id) ON DELETE SET NULL,
    ativo               BOOLEAN         NOT NULL DEFAULT TRUE,
    created_at          TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at          TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS pedidos (
    id                  BIGSERIAL       PRIMARY KEY,
    usuario_id          BIGINT          NOT NULL REFERENCES usuarios(id),
    status              VARCHAR(30)     NOT NULL DEFAULT 'AGUARDANDO_PAGAMENTO',
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
    created_at          TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at          TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS itens_pedido (
    id              BIGSERIAL       PRIMARY KEY,
    pedido_id       BIGINT          NOT NULL REFERENCES pedidos(id) ON DELETE CASCADE,
    produto_id      BIGINT          NOT NULL REFERENCES produtos(id),
    quantidade      INT             NOT NULL,
    preco_unitario  DECIMAL(10,2)   NOT NULL
);

CREATE TABLE IF NOT EXISTS pagamentos (
    id              BIGSERIAL       PRIMARY KEY,
    pedido_id       BIGINT          NOT NULL UNIQUE REFERENCES pedidos(id) ON DELETE CASCADE,
    forma           VARCHAR(20)     NOT NULL,
    status          VARCHAR(20)     NOT NULL DEFAULT 'PENDENTE',
    valor           DECIMAL(10,2)   NOT NULL,
    transacao_id    VARCHAR(255),
    data_pagamento  TIMESTAMP
);

CREATE TABLE IF NOT EXISTS entregas (
    id              BIGSERIAL    PRIMARY KEY,
    pedido_id       BIGINT       NOT NULL UNIQUE REFERENCES pedidos(id) ON DELETE CASCADE,
    status          VARCHAR(30)  NOT NULL DEFAULT 'AGUARDANDO',
    codigo_rastreio VARCHAR(100),
    entregador_nome VARCHAR(100),
    data_previsao   DATE,
    data_efetiva    TIMESTAMP,
    observacao      TEXT
);

CREATE TABLE IF NOT EXISTS avaliacoes (
    id          BIGSERIAL  PRIMARY KEY,
    usuario_id  BIGINT     NOT NULL REFERENCES usuarios(id),
    produto_id  BIGINT     NOT NULL REFERENCES produtos(id),
    nota        SMALLINT   NOT NULL CHECK (nota BETWEEN 1 AND 5),
    comentario  TEXT,
    created_at  TIMESTAMP  NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (usuario_id, produto_id)
);