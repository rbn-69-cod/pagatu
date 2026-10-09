package pe.edu.upeu.cliente.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import pe.edu.upeu.cliente.dto.ClienteRequest;
import pe.edu.upeu.cliente.dto.ClienteResponse;
import pe.edu.upeu.cliente.entity.Cliente;
import pe.edu.upeu.cliente.repository.ClienteRepository;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ClienteServiceImpl implements ClienteService {

    private final ClienteRepository clienteRepository;

    @Override
    @Transactional(readOnly = true)
    public List<ClienteResponse> listar() {
        return clienteRepository.findAll().stream()
                .map(this::toResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public ClienteResponse obtener(Long id) {
        Cliente cliente = clienteRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Cliente no encontrado: " + id));
        return toResponse(cliente);
    }

    @Override
    @Transactional
    public ClienteResponse crear(ClienteRequest request) {
        Cliente cliente = Cliente.builder()
                .nombre(request.getNombre())
                .email(request.getEmail())
                .telefono(request.getTelefono())
                .direccion(request.getDireccion())
                .build();
        return toResponse(clienteRepository.save(cliente));
    }

    private ClienteResponse toResponse(Cliente c) {
        return ClienteResponse.builder()
                .id(c.getId())
                .nombre(c.getNombre())
                .email(c.getEmail())
                .telefono(c.getTelefono())
                .direccion(c.getDireccion())
                .build();
    }
}
