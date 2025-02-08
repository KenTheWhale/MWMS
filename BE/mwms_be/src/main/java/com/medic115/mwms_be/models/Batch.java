package com.medic115.mwms_be.models;

import com.medic115.mwms_be.common.Auditable;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "batch")
@NoArgsConstructor
@Getter
@Setter
@Builder
@AllArgsConstructor
public class Batch  extends Auditable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String code;

    private Long batch_quantity;

    @ManyToOne
    @JoinColumn(name = "request_item_id")
    private Request_Item request_item;

    @ManyToOne
    @JoinColumn(name = "position_id")
    private Position position;

}
