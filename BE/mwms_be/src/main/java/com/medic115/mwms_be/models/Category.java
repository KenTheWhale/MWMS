package com.medic115.mwms_be.models;

import jakarta.persistence.*;
import lombok.*;
import java.util.List;
@Entity
@Table(name = "category")
@NoArgsConstructor
@Getter
@Setter
@Builder
@AllArgsConstructor
public class Category {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String code;

    private String name;

    private String description;

    @OneToMany(mappedBy = "category")
    private List<Equipment> equipments;
}
