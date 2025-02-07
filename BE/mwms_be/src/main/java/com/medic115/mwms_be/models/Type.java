package com.medic115.mwms_be.models;

import jakarta.persistence.*;
import lombok.*;
import java.util.List;

@Entity
@Table(name = "type")
@NoArgsConstructor
@Getter
@Setter
@Builder
@AllArgsConstructor
public class Type {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String name;

    @OneToMany(mappedBy = "type")
    private List<Request_Application> request_applications;
}
