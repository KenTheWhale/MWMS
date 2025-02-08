package com.medic115.mwms_be.models;

import com.medic115.mwms_be.common.Auditable;
import jakarta.persistence.*;
import lombok.*;
import java.util.List;
@Entity
@Table(name = "request_item")
@NoArgsConstructor
@Getter
@Setter
@Builder
@AllArgsConstructor
public class Request_Item extends Auditable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private Long quantity;

    private Double unit_price;

    @ManyToOne
    @JoinColumn(name = "request_application_id")
    private Request_Application request_application;

    @ManyToOne
    @JoinColumn(name = "equipment_id")
    private Equipment equipment;

    @OneToMany(mappedBy = "request_item")
    private List<Batch> batches;
}
