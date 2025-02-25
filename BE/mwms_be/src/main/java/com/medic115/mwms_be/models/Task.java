package com.medic115.mwms_be.models;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.List;
import java.time.LocalDate;


@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "`task`")
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Task {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Integer id;

    String code;

    String description;

    String status;

    @Column(name = "`assigned_date`")
    LocalDate assignedDate;

    @ManyToOne
    @JoinColumn(name = "staff_id")
    User user;

    @OneToOne
    @JoinColumn(name = "`group_id`")
    ItemGroup itemGroup;

}
