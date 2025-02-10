package com.medic115.mwms_be.models;

import com.medic115.mwms_be.common.Auditable;
import jakarta.persistence.*;
import lombok.*;
import java.util.List;
import java.time.LocalDate;

@Entity
@Table(name = "request_application")
@NoArgsConstructor
@Getter
@Setter
@Builder
@AllArgsConstructor
@AttributeOverride(name = "createdDate", column = @Column(name = "request_date"))
public class Request_Application extends Auditable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String code;

    private Boolean status;

    private LocalDate delivery_date;

    private String carrier_name;

    private String carrier_phone;

    @ManyToOne
    @JoinColumn(name = "task_id")
    private Task task;

    @ManyToOne
    @JoinColumn(name = "partner_id")
    private Partner partner;

    @ManyToOne
    @JoinColumn(name = "type_id")
    private Type type;

    @OneToMany(mappedBy = "request_application")
    private List<Request_Item> request_items;
}
