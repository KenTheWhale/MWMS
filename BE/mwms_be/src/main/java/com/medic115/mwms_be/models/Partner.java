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
@Table(name = "`partner`")
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Partner {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Integer id;

    String type;

    @OneToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "`user_id`")
    User user;

    @OneToMany(mappedBy = "partner")
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    List<RequestItem> requestItems;

    @OneToMany(mappedBy = "partner", cascade = CascadeType.ALL)
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    List<PartnerEquipment> partnerEquipments;
}
