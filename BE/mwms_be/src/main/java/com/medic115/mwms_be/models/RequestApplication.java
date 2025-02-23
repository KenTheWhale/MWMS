package com.medic115.mwms_be.models;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;
import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "`request_application`")
@FieldDefaults(level = AccessLevel.PRIVATE)
public class RequestApplication {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Integer id;

    String code;

    String status;

    String type;

    @Column(name = "`request_date`")
    LocalDate requestDate;

    @Column(name = "`last_modified_date`")
    LocalDate lastModifiedDate;

    @OneToMany(mappedBy = "requestApplication")
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    List<ItemGroup> itemGroups;
}
