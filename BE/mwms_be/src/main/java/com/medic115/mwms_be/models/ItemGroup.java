package com.medic115.mwms_be.models;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity
@Table(name = "`item_group`")
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ItemGroup {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Integer id;

    @ManyToOne
    @JoinColumn(name = "`request_id`")
    RequestApplication requestApplication;

    @OneToMany(mappedBy = "itemGroup")
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    List<RequestItem> requestItems;

    @OneToOne(mappedBy = "itemGroup", cascade = CascadeType.ALL)
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    Task task;

    @Column(name = "`delivery_date`")
    LocalDate deliveryDate;

    @Column(name = "`carrier_name`")
    String carrierName;

    @Column(name = "`carrier_phone`")
    String carrierPhone;

    String status;

    String rejectionReason;
}
