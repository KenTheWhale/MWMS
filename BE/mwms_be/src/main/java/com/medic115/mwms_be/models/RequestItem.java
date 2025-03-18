package com.medic115.mwms_be.models;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "`request_item`")
@FieldDefaults(level = AccessLevel.PRIVATE)
public class RequestItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Integer id;

    int quantity;

    @ManyToOne
    @JoinColumn(name = "`equipment_id`")
    Equipment equipment;

    @OneToOne(mappedBy = "requestItem"
    , cascade = CascadeType.ALL)
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    Batch batch;

    @ManyToOne
    @JoinColumn(name = "`group_id`")
    ItemGroup itemGroup;

    @ManyToOne
    @JoinColumn(name = "partner_id")
    Partner partner;


}
