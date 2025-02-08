package com.medic115.mwms_be.models;

import com.medic115.mwms_be.common.Auditable;
import jakarta.persistence.*;
import lombok.*;
import java.util.List;
import java.time.LocalDate;

@Entity
@Table(name = "equipment")
@NoArgsConstructor
@Getter
@Setter
@Builder
@AllArgsConstructor
public class Equipment extends Auditable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String name;

    private String description;

    private String code;

    private LocalDate expiry_date;

    private Double price;

    private Long quantity;

    @OneToMany(mappedBy = "equipment")
    private List<Request_Item> request_items;

    @ManyToOne
    @JoinColumn(name = "category_id")
    private Category category;
}
