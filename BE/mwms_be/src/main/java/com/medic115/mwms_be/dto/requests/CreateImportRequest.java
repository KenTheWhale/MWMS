package com.medic115.mwms_be.dto.requests;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
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
