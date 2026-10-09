package br.com.cestafacil.service;

import br.com.cestafacil.exception.*;
import br.com.cestafacil.model.dto.PedidoDTO.*;
import br.com.cestafacil.model.entity.*;
import br.com.cestafacil.model.enums.*;
import br.com.cestafacil.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class PedidoService {

    private final PedidoRepository pedidoRepository;
    private final ProdutoRepository produtoRepository;
    private final UsuarioRepository usuarioRepository;

    @Transactional
    public PedidoResponse criarPedido(PedidoRequest dto, String emailUsuario) {
        Usuario usuario = usuarioRepository.findByEmail(emailUsuario)
            .orElseThrow(() -> new ResourceNotFoundException("Usuário não encontrado"));

        // Validar e calcular itens
        List<ItemPedido> itens = new ArrayList<>();
        BigDecimal subtotal = BigDecimal.ZERO;

        for (ItemRequest itemReq : dto.itens()) {
            Produto produto = produtoRepository.findById(itemReq.produtoId())
                .orElseThrow(() -> new ResourceNotFoundException("Produto não encontrado: " + itemReq.produtoId()));

            if (!produto.getAtivo())
                throw new BusinessException("Produto indisponível: " + produto.getNome());

            if (produto.getEstoque() < itemReq.quantidade())
                throw new InsufficientStockException(
                    "Estoque insuficiente para \"" + produto.getNome() +
                    "\". Disponível: " + produto.getEstoque());

            // Decrementar estoque
            produto.setEstoque(produto.getEstoque() - itemReq.quantidade());
            produtoRepository.save(produto);

            BigDecimal precoUnitario = produto.getPrecoEfetivo();
            subtotal = subtotal.add(precoUnitario.multiply(BigDecimal.valueOf(itemReq.quantidade())));

            ItemPedido item = ItemPedido.builder()
                .produto(produto).quantidade(itemReq.quantidade()).precoUnitario(precoUnitario).build();
            itens.add(item);
        }

        // Calcular frete (regra simples: grátis acima de R$ 200)
        BigDecimal frete = subtotal.compareTo(new BigDecimal("200.00")) >= 0
            ? BigDecimal.ZERO : new BigDecimal("15.00");
        BigDecimal total = subtotal.add(frete);

        // Criar pedido
        EnderecoRequest end = dto.endereco();
        Pedido pedido = Pedido.builder()
            .usuario(usuario)
            .status(StatusPedido.AGUARDANDO_PAGAMENTO)
            .valorSubtotal(subtotal).valorFrete(frete).valorTotal(total)
            .cepEntrega(end.cep()).logradouroEntrega(end.logradouro())
            .numeroEntrega(end.numero()).complementoEntrega(end.complemento())
            .bairroEntrega(end.bairro()).cidadeEntrega(end.cidade()).ufEntrega(end.uf())
            .observacao(dto.observacao())
            .build();

        itens.forEach(item -> { item.setPedido(pedido); pedido.getItens().add(item); });

        // Simular pagamento aprovado (integração Stripe em sandbox)
        Pagamento pagamento = Pagamento.builder()
            .pedido(pedido).forma(dto.formaPagamento())
            .status(StatusPagamento.APROVADO).valor(total)
            .transacaoId("txn_" + UUID.randomUUID().toString().replace("-","").substring(0,16))
            .dataPagamento(LocalDateTime.now()).build();
        pedido.setPagamento(pagamento);
        pedido.setStatus(StatusPedido.PAGAMENTO_APROVADO);

        // Criar entrega
        Entrega entrega = Entrega.builder()
            .pedido(pedido).status(StatusEntrega.AGUARDANDO)
            .codigoRastreio("CF" + System.currentTimeMillis())
            .dataPrevisao(LocalDate.now().plusDays(3)).build();
        pedido.setEntrega(entrega);

        Pedido salvo = pedidoRepository.save(pedido);
        log.info("Pedido #{} criado para {}", salvo.getId(), emailUsuario);

        return toResponse(salvo);
    }

    public Page<PedidoResponse> listarMeusPedidos(String email, int page, int size) {
        Usuario usuario = usuarioRepository.findByEmail(email).orElseThrow();
        Pageable pageable = PageRequest.of(page, size);
        return pedidoRepository.findByUsuario_IdOrderByCreatedAtDesc(usuario.getId(), pageable)
            .map(this::toResponse);
    }

    public PedidoResponse buscarPorId(Long id, String email) {
        Pedido pedido = pedidoRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Pedido não encontrado: " + id));
        // Admin ou dono do pedido
        if (!pedido.getUsuario().getEmail().equals(email)) {
            Usuario u = usuarioRepository.findByEmail(email).orElseThrow();
            if (u.getPerfil() != br.com.cestafacil.model.enums.PerfilUsuario.ADMIN)
                throw new BusinessException("Acesso negado a este pedido");
        }
        return toResponse(pedido);
    }

    // Admin methods
    public Page<PedidoResponse> listarTodos(int page, int size) {
        return pedidoRepository.findAllByOrderByCreatedAtDesc(PageRequest.of(page, size))
            .map(this::toResponse);
    }

    @Transactional
    public PedidoResponse atualizarStatus(Long id, StatusPedido novoStatus) {
        Pedido pedido = pedidoRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Pedido não encontrado: " + id));
        pedido.setStatus(novoStatus);
        if (novoStatus == StatusPedido.EM_TRANSITO && pedido.getEntrega() != null)
            pedido.getEntrega().setStatus(StatusEntrega.SAIU_PARA_ENTREGA);
        if (novoStatus == StatusPedido.ENTREGUE && pedido.getEntrega() != null) {
            pedido.getEntrega().setStatus(StatusEntrega.ENTREGUE);
            pedido.getEntrega().setDataEfetiva(LocalDateTime.now());
        }
        return toResponse(pedidoRepository.save(pedido));
    }

    public DashboardResponse getDashboard() {
        LocalDateTime hoje = LocalDateTime.now().toLocalDate().atStartOfDay();
        LocalDateTime semana = hoje.minusDays(7);
        LocalDateTime mes = hoje.minusDays(30);
        long estoqueBaixo = produtoRepository.findByAtivoTrueAndEstoqueLessThan(5).size();
        long totalClientes = usuarioRepository.count() - 1; // excluir admin
        return new DashboardResponse(
            pedidoRepository.totalVendasPeriodo(hoje),
            pedidoRepository.totalVendasPeriodo(semana),
            pedidoRepository.totalVendasPeriodo(mes),
            pedidoRepository.countByCreatedAtAfter(hoje),
            pedidoRepository.countByCreatedAtAfter(semana),
            estoqueBaixo, Math.max(0, totalClientes));
    }

    private PedidoResponse toResponse(Pedido p) {
        List<ItemResponse> itensResp = p.getItens().stream().map(i -> new ItemResponse(
            i.getId(), i.getProduto().getId(), i.getProduto().getNome(),
            i.getProduto().getImagemUrl(), i.getQuantidade(), i.getPrecoUnitario(), i.getSubtotal()
        )).toList();

        PagamentoResponse pgto = p.getPagamento() == null ? null : new PagamentoResponse(
            p.getPagamento().getForma(), p.getPagamento().getStatus(),
            p.getPagamento().getValor(), p.getPagamento().getDataPagamento());

        EntregaResponse entrega = p.getEntrega() == null ? null : new EntregaResponse(
            p.getEntrega().getStatus(), p.getEntrega().getCodigoRastreio(),
            p.getEntrega().getEntregadorNome(),
            p.getEntrega().getDataPrevisao() != null ? p.getEntrega().getDataPrevisao().format(DateTimeFormatter.ofPattern("dd/MM/yyyy")) : null,
            p.getEntrega().getDataEfetiva());

        return new PedidoResponse(p.getId(), p.getStatus(), p.getValorSubtotal(),
            p.getValorFrete(), p.getValorTotal(), p.getCepEntrega(), p.getLogradouroEntrega(),
            p.getNumeroEntrega(), p.getComplementoEntrega(), p.getBairroEntrega(),
            p.getCidadeEntrega(), p.getUfEntrega(), p.getObservacao(),
            itensResp, pgto, entrega, p.getCreatedAt());
    }
}
