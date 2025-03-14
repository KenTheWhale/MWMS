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

    int square;

    @ManyToOne
    @JoinColumn(name = "`equipment_id`")
    Equipment equipment;

    @OneToMany(mappedBy = "area")
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    List<Position> positions;
}
