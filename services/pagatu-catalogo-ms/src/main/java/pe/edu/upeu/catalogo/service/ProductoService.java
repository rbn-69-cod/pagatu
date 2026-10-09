package pe.edu.upeu.catalogo.service;

import pe.edu.upeu.catalogo.dto.ProductoRequest;
import pe.edu.upeu.catalogo.dto.ProductoResponse;
import pe.edu.upeu.catalogo.entity.Categoria;
import pe.edu.upeu.catalogo.entity.Producto;
import pe.edu.upeu.catalogo.exception.ResourceNotFoundException;
import pe.edu.upeu.catalogo.mapper.ProductoMapper;
import pe.edu.upeu.catalogo.repository.CategoriaRepository;
import pe.edu.upeu.catalogo.repository.ProductoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductoService {

    private final ProductoRepository productoRepository;
    private final ProductoMapper productoMapper;
    private final CategoriaRepository categoriaRepository;

    public List<ProductoResponse> listar() {
        return productoRepository.findAllConCategoria().stream()
                .map(productoMapper::toResponse)
                .toList();
    }

    public ProductoResponse obtener(Long id) {
        return productoMapper.toResponse(buscarOFallar(id));
    }

    public ProductoResponse crear(ProductoRequest request) {
        Producto producto = productoMapper.toEntity(request);
        producto.setCategoria(buscarCategoriaOFallar(request.getCategoriaId()));
        return productoMapper.toResponse(productoRepository.save(producto));
    }

    public ProductoResponse actualizar(Long id, ProductoRequest request) {
        Producto producto = buscarOFallar(id);
        producto.setNombre(request.getNombre());
        producto.setDescripcion(request.getDescripcion());
        producto.setPrecio(request.getPrecio());
        producto.setActivo(request.getActivo());
        producto.setStock(request.getStock());
        producto.setCategoria(buscarCategoriaOFallar(request.getCategoriaId()));
        return productoMapper.toResponse(productoRepository.save(producto));
    }

    public void eliminar(Long id) {
        productoRepository.delete(buscarOFallar(id));
    }

    @org.springframework.transaction.annotation.Transactional
    public void descontarStock(Long id, Integer cantidad) {
        Producto producto = buscarOFallar(id);
        if (producto.getStock() < cantidad) {
            throw new pe.edu.upeu.catalogo.exception.StockInsuficienteException(
                    "Stock insuficiente para producto " + id + ": disponible " + producto.getStock() + ", solicitado " + cantidad);
        }
        producto.setStock(producto.getStock() - cantidad);
        productoRepository.save(producto);
    }

    @org.springframework.transaction.annotation.Transactional
    public void restaurarStock(Long id, Integer cantidad) {
        Producto producto = buscarOFallar(id);
        producto.setStock(producto.getStock() + cantidad);
        productoRepository.save(producto);
    }

    private Producto buscarOFallar(Long id) {
        return productoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Producto no encontrado: " + id));
    }

    private Categoria buscarCategoriaOFallar(Long categoriaId) {
        return categoriaRepository.findById(categoriaId)
                .orElseThrow(() -> new ResourceNotFoundException("Categoria no encontrada: " + categoriaId));
    }
}