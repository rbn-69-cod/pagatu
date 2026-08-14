package pe.edu.upeu.catalogo.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import pe.edu.upeu.catalogo.entity.Categoria;

public interface CategoriaRepository extends JpaRepository<Categoria, Long> {
}
