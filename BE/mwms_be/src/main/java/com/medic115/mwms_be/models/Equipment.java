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
@Table(name = "`equipment`")
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Equipment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Integer id;

    String name;

    String code;

    String description;

    double price;

    String unit;

    @OneToMany(mappedBy = "equipment")
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    List<RequestItem> requestItems;

    @ManyToOne
    @JoinColumn(name = "`category_id`")
    Category category;
}
