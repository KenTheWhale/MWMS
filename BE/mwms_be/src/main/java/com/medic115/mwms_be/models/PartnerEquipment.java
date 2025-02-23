package com.medic115.mwms_be.models;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "`partner_equipment`")
@FieldDefaults(level = AccessLevel.PRIVATE)
public class PartnerEquipment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Integer id;

    @ManyToOne
    @JoinColumn(name = "`partner_id`")
    Partner partner;

    @ManyToOne
    @JoinColumn(name = "`equipment_id`")
    Equipment equipment;
}
