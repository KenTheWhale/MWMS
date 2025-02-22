package com.medic115.mwms_be.dto.requests;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CreateImportRequest {
    List<RequestItemList> requestItemList;

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    @Builder
    public static class RequestItemList{
        int equipmentId;
        int partnerId;
        int quantity;
    }

}
