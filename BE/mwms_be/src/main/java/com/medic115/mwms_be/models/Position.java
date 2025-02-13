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
@Table(name = "`position`")
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Position {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Integer id;

    String name;


    @OneToMany(mappedBy = "position")
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    List<Batch> batches;

    @ManyToOne
    @JoinColumn(name = "`area_id`")
    Area area;
}
