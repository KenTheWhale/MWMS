package com.medic115.mwms_be.requests;

import lombok.Builder;
import lombok.Data;

@Builder
@Data
public class AssignBatchRequest {
    Integer batchId;
    Integer positionId;
}
