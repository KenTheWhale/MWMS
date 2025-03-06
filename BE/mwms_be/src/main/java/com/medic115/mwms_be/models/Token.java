package com.medic115.mwms_be.models;


import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "`token`")
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Token{

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Integer id;

    String value;

    String type;

    String status;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "`account_id`")
    Account account;
}
