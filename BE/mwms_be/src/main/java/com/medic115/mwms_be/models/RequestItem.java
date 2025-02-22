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

    @Column(name = "`carrier_name`")
    String carrierName;

    @Column(name = "`carrier_phone`")
    String carrierPhone;

    @Column(name = "`unit_price`")
    double unitPrice;

    @ManyToOne
    @JoinColumn(name = "`request_id`")
    RequestApplication requestApplication;

    @ManyToOne
    @JoinColumn(name = "`partner_id`")
    Partner partner;

    @ManyToOne
    @JoinColumn(name = "`equipment_id`")
    Equipment equipment;

    @OneToOne(mappedBy = "requestItem")
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    Batch batch;

    int length;

    int width;
}
