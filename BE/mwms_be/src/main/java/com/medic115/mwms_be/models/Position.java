package com.medic115.mwms_be.models;

import com.medic115.mwms_be.common.Auditable;
import jakarta.persistence.*;
import lombok.*;
import java.util.List;
@Entity
@Table(name = "position")
@NoArgsConstructor
@Getter
@Setter
@Builder
@AllArgsConstructor
public class Position extends Auditable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String name;

    private Boolean status;

    @OneToMany(mappedBy = "position")
    private List<Batch> batches;

    @ManyToOne
    @JoinColumn(name = "area_id")
    private Area area;
}
