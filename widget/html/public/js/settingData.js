var settingData = (function () {
  return {
    sReferRule:{  //用车单 cUnitCode
      dep:"Bill_COM_Depart|cDepCode,cDepName|cDepName&&cUnitName,cDepCode&&cUnitCode,DO_COM_Depart_ID&&iUnitID|3|False|True|isnull(bStop,0)=0",
      item:"Bill_GL_InnerProCate|cInvCode,cInvName|DO_GL_InnerProCate_ID&&iUnitID,cInvCode&&cUnitCode,cInvName&&cUnitName,DO_COM_SubjectNB_ID&&DO_COM_SubjectNB_ID,cSubjectCodeNB&&cSubjectCodeNB,cSubjectNameNB&&cSubjectNameNB,DO_GL_FeeItem_ID,cFeeItemCode,cFeeItemName|3|False|True|isnull(bEndCase,0)=0",
      fee:"Bill_GL_FeeItem|cFeeItemCode,cFeeItemName|cFeeItemCode&&cUnitCode,cFeeItemName&&cUnitName,DO_GL_FeeItem_ID&&iUnitID|3|False|True| ISNULL(DO_GL_FeeItem_ID,0) NOT IN (SELECT distinct DO_GL_FeeItem_ID FROM DO_GL_InnerProCate with(nolock) WHERE ISNULL(DO_GL_FeeItem_ID,0)<>0)"
    },
    sReferRuleOutWork:{ //因公外出任务单 cCostBearingUnitCode
      dep:"Bill_COM_Depart|cDepCode,cDepName|cDepCode&&cCostBearingUnitCode,cDepName&&cCostBearingUnitName,DO_COM_Depart_ID&&iCostBearingUnitID|3|False|True",
      item:"Bill_GL_InnerProCate|cInvCode,cInvName|DO_GL_InnerProCate_ID&&iCostBearingUnitID,cInvCode&&cCostBearingUnitCode,cInvName&&cCostBearingUnitName|3|False|True|ISNULL(bEndCase,0)=0",
      fee:"Bill_GL_FeeItem|cFeeItemCode,cFeeItemName|cFeeItemCode&&cCostBearingUnitCode,cFeeItemName&&cCostBearingUnitName,DO_GL_FeeItem_ID&&iCostBearingUnitID|3|False|True|DO_GL_FeeItem_ID NOT IN (SELECT DO_GL_FeeItem_ID FROM dbo.DO_GL_InnerProCate WITH(NOLOCK) WHERE ISNULL(DO_GL_FeeItem_ID,0)<>0)"
    }
  }
})();
