package br.com.cestafacil.service;

import br.com.cestafacil.exception.ResourceNotFoundException;
import br.com.cestafacil.model.dto.ProdutoDTO.*;
import br.com.cestafacil.model.entity.Categoria;
import br.com.cestafacil.model.entity.Produto;
import br.com.cestafacil.repository.CategoriaRepository;
import br.com.cestafacil.repository.ProdutoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProdutoService {

    private final ProdutoRepository produtoRepository;
    private final CategoriaRepository categoriaRepository;

    public Page<ProdutoResponse> listar(String termo, Long categoriaId, int page, int size, String sort) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(sort.startsWith("-") ? Sort.Direction.DESC : Sort.Direction.ASC,
            sort.replaceFirst("^-", "")));
        Page<Produto> produtos;
        if (termo != null && !termo.isBlank())
            produtos = produtoRepository.buscarPorTermo(termo, pageable);
        else if (categoriaId != null)
            produtos = produtoRepository.findByAtivoTrueAndCategoria_Id(categoriaId, pageable);
        else
            produtos = produtoRepository.findByAtivoTrue(pageable);
        return produtos.map(this::toResponse);
    }

    public ProdutoResponse buscarPorId(Long id) {
        return toResponse(findById(id));
    }

    @Transactional
    public ProdutoResponse criar(ProdutoRequest req) {
        Produto p = Produto.builder()
            .nome(req.nome()).descricao(req.descricao()).composicao(req.composicao())
            .preco(req.preco()).precoPromocional(req.precoPromocional())
            .imagemUrl(req.imagemUrl()).estoque(req.estoque()).ativo(true).build();
        if (req.categoriaId() != null)
            p.setCategoria(categoriaRepository.findById(req.categoriaId()).orElse(null));
        return toResponse(produtoRepository.save(p));
    }

    @Transactional
    public ProdutoResponse atualizar(Long id, ProdutoRequest req) {
        Produto p = findById(id);
        p.setNome(req.nome()); p.setDescricao(req.descricao()); p.setComposicao(req.composicao());
        p.setPreco(req.preco()); p.setPrecoPromocional(req.precoPromocional());
        p.setImagemUrl(req.imagemUrl()); p.setEstoque(req.estoque());
        if (req.categoriaId() != null)
            p.setCategoria(categoriaRepository.findById(req.categoriaId()).orElse(null));
        return toResponse(produtoRepository.save(p));
    }

    @Transactional
    public void deletar(Long id) {
        Produto p = findById(id);
        p.setAtivo(false);
        produtoRepository.save(p);
    }

    public List<CategoriaResponse> listarCategorias() {
        return categoriaRepository.findByAtivoTrue().stream()
            .map(c -> new CategoriaResponse(c.getId(), c.getNome(), c.getDescricao()))
            .toList();
    }

    private Produto findById(Long id) {
        return produtoRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Produto não encontrado: " + id));
    }

    ProdutoResponse toResponse(Produto p) {
        return new ProdutoResponse(p.getId(), p.getNome(), p.getDescricao(), p.getComposicao(),
            p.getPreco(), p.getPrecoPromocional(), p.getPrecoEfetivo(), p.getImagemUrl(), p.getEstoque(),
            p.getCategoria() != null ? p.getCategoria().getId() : null,
            p.getCategoria() != null ? p.getCategoria().getNome() : null,
            p.getAtivo());
    }
}
