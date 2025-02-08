package com.medic115.mwms_be.models;

import com.medic115.mwms_be.common.Auditable;
import jakarta.persistence.*;
import lombok.*;
import java.util.List;
@Entity
@Table(name = "area")
@NoArgsConstructor
@Getter
@Setter
@Builder
@AllArgsConstructor
public class Area extends Auditable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String name;

    private Boolean status;

    private Long max_quantity;

    @OneToMany(mappedBy = "area")
    private List<Position> positions;
}
