package com.medic115.mwms_be.models;

import jakarta.persistence.*;
import lombok.*;
import java.util.List;
@Entity
@Table(name = "partner")
@NoArgsConstructor
@Getter
@Setter
@Builder
@AllArgsConstructor
public class Partner {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String name;

    private String email;

    private String address;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "account_id", referencedColumnName = "id")
    private Account account;

    @OneToMany(mappedBy = "partner")
    private List<Request_Application> request_applications;

}
