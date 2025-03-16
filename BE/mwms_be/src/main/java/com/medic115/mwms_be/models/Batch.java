package com.medic115.mwms_be.models;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;
import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "`batch`")
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Batch {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Integer id;

    String code;

    @Column(name = "`equipment_quantity`")
    int equipmentQty;

    @Column(name = "`created_date`")
    LocalDate createdDate;

    @OneToOne
            (cascade = CascadeType.MERGE)
    @JoinColumn(name = "item_id")
    RequestItem requestItem;

    @ManyToOne
            (cascade = CascadeType.MERGE)
    @JoinColumn(name = "`position_id`")
    Position position;

    @OneToMany(mappedBy = "batch", cascade = CascadeType.ALL, orphanRemoval = true)
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    List<BatchItem> batchItems;

    int length;

    int width;
}
