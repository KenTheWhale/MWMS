package com.medic115.mwms_be.models;

import com.medic115.mwms_be.common.Auditable;
import jakarta.persistence.*;
import lombok.*;
import java.util.List;

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

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "request_item_id", referencedColumnName = "id")
    private Request_Item request_item;

    @ManyToOne
    @JoinColumn(name = "position_id")
    private Position position;

    @OneToMany(mappedBy = "batch")
    private List<Serial_Number> serial_numbers;
}
