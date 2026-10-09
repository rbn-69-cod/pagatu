package pe.edu.upeu.cliente.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ClienteResponse {
    private Long id;
    private String nombre;
    private String email;
    private String telefono;
    private String direccion;
}
