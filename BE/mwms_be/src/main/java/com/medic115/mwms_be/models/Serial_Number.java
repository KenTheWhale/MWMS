package com.medic115.mwms_be.models;

import com.medic115.mwms_be.common.Auditable;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "serial_number")
@NoArgsConstructor
@Getter
@Setter
@Builder
@AllArgsConstructor
@AttributeOverride(name = "createdDate", column = @Column(name = "manufactor_date"))
public class Serial_Number extends Auditable {

    @Id
    private Integer id;

    private String code;

    @ManyToOne
    @JoinColumn(name = "batch_id")
    private Batch batch;
}
