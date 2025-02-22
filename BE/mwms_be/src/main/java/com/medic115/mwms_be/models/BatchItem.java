package com.medic115.mwms_be.models;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "`batch_item`")
@FieldDefaults(level = AccessLevel.PRIVATE)
public class BatchItem{

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Integer id;

    @Column(name = "`serial_number`")
    String serialNumber;

    @Column(name = "`imported_date`")
    LocalDate importedDate;

    @ManyToOne
    @JoinColumn(name = "batch_id")
    Batch batch;
}
