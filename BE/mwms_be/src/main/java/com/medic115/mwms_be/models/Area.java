package com.medic115.mwms_be.models;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "`area`")
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Area {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Integer id;

    String name;

    String status;

    @Column(name = "`max_quantity`")
    int maxQty;

    @OneToMany(mappedBy = "area")
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    List<Position> positions;
}
